const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment.controller');


const { verifyToken } = require('../middlewares/auth.middleware');

// Process new payment (requires authentication)
router.post('/', verifyToken, paymentController.processPayment);

// Get user's payment history (requires authentication)
router.get('/history', verifyToken, paymentController.getPaymentHistory);

// Get specific payment details (requires authentication)
router.get('/:id', verifyToken, paymentController.getPaymentDetails);

module.exports = router;