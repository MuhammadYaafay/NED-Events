const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEventsByOrganizer,
  getTrendingEvents,
} = require("../controller/event.controller");
const { verifyToken, isOrganizer } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", verifyToken, isOrganizer, createEvent);
router.get("/", getAllEvents);
router.get("/trending", getTrendingEvents);
router.get("/:eventid", getEventById);
router.put("/:id", verifyToken, isOrganizer, updateEvent);
router.delete("/:id", verifyToken, isOrganizer, deleteEvent);
router.get("/getByOrganizer", getAllEventsByOrganizer);

module.exports = router;
