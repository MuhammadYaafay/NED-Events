const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");

//to show user ticket price for event when "buy ticket" is clicked
const getTicketDetails = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);

    if (!eventId) {
      return res.status(400).json({ message: "Missing event ID" });
    }

    const [ticketRows] = await db.query(
      "SELECT price FROM tickets WHERE event_id = ?",
      [eventId]
    );

    if (ticketRows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ price: ticketRows[0].price });
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const purchaseTicket = async (req, res) => {
  const attendeeId = req.user.id;
  const { eventId } = req.params;
  const { quantity = 1 } = req.body;

  // Start a database transaction
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      await connection.rollback();
      return res.status(400).json({
        message: "Quantity must be a positive integer between 1 and 10",
      });
    }

    // Check user role
    if (req.user.role !== "attendee") {
      await connection.rollback();
      return res.status(403).json({
        message: "Access denied. Only attendees can purchase tickets.",
      });
    }

    // Get ticket information with FOR UPDATE lock
    const [ticketInfo] = await connection.query(
      `SELECT ticket_id, max_quantity, price 
             FROM tickets 
             WHERE event_id = ? 
             FOR UPDATE`,
      [eventId]
    );

    if (!ticketInfo || ticketInfo.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        message: "No tickets available for this event",
      });
    }

    const { ticket_id, max_quantity, price } = ticketInfo[0];

    // Check ticket availability
    const [purchasedTickets] = await connection.query(
      `SELECT COALESCE(SUM(quantity), 0) AS total_purchased 
             FROM ticket_purchases 
             WHERE ticket_id = ?`,
      [ticket_id]
    );

    const totalPurchased = purchasedTickets[0].total_purchased;
    const remainingTickets = max_quantity - totalPurchased;

    if (quantity > remainingTickets) {
      await connection.rollback();
      return res.status(400).json({
        message: `Not enough tickets available. Only ${remainingTickets} remaining`,
        remainingTickets,
      });
    }

    // Simulate payment (in real app, integrate with payment gateway)
    const paymentAmount = price * quantity;
    const paymentSuccessful = true;

    if (!paymentSuccessful) {
      await connection.rollback();
      return res.status(400).json({
        message: "Payment unsuccessful",
      });
    }

    // Record the purchase
    const [purchaseResult] = await connection.query(
      `INSERT INTO ticket_purchases 
             (user_id, ticket_id, quantity, purchase_date, status) 
             VALUES (?, ?, ?, NOW(), 'confirmed')`,
      [attendeeId, ticket_id, quantity]
    );

    // Record payment (optional)
    const [paymentResult] = await connection.query(
      `INSERT INTO payments 
             (user_id, amount, payment_method, status) 
             VALUES (?, ?, 'simulated', 'completed')`,
      [attendeeId, paymentAmount]
    );

    // Link payment to purchase
    await connection.query(
      `INSERT INTO ticket_payments 
             (payment_id, ticket_purchase_id) 
             VALUES (?, ?)`,
      [paymentResult.insertId, purchaseResult.insertId]
    );

    // Commit transaction
    await connection.commit();

    // Return success response
    res.status(201).json({
      message: "Tickets purchased successfully",
      purchaseId: purchaseResult.insertId,
      paymentId: paymentResult.insertId,
      eventId,
      ticketId: ticket_id,
      quantity,
      totalAmount: paymentAmount,
      remainingTickets: remainingTickets - quantity,
    });
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error("Error processing ticket purchase:", error);

    res.status(500).json({
      message: "Failed to process ticket purchase",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    // Release connection back to pool
    if (connection) connection.release();
  }
};

