const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");

//to show user ticket price for event when "buy ticket" is clicked
const getTicketDetails = async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventid);
  
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

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        //check if the user is attendee
        if (req.user.role !== 'attendee') { 
            return res.status(403).json({ message: "Access denied." });
        }
        
        const [ticketInfo] = await db.query(
            "SELECT ticket_id, max_quantity FROM tickets WHERE event_id = ?", [eventId]
        );

        if (ticketInfo.length === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const { ticket_id, max_quantity } = ticketInfo[0]; 

        //check if max capacity has exceeded
        const [purchasedTickets] = await db.query(
            "SELECT SUM(quantity) AS total_purchased FROM ticket_purchases WHERE ticket_id = ?", [ticket_id]
        );

        const totalPurchased = purchasedTickets[0].total_purchased || 0; //defaults to zero

        if (totalPurchased >= max_quantity) {
            return res.status(400).json({ message: "Tickets sold out" });
        }

        //now it'd route to payment gateway but we dont have that so 
        //hardcoded to simulate gateway response
        const isValidated = true; 

        if (!isValidated) {
            return res.status(400).json({ message: "Payment unsuccessful" });
        }

        //insert new entry in ticket_purchases
        const [purchaseResult] = await db.query(`
            INSERT INTO ticket_purchases (user_id, ticket_id, event_id, quantity, purchase_date, status) 
            VALUES (?, ?, ?, 1, NOW(), 'completed')`, [attendeeId, ticket_id, eventId]);

        res.status(201).json({
            message: "Ticket purchased successfully",
            purchaseId: purchaseResult.insertId,
            eventId,
            ticketId: ticket_id,
            quantity: 1
        });

    } catch (error) {
        console.error("Error completing purchase:", error);
        res.status(500).json({ message: "Internal Server Error" });
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

        if (req.user.id !== attendeeId || req.user.role !== 'attendee') {
            return res.status(403).json({ message: "Access denied." });
        }
        const [tickets] = await db.query(`
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
          `, [attendeeId]);

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
            ORDER BY ticket_purchases.purchase_date DESC`, [eventId]);

        res.json({ tickets });

    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};





module.exports = {
    getTicketDetails,
    purchaseTicket,
    getTicketsForUser,
    getTicketsForEvent
};