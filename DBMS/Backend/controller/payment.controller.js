const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");

const processPayment = async (req, res) => {
    const userId = req.user.id;
    const { eventId, ticketQuantity = 1, stallBookingId } = req.body;
    const paymentMethod = req.body.paymentMethod || 'credit-card';

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Validate payment method
        const validMethods = ['credit-card', 'paypal'];
        if (!validMethods.includes(paymentMethod)) {
            await connection.rollback();
            return res.status(400).json({ message: "Invalid payment method" });
        }

        // Initialize payment details
        let paymentAmount = 0;
        let paymentDescription = '';
        let relatedEntities = [];

        // Process ticket purchase if exists
        if (eventId && ticketQuantity) {
            const [ticket] = await connection.query(
                `SELECT ticket_id, price, max_quantity 
                 FROM tickets 
                 WHERE event_id = ? 
                 FOR UPDATE`,
                [eventId]
            );

            if (!ticket.length) {
                await connection.rollback();
                return res.status(404).json({ message: "Event tickets not found" });
            }

            const { ticket_id, price, max_quantity } = ticket[0];

            // Check availability
            const [purchased] = await connection.query(
                `SELECT COALESCE(SUM(quantity), 0) AS total 
                 FROM ticket_purchases 
                 WHERE ticket_id = ?`,
                [ticket_id]
            );

            const remaining = max_quantity - purchased[0].total;
            if (ticketQuantity > remaining) {
                await connection.rollback();
                return res.status(400).json({ 
                    message: `Only ${remaining} tickets available`,
                    remainingTickets: remaining
                });
            }

            // Calculate ticket amount
            const ticketAmount = price * ticketQuantity;
            paymentAmount += ticketAmount;
            paymentDescription += `${ticketQuantity} ticket(s) for event ${eventId}`;

            // Record purchase
            const [purchase] = await connection.query(
                `INSERT INTO ticket_purchases 
                 (user_id, ticket_id, quantity, status) 
                 VALUES (?, ?, ?, 'confirmed')`,
                [userId, ticket_id, ticketQuantity]
            );

            relatedEntities.push({
                type: 'ticket',
                id: purchase.insertId
            });
        }

        // Process stall booking if exists
        if (stallBookingId) {
            const [stall] = await connection.query(
                `SELECT sb.booking_id, s.price
                 FROM stall_bookings sb
                 JOIN stalls s ON sb.stall_id = s.stall_id
                 WHERE sb.booking_id = ? AND sb.vendor_id = ? AND sb.status = 'pending'
                 FOR UPDATE`,
                [stallBookingId, userId]
            );

            if (!stall.length) {
                await connection.rollback();
                return res.status(404).json({ message: "Stall booking not found or already processed" });
            }

            const stallAmount = stall[0].price;
            paymentAmount += stallAmount;
            paymentDescription += `${paymentDescription ? ' and ' : ''}stall booking`;

            // Update stall status
            await connection.query(
                `UPDATE stall_bookings 
                 SET status = 'confirmed' 
                 WHERE booking_id = ?`,
                [stallBookingId]
            );

            relatedEntities.push({
                type: 'stall',
                id: stallBookingId
            });
        }

        // Validate total amount
        if (paymentAmount <= 0) {
            await connection.rollback();
            return res.status(400).json({ message: "Invalid payment amount" });
        }

        // Record payment
        const [payment] = await connection.query(
            `INSERT INTO payments 
             (user_id, amount, payment_method, status, description) 
             VALUES (?, ?, ?, 'completed', ?)`,
            [userId, paymentAmount, paymentMethod, paymentDescription]
        );

        // Link payment to related entities
        for (const entity of relatedEntities) {
            if (entity.type === 'ticket') {
                await connection.query(
                    `INSERT INTO ticket_payments 
                     (payment_id, ticket_purchase_id) 
                     VALUES (?, ?)`,
                    [payment.insertId, entity.id]
                );
            } else if (entity.type === 'stall') {
                await connection.query(
                    `INSERT INTO stall_payments 
                     (payment_id, stall_booking_id) 
                     VALUES (?, ?)`,
                    [payment.insertId, entity.id]
                );
            }
        }

        // Commit transaction
        await connection.commit();

        // Prepare response
        const response = {
            paymentId: payment.insertId,
            amount: paymentAmount,
            currency: "USD",
            status: "completed",
            timestamp: new Date(),
            items: relatedEntities.map(entity => ({
                type: entity.type,
                id: entity.id
            }))
        };

        // In a real app, you would:
        // 1. Send confirmation email
        // 2. Create notification
        // 3. Update any caches

        res.status(200).json(response);

    } catch (error) {
        await connection.rollback();
        console.error("Payment processing error:", error);
        
        res.status(500).json({ 
            message: "Payment processing failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        connection.release();
    }
};

const getPaymentDetails = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const userId = req.user.id;

        const [payment] = await db.query(
            `SELECT p.*, 
             tp.ticket_purchase_id, 
             sp.stall_booking_id
             FROM payments p
             LEFT JOIN ticket_payments tp ON p.payment_id = tp.payment_id
             LEFT JOIN stall_payments sp ON p.payment_id = sp.payment_id
             WHERE p.payment_id = ? AND p.user_id = ?`,
            [paymentId, userId]
        );

        if (!payment.length) {
            return res.status(404).json({ message: "Payment not found" });
        }

        // Get detailed items
        const items = [];
        
        if (payment[0].ticket_purchase_id) {
            const [ticket] = await db.query(
                `SELECT tp.*, t.event_id, e.title 
                 FROM ticket_purchases tp
                 JOIN tickets t ON tp.ticket_id = t.ticket_id
                 JOIN events e ON t.event_id = e.event_id
                 WHERE tp.purchase_id = ?`,
                [payment[0].ticket_purchase_id]
            );
            
            if (ticket.length) {
                items.push({
                    type: "ticket",
                    id: ticket[0].purchase_id,
                    eventId: ticket[0].event_id,
                    eventTitle: ticket[0].title,
                    quantity: ticket[0].quantity
                });
            }
        }

        if (payment[0].stall_booking_id) {
            const [stall] = await db.query(
                `SELECT sb.*, e.event_id, e.title 
                 FROM stall_bookings sb
                 JOIN stalls s ON sb.stall_id = s.stall_id
                 JOIN events e ON s.event_id = e.event_id
                 WHERE sb.booking_id = ?`,
                [payment[0].stall_booking_id]
            );
            
            if (stall.length) {
                items.push({
                    type: "stall",
                    id: stall[0].booking_id,
                    eventId: stall[0].event_id,
                    eventTitle: stall[0].title,
                    stallNumber: stall[0].stall_number
                });
            }
        }

        const response = {
            paymentId: payment[0].payment_id,
            amount: payment[0].amount,
            method: payment[0].payment_method,
            status: payment[0].status,
            date: payment[0].payment_date,
            items
        };

        res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching payment details:", error);
        res.status(500).json({ 
            message: "Failed to retrieve payment details",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    processPayment,
    getPaymentDetails
};