//for myTickets; will show attendee any ticket theyve bought ever
const getTicketsForUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const attendeeId = req.params.id;

    if (req.user.id !== attendeeId || req.user.role !== "attendee") {
      return res.status(403).json({ message: "Access denied." });
    }
    const [tickets] = await db.query(
      `
            SELECT 
              ticket_purchases.purchase_id,
              ticket_purchases.quantity,
              ticket_purchases.purchase_date,
              events.title AS event_title,
              events.start_date AS event_start_date
            FROM ticket_purchases
            JOIN tickets ON ticket_purchases.ticket_id = tickets.ticket_id
            JOIN events ON tickets.event_id = events.event_id
            WHERE ticket_purchases.user_id = ?
            ORDER BY ticket_purchases.purchase_date DESC
          `,
      [attendeeId]
    );

    res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTicketsForEvent = async (req, res) => {
  // *ORGANIZER ONLY*
  // To view who attended (bought tickets for) their event
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const organizerId = req.user.id;

    const eventId = req.params.id;

    const [event] = await db.query(
      "SELECT event_id FROM events WHERE event_id = ? AND organizer_id = ?",
      [eventId, organizerId]
    );

    if (event.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }
    const [tickets] = await db.query(
      `SELECT 
            ticket_purchases.purchase_id,
            ticket_purchases.quantity,
            ticket_purchases.purchase_date,
            ticket_purchases.status,
            users.user_id,
            users.name,
            FROM ticket_purchases
            JOIN tickets ON ticket_purchases.ticket_id = tickets.ticket_id
            JOIN users ON ticket_purchases.user_id = users.user_id
            WHERE tickets.event_id = ?
            ORDER BY ticket_purchases.purchase_date DESC`,
      [eventId]
    );

    res.json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get receipt details for a ticket purchase
const getReceiptDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const purchaseId = parseInt(req.params.id);

    if (!userId || !purchaseId) {
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    // First check if the purchase exists at all
    const [purchaseExists] = await db.query(
      `SELECT purchase_id, user_id FROM ticket_purchases WHERE purchase_id = ?`,
      [purchaseId]
    );

    if (!purchaseExists || purchaseExists.length === 0) {
      return res.status(404).json({ message: "Receipt not found - Purchase does not exist" });
    }

    // Then check if it belongs to the user
    if (purchaseExists[0].user_id !== userId) {
      return res.status(403).json({ 
        message: "Access denied - This receipt does not belong to you"
      });
    }

    // Now fetch the full receipt details
    const [rows] = await db.query(
      `
      SELECT 
        tp.purchase_id AS id,
        tp.quantity,
        tp.purchase_date,
        tp.status,
        t.ticket_id,
        t.event_id,
        e.title AS event_name,
        e.start_date AS event_date,
        e.location,
        CAST(t.price AS DECIMAL(10,2)) AS ticket_price,
        p.payment_id,
        CAST(COALESCE(p.amount, t.price * tp.quantity) AS DECIMAL(10,2)) as amount,
        COALESCE(p.payment_method, 'Card') as payment_method,
        p.payment_date,
        COALESCE(p.status, 'completed') as payment_status,
        p.receipt_url
      FROM ticket_purchases tp
      INNER JOIN tickets t ON tp.ticket_id = t.ticket_id
      INNER JOIN events e ON t.event_id = e.event_id
      LEFT JOIN ticket_payments tpmt ON tp.purchase_id = tpmt.ticket_purchase_id
      LEFT JOIN payments p ON tpmt.payment_id = p.payment_id
      WHERE tp.purchase_id = ?
      LIMIT 1
      `,
      [purchaseId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Receipt details not found" });
    }

    // Return the receipt details
    const receipt = {
      id: rows[0].id,
      event_id: rows[0].event_id,
      event_name: rows[0].event_name,
      event_date: rows[0].event_date,
      location: rows[0].location,
      purchase_date: rows[0].purchase_date,
      payment_method: rows[0].payment_method,
      payment_status: rows[0].payment_status,
      quantity: rows[0].quantity,
      ticket_price: Number(rows[0].ticket_price).toFixed(2),
      amount: Number(rows[0].amount).toFixed(2)
    };

    res.status(200).json({ receipt });

  } catch (error) {
    console.error("Error fetching receipt details:", error);
    res.status(500).json({ 
      message: "Failed to fetch receipt details",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

module.exports = {
  getTicketDetails,
  purchaseTicket,
  getTicketsForUser,
  getTicketsForEvent,
  getReceiptDetails,
};
