const db = require("../config/dbConnection.js");
const { validationResult } = require("express-validator");

const updateUserDetails = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.params.id;
      const { bio, profile_image,name } = req.body;

      let updateQuery = "UPDATE users SET ";
      const updateValues = [];
      const updateFields = [];

      if (bio) {
        updateFields.push("bio = ?");
        updateValues.push(bio);
      }
      if (profile_image) {
        updateFields.push("profile_image = ?");
        updateValues.push(profile_image);
      }
      if(name){
        updateFields.push("name = ?");
        updateValues.push(name);
      }
      if (updateFields.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }

      updateQuery += updateFields.join(", ") + " WHERE user_id = ?";
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



const getUserbyID = async (req, res) => {
    try {
      const userId = req.params.id;
      const [rows] = await db.query(
        "SELECT user_id, name, email, bio, profile_image, role, created_at FROM users WHERE user_id = ?", 
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


module.exports = {
  getUserbyID,
  updateUserDetails,
  
};
