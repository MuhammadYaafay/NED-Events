import express from "express"

const app = express();

app.use(express.json());

const port = 8800;

app.listen(port, () => {
    console.log("Connected!");
})