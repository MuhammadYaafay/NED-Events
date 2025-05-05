const express = require("express");
const {
    getTicketDetails,
    purchaseTicket,
    getTicketsForUser,
    getTicketsForEvent
} = require("../controller/ticket.controller");
const { verifyToken, isOrganizer } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/ticketInfo/:id",verifyToken,getTicketDetails) //event id
router.post("/purchaseTicket/:id", verifyToken, purchaseTicket); //attendee id
router.get("/myTickets/:id", verifyToken,getTicketsForUser); //attendee id
router.get("/eventTickets/:id",isOrganizer, getTicketsForEvent); //event id

module.exports = router;
