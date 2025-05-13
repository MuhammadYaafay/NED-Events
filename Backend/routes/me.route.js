const express = require("express");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  try {
    // You already have req.user from verifyToken middleware
    const user = req.user;
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;