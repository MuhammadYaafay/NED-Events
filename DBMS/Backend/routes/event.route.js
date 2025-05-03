const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require("../controller/event.controller");
const { verifyToken, isOrganizer } = require("../middlewares/auth.middleware");
const { createEventValidation } = require("../middlewares/validateRequest.middleware");

const router = express.Router();

router.post("/create", verifyToken, isOrganizer, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", verifyToken, isOrganizer, updateEvent);
router.delete("/:id", verifyToken, isOrganizer, deleteEvent);

module.exports = router;
