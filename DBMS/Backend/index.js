import express from "express";
import cors from "cors";
import { checkConnection } from "./config/dbConnection.js";
const app = express();

app.use(express.json());
app.use(cors());

const port = 8800;

checkConnection().then(() => {
  app.listen(port, () => {
    console.log("Server is listing at :", port);
  });
});
