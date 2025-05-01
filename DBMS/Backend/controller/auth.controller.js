const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const db = require("../config/dbConnection");
const { hashedPassword, comparePassword } = require("../utils/hashPassword");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await hashedPassword(password);

    const [newUser] = await db.query(
      `INSERT INTO users (name, email, password, role) VALUES(?,?,?,?)`,
      [name, email, hashPassword, role || "attendee"]
    );

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.insertId,
        name,
        email,
        role: role,
      },
    });
  } catch (error) {
    console.error("Registration failed", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    //get user
    const [users] = await db.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    //check if user exists
    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = users[0];

    //check password
    // inpPassword is the password that user entered in the login form
    // hashedPassword is the password that is stored in the database

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    //generate jwt
    const token = jwt.sign(
      {
        id: user.user_id, //this was set to user.id which is not in our db column(in our db there is user_id) so that is why in token the id for user was not generated
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("login error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const [users] = await db.query(

      `SELECT user_id, name, email, role, profile_image, created_at FROM users WHERE user_id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = users[0];
    res.json(user);
  } catch (error) {
    console.error("get profile error", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
