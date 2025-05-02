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
} = require("../controller/stall.controller");
const {
  verifyToken,
  isVendor,
  isOrganizer,
} = require("../middlewares/auth.middleware");

const router = express.Router();

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
  "/confirmStalls/:vendor_id",
  verifyToken,
  isOrganizer,
  approveStallBooking
);

router.patch(
  "/cancelStalls/:vendor_id",
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
