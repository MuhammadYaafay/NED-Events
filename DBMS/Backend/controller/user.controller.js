const db = require("../config/dbConnection.js");
const { validationResult } = require("express-validator");
const { hashedPassword, comparePassword } = require("../utils/hashPassword");

function updateUserDetails() {
  return async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      // Get userId from URL params
      const userId = req.params.id;

      // Extract fields from the request body
      const {  profile_image, email, password } = req.body;

      let updateQuery = "UPDATE users SET";
      const updateValues = [];
      const updateFields = [];

      if (name) {
        updateFields.push("name = ?");
        updateValues.push(name);
      }
      if (bio) {
        updateFields.push("bio = ?");
        updateValues.push(bio);
      }
      if (profile_image) {
        updateFields.push("profile_image = ?");
        updateValues.push(profile_image);
      }
      if (email) {
        updateFields.push("email = ?");
        updateValues.push(email);
      }
      if (password) {
        const hashedPassword = await comparePassword(password);
        updateFields.push("password = ?");
        updateValues.push(hashedPassword);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }

      updateQuery += updateFields.join(",") + " WHERE user_id = ?";
      updateValues.push(userId);

      const [result] = await db.query(updateQuery, updateValues);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
      console.error("Error updating user details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

function getAllVendors() {
  return async (req, res) => {
    try {
      // Check if user is organizer
      if (req.user.role !== 'organizer') {
        return res.status(403).json({ message: 'Access denied. Only organizers can view vendors.' });
      }

      // Query to get all vendors
      const [vendors] = await db.query(
        "SELECT user_id, name, email, bio, profile_image FROM users WHERE role = 'vendor'"
      );

      res.status(200).json({
        message: "Vendors retrieved successfully",
        vendors: vendors
      });

    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

function getUserbyID() {
  return async (req, res) => {
    try {
      const userId = req.params.id;

      // Query the database to get the user by ID
      const [rows] = await db.query(
        "SELECT user_id, name, email, bio, profile_image, role, created_at FROM users WHERE user_id = ?", 
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = rows[0];
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = {
  getUserbyID,
  updateUserDetails,
  getAllVendors
};
// Compare this snippet from dbms/Backend/controller/user.controller.js: