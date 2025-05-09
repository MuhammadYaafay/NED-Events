const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const db = require("../config/dbConnection");

//add to favourates
const addToFavourites = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { event_id } = req.params;
    const user_id = req.user.id;

    const [existingEvent] = await db.query(
      "SELECT * FROM event_favorites WHERE event_id = ? AND user_id = ?",
      [event_id, user_id]
    );
    if (existingEvent.length > 0) {
      return res.status(400).json({ message: "Event already in favourites" });
    }
    const [result] = await db.query(
      "INSERT INTO event_favorites (event_id, user_id) VALUES (?, ?)",
      [event_id, user_id ]
    );    
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Event added to favourites" });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to add event to favourites" });
    }
  } catch (error) {
    console.error("Error in addToFavourites:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//remove from favourites
const removeFromFavourites = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
      const { event_id } = req.params;
      const user_id = req.user.id;
  
      const [existingEvent] = await db.query(
        "SELECT * FROM event_favorites WHERE event_id = ? AND user_id = ?",
        [event_id, user_id]
      );
      if (existingEvent.length === 0) {
        return res.status(400).json({ message: "Event not in favourites" });
      }
      const [result] = await db.query(
        "DELETE FROM event_favorites WHERE event_id = ? AND user_id = ?",
        [event_id, user_id]
      );
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Event removed from favourites" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to remove event from favourites" });
      }
    } catch (error) {
      console.error("Error in removeFromFavourites:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

//get all favourates
const getAllFavourites = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [favourites] = await db.query(
      `SELECT 
        e.event_id,
        e.title, 
        e.start_date, 
        e.location,
        e.image, 
        t.price AS ticket_price
      FROM event_favorites f 
      JOIN events e ON f.event_id = e.event_id 
      JOIN tickets t ON t.event_id = e.event_id
      WHERE f.user_id = ?`,
      [user_id]
    );

    if (favourites.length > 0) {
      return res.status(200).json(favourites); // send directly as array
    } else {
      return res.status(404).json({ message: "No favourites found" });
    }
  } catch (error) {
    console.error("Error in getAllFavourites:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//add review on eventDetailsPage
const addReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { event_id } = req.params;
    const user_id = req.user.id;
    const { comment, rating } = req.body;

    const [result] = await db.query(
      "INSERT INTO event_reviews (event_id, user_id, comment, rating) VALUES (?, ?, ?, ?)",
      [ event_id, user_id, comment, rating ]
    );
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Review added successfully" });
    } else {
      return res.status(500).json({ message: "Failed to add review" });
    }
  } catch (error) {
    console.error("Error in addReview:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//update review
const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { event_id } = req.params;
    const user_id = req.user.id;
    const { comment, rating } = req.body;

    const [result] = await db.query(
      "UPDATE event_reviews SET comment = ?, rating = ? WHERE event_id = ? AND user_id = ?",
      [comment, rating, event_id, user_id]
    );
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      return res.status(500).json({ message: "Failed to update review" });
    }
  } catch (error) {
    console.error("Error in updateReview:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//delete review
const deleteReview = async (req, res) => {
  try {
    const { event_id } = req.params;
    const user_id = req.user.id;

    const [result] = await db.query(
      "DELETE FROM event_reviews WHERE event_id = ? AND user_id = ?",
      [event_id, user_id]
    );
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(500).json({ message: "Failed to delete review" });
    }
  } catch (error) {
    console.error("Error in deleteReview:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get all reviews
const getAllReviews = async (req, res) => {
  try {
    const { event_id } = req.params;

    const [reviews] = await db.query(
      `SELECT 
        u.name AS userName, u.profile_image AS userImage, er.review_id, er.comment, er.rating, er.created_at AS reviewDate
        FROM event_reviews er
        JOIN users u ON er.user_id = u.user_id
        WHERE event_id = ?
        ORDER BY er.created_at DESC`,
      [event_id]
    );
    if (reviews.length > 0) {
      return res.status(200).json({ reviews });
    } else {
      return res.status(404).json({ message: "No reviews found" });
    }
  } catch (error) {
    console.error("Error in getAllReviews:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    addToFavourites,
    removeFromFavourites,
    getAllFavourites,
    addReview,
    updateReview,
    deleteReview,
    getAllReviews,
}