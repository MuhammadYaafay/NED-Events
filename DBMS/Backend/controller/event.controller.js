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
      location,
      image,
      ticket_price,   //will be zero for unpaid
      ticket_max_quantity,
      hasStall,       //frontend validation will ensure no other stall-related stuff makes here unless this is true
      stall_price,
      stall_size,
      stall_max_quantity
    } = req.body;

    const organizerId = req.user.id;

    if (!title || !start_date || !end_date || !location || ticket_price === undefined || ticket_max_quantity === undefined, hasStall === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [eventResult] = await db.query(
      `INSERT INTO events (title, description, start_date, end_date, location, organizer_id, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, start_date, end_date, location, organizerId, image || null]
    );

    //event has been made in event table but ticket needs to be made too 
    const eventId = eventResult.insertId;

    const [ticketResult] = await db.query(
      `INSERT INTO tickets (event_id, price, max_quantity)
       VALUES (?, ?, ?)`,
      [eventId, parseInt(ticket_price), parseInt(ticket_max_quantity)]
    );
    const ticketId = ticketResult.insertId;

    //if stalls and vendors are to be created:
    let stallId = null;
    if (hasStall) {
      if (!stall_price || !stall_size || !stall_max_quantity) {
        return res.status(400).json({ message: "Stall details missing" });
      }
      const [stallResult] = await db.query(
        `INSERT INTO stalls (event_id, size, price, max_quantity) VALUES (?, ?, ?, ?)`,
        [eventId, stall_size, parseInt(stall_price), stall_max_quantity]
      );
    }
    stallId = stallResult.insertId;

    // success msg 

    res.status(201).json({
      message: "Event created successfully",
      eventId,
      ticketId,
      stallId
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get list of all events for browsing
//tentative
const getAllEvents = async (req, res) => {
  try {

    const [allEvents] = await db.query(
      "SELECT * FROM events where status ='upcoming'"
    )
    res.json([allEvents])

  } catch (error) { }
  console.error("Error fetching events:", error);
  res.status(500).json({ message: "Internal Server Error" });
}

//get details of a individual event
const getEventById = async (req, res) => {
  try {
   //from route
    const { eventid } = req.params;

    if (!eventid) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    //get event details
    const [eventRows] = await db.query(
      "SELECT * FROM events WHERE event_id = ?",
      [eventid]
    );

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
    // Check if logged-in user is the organizer of this event
    // Validate input data
    // Update the event fields (title, date, etc.)
    // Return success response
  } catch (error) {
    // Handle and log error
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




module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
