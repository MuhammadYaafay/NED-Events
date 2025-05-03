const express = require("express");
const {
    purchaseTicket,
    getTicketsForUser,
    getTicketsForEvent
} = require("../controller/ticket.controller");
const { verifyToken, isOrganizer } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/purchaseTicket", verifyToken, purchaseTicket);
router.get("/myTickets", verifyToken,getTicketsForUser);
router.get("/eventTickets",isOrganizer, getTicketsForEvent);

module.exports = router;
