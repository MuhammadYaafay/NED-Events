const express = require("express");
const {processPayment, getPaymentDetails} = require("../controller/payment.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/processPayment", verifyToken, processPayment); // Process payment
router.get("/paymentDetails/:id", verifyToken, getPaymentDetails); // Get payment details by ID

module.exports = router;
