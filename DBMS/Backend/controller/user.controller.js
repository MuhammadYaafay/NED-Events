const db = require("../config/dbConnection");
const { validationResult } = require("express-validator");

function updateUserDetails() {
  return async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      const userId = req.user.id; // Get user ID from verified token
      const { name = undefined, bio = undefined, image_url = undefined, email = undefined } = req.body;

      let updateQuery = "UPDATE users SET";
      const updateValues = [];
      const updateFields = [];

      if (name) {
        updateFields.push(" name = ?");
        updateValues.push(name);
      }
      if (bio) {
        updateFields.push(" bio = ?");
        updateValues.push(bio);
      }
      if (image_url) {
        updateFields.push(" image_url = ?");
        updateValues.push(image_url);
      }
      if (email) {
        updateFields.push(" email = ?");
        updateValues.push(email);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }

      updateQuery += updateFields.join(",") + " WHERE id = ?";
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
        "SELECT id, name, email, bio, image_url FROM users WHERE role = 'vendor'"
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
      const userId = req.params.id; // Get the user ID from the request parameters

      // Query the database to get the user by ID
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = rows[0]; // Get the first row from the result

      // Return the user data in the response
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