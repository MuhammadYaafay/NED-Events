const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");

const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const {
      title,
      description,
      start_date,
      end_date,
      category,
      location,
      image,
      ticket_price,
      ticket_max_quantity,
      has_stall,
      stall_price,
      stall_max_quantity
    } = req.body;

    const organizerId = req.user.id;

    // Validate required fields
    if (!title || !start_date || !end_date || !location || 
        ticket_price === undefined || ticket_max_quantity === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Create event (without capacity)
      const [eventResult] = await connection.query(
        `INSERT INTO events (title, description, start_date, end_date, location, organizer_id, image, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, start_date, end_date, location, organizerId, image || null, category]
      );

      const eventId = eventResult.insertId;

      // Create ticket
      const [ticketResult] = await connection.query(
        `INSERT INTO tickets (event_id, price, max_quantity)
         VALUES (?, ?, ?)`,
        [eventId, parseFloat(ticket_price), parseInt(ticket_max_quantity)]
      );

      // Create stall if needed
      let stallId = null;
      if (has_stall) {
        if (!stall_price || !stall_max_quantity) {
          throw new Error("Stall details missing");
        }
        
        const [stallResult] = await connection.query(
          `INSERT INTO stalls (event_id, price, max_quantity) 
           VALUES (?, ?, ?)`,
          [eventId, parseFloat(stall_price), parseInt(stall_max_quantity)]
        );
        stallId = stallResult.insertId;
      }

      await connection.commit();

      res.status(201).json({
        message: "Event created successfully",
        eventId,
        ticketId: ticketResult.insertId,
        stallId
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ 
      message: error.message || "Internal Server Error" 
    });
  }
};


//get list of all events for browsing
const getAllEvents = async (req, res) => {
  try {
    const [allEvents] = await db.query(
      `
      SELECT 
        e.event_id,
        e.title,
        e.description,
        e.start_date,
        e.end_date,
        e.event_time,
        e.location,
        e.category,
        e.organizer_id,
        t.max_quantity,
        e.status,
        e.image,
        e.created_at,
        e.updated_at,
        t.ticket_id,
        t.price AS ticket_price
      FROM events e
      JOIN tickets t ON t.event_id = e.event_id
      `
    );

    if (!allEvents.length) {
      return res.status(404).json({ message: "No upcoming events found" });
    }

    res.json(allEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get trending events which have been booked the most
const getTrendingEvents = async (req, res) => {
  try {
    const [trendingEvents] = await db.query(
      `
      SELECT 
        e.event_id,
        e.title,
        e.description,
        e.event_time,
        e.start_date,
        e.end_date,
        e.location,
        e.category,
        e.organizer_id,
        t.max_quantity,
        e.status,
        e.image,
        t.price AS ticket_price,
        COALESCE(COUNT(tp.purchase_id), 0) AS booking_count,
        t.max_quantity - COALESCE(SUM(tp.quantity), 0) AS tickets_remaining
      FROM events e
      JOIN tickets t ON t.event_id = e.event_id
      LEFT JOIN ticket_purchases tp ON tp.ticket_id = t.ticket_id
      WHERE e.status = 'upcoming'
      GROUP BY 
        e.event_id,
        e.title,
        e.description,
        e.start_date,
        e.end_date,
        e.location,
        e.organizer_id,
        t.max_quantity,
        e.status,
        e.image,
        t.price
      HAVING booking_count > 0
      ORDER BY booking_count DESC
      LIMIT 5
      `
    );

    if (!trendingEvents.length) {
      // Try a fallback query if no events with purchases exist
      const [fallbackEvents] = await db.query(
        `
        SELECT 
          e.*,
          t.price AS ticket_price,
          t.max_quantity,
          0 AS booking_count,
          t.max_quantity AS tickets_remaining
        FROM events e
        JOIN tickets t ON t.event_id = e.event_id
        WHERE e.status = 'upcoming'
        ORDER BY e.created_at DESC
        LIMIT 5
        `
      );
      
      return res.json(fallbackEvents.length ? fallbackEvents : []);
    }

    res.json(trendingEvents);
  } catch (error) {
    console.error("Error fetching trending events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get details of a individual event/view event
const getEventById = async (req, res) => {
  try {
    //from route
    const { eventid } = req.params;

    //get event details
    const [eventRows] = await db.query(
      `
      SELECT 
        e.event_id,
        e.title,
        e.description,
        e.start_date,
        e.end_date,
        e.event_time,
        e.category,
        e.location,
        e.organizer_id,
        u.name,
        u.profile_image,
        t.max_quantity,
        e.status,
        e.image,
        e.created_at,
        e.updated_at,
        t.ticket_id,
        t.price AS ticket_price,
        COALESCE(COUNT(tp.purchase_id), 0) AS booking_count,
        s.stall_id,
        s.price AS stall_price,
        CASE WHEN s.stall_id IS NOT NULL THEN 1 ELSE 0 END AS has_stall,
        CASE WHEN t.ticket_id IS NOT NULL THEN 1 ELSE 0 END AS has_ticket
      FROM events e
      LEFT JOIN tickets t ON t.event_id = e.event_id
      LEFT JOIN stalls s ON s.event_id = e.event_id
      LEFT JOIN ticket_purchases tp ON tp.ticket_id = t.ticket_id
      LEFT JOIN users u ON u.user_id = e.organizer_id
      WHERE e.event_id = ?
      GROUP BY 
      e.event_id, e.title, e.description, e.start_date, e.end_date,
      e.event_time, e.category, e.location, e.organizer_id, u.name,
      u.profile_image, t.max_quantity, e.status, e.image, e.created_at,
      e.updated_at, t.ticket_id, t.price, s.stall_id, s.price
      LIMIT 1
      `,
      [eventid]
    ); // due to fetching ticket price i have to do this lambi

    if (eventRows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(eventRows[0]);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const organizerId = req.user.id;
    const { title, description, location, start_date, end_date, status } =
      req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const [existingEvent] = await db.query(
      "SELECT event_id FROM events WHERE event_id = ? AND organizer_id = ?",
      [eventId, organizerId]
    );

    if (existingEvent.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }

    await db.query(
      `UPDATE events 
       SET title = ?, description = ?, location = ?, start_date = ?, end_date = ?, status = ?
       WHERE event_id = ?`,
      [title, description, location, start_date, end_date, status, eventId]
    );

    res.json({ message: "Event updated successfully." });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { eventName } = req.body;
    const organizerId = req.user.id;

    if (!eventName) {
      return res.status(400).json({ message: "Event name is required" });
    }

    // Retrieve event ID and organizer ID from the DB
    const [eventRows] = await db.query(
      "SELECT event_id, organizer_id FROM events WHERE title = ? AND organizer_id = ?",
      [eventName, organizerId]
    );

    if (eventRows.length === 0) {
      return res.status(404).json({
        message: "Event not found or you are not the organizer",
      });
    }

    const eventId = eventRows[0].event_id;

    // Delete the event (tickets and stalls will be deleted automatically via ON DELETE CASCADE)
    await db.query("DELETE FROM events WHERE event_id = ?", [eventId]);

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get events for a specific attendee
const getEventsByAttendee = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const [eventRows] = await db.query(
      `
      SELECT 
        e.event_id,
        e.title,
        e.start_date,
        e.end_date,
        t.price AS ticket_price,
        tp.quantity AS tickets_booked
        tp.status
      FROM events e
      JOIN tickets t ON t.event_id = e.event_id
      LEFT JOIN ticket_purchases tp ON tp.ticket_id = t.ticket_id AND tp.user_id = ?
      WHERE tp.user_id = ?
      `,
      [userId, userId]
    );

    if (eventRows.length === 0) {
      return res.status(404).json({ message: "No events found for this user" });
    }

    res.status(200).json(eventRows);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllEventsByOrganizer = async (req, res) => {
  try {
    const { organizerId } = req.user;

    if (!organizerId) {
      return res.status(400).json({ message: "Organizer ID is required" });
    }

    // Get event details with total attendees (distinct users who purchased tickets)
    const [eventRows] = await db.query(
      `
      SELECT 
        e.event_id,
        e.title,
        e.start_date,
        COUNT(DISTINCT tp.user_id) AS total_attendees
      FROM events e
      JOIN tickets t ON t.event_id = e.event_id
      LEFT JOIN ticket_purchases tp ON tp.ticket_id = t.ticket_id
      WHERE e.organizer_id = ?
      GROUP BY e.event_id
      `,
      [organizerId]
    );

    if (eventRows.length === 0) {
      return res.status(404).json({ message: "No events found for this organizer" });
    }

    res.status(200).json(eventRows);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = {
  createEvent,
  getAllEvents,
  getTrendingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEventsByOrganizer,
  getEventsByAttendee,
};
