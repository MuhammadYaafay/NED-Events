const {db} = require("../config/dbConnection");


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
function updateUserProfile() {
  return async (req, res) => {
    try {
      const userId = req.params.id; // Get the user ID from the request parameters
      const { image_url, bio } = req.body; // Get the updated data from the request body

      // Update the user in the database
      const [result] = await db.query(
        "UPDATE users SET bio = ?, image_url = ? WHERE id = ?",
        [bio, image_url, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return a success message in the response
      res.status(200).json({ message: "User profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
module.exports = {
  getUserbyID,
  updateUserProfile,
};