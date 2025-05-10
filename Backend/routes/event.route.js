const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEventsByOrganizer,
  getTrendingEvents,
  eventHistory
} = require("../controller/event.controller");
const { verifyToken, isOrganizer } = require("../middlewares/auth.middleware");
const { validateEventCreation } = require("../middlewares/validateRequest.middleware");

const router = express.Router();

router.post("/create", verifyToken, isOrganizer, validateEventCreation, createEvent);
router.get("/", getAllEvents);
router.get("/eventHistory", verifyToken, eventHistory);
router.get("/getByOrganizer", verifyToken, isOrganizer, getAllEventsByOrganizer);
router.get("/trending", getTrendingEvents);
router.get("/:eventid", getEventById);
router.put("/:id", verifyToken, isOrganizer, updateEvent);
router.delete("/:id", verifyToken, isOrganizer, deleteEvent);

module.exports = router;
