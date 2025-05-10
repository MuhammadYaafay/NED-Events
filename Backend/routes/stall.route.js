const express = require("express");
const {
  requestStallBooking,
  getStallBookingRequests,
  approveStallBooking,
  rejectStallBooking,
  getVendorStallBookingRequestsHistory,
  getVendorProducts,
  updateVendorProducts,
  deleteVendorProducts,
  getVendorEvents,
  addStall,
  addVendorProducts,
} = require("../controller/stall.controller");
const {
  verifyToken,
  isVendor,
  isOrganizer,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/addVendorProducts", verifyToken, isVendor, addVendorProducts);

router.post('/addStalls/:event_id', verifyToken, isOrganizer, addStall);

router.post(
  "/requestStallBooking/:event_id",
  verifyToken,
  isVendor,
  requestStallBooking
);

router.get(
  "/getStallBookingRequests",
  verifyToken,
  isOrganizer,
  getStallBookingRequests
);

router.patch(
  "/confirmStalls/:booking_id",
  verifyToken,
  isOrganizer,
  approveStallBooking
);

router.patch(
  "/cancelStalls/:booking_id",
  verifyToken,
  isOrganizer,
  rejectStallBooking
);

router.get(
  "/bookingsHistory",
  verifyToken,
  isVendor,
  getVendorStallBookingRequestsHistory
);

router.get("/getVendorProducts", verifyToken, isVendor, getVendorProducts);

router.patch(
  "/updateVendorProducts/:product_id",
  verifyToken,
  isVendor,
  updateVendorProducts
);

router.delete(
  "/deleteVendorProducts/:product_id",
  verifyToken,
  isVendor,
  deleteVendorProducts
);

router.get("/getVendorEvents", verifyToken, isVendor, getVendorEvents);

module.exports = router;
