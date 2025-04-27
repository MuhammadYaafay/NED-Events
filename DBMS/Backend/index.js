const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/dbConnection");
const authRoutes = require("./routes/auth.route");

const app = express();
dotenv.config();

const port = process.env.PORT || 8800;

app.use(express.json());
app.use(cors());


//Routes
app.use("/api/auth", authRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
