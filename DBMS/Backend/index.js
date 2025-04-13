import express from "express"
import cors from "cors"
import eventHistoryRoute from "./route/showEvents.js";


const app = express();
const port = 8800;

app.use(express.json())
app.use(cors())

app.use("/", eventHistoryRoute)

app.listen(port, () => {
    console.log("Connected!");
})