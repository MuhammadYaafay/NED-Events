const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const stallRoutes = require("./routes/stall.route");
const userEngagementRoutes = require("./routes/userEngagement.route");
const eventRoutes = require("./routes/event.route")
const ticketRoutes = require("./routes/ticket.route")


const app = express();
dotenv.config();

const port = process.env.PORT || 8800;

app.use(express.json());
app.use(cors());


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/stall", stallRoutes);
app.use("/api/userEngagement", userEngagementRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/ticket", ticketRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
