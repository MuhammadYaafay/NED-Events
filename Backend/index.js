const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const stallRoutes = require("./routes/stall.route");
const userEngagementRoutes = require("./routes/userEngagement.route");
const eventRoutes = require("./routes/event.route")
const ticketRoutes = require("./routes/ticket.route")
const paymentRoutes = require("./routes/payment.route");

const app = express();
dotenv.config();

const port = process.env.PORT || 8800;

// Increase JSON limit for large payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure CORS
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to handle CORS preflight requests
app.options("/api/event", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://ned-event-adils-projects-bcd5cacf.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).end();
});
//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/stall", stallRoutes);
app.use("/api/userEngagement", userEngagementRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/payment", paymentRoutes); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
