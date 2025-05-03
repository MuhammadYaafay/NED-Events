const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEventsByOrganizer
} = require("../controller/event.controller");
const { verifyToken, isOrganizer } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", verifyToken, isOrganizer, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", verifyToken, isOrganizer, updateEvent);
router.delete("/:id", verifyToken, isOrganizer, deleteEvent);
router.get("/getByOrganizer/:id", getAllEventsByOrganizer);

module.exports = router;
