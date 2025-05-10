const db = require('../config/dbConnection');

exports.processPayment = async (req, res) => {
  try {
    // Get user ID from the verified token
    const userId = req.user.id;
    const { amount, payment_method } = req.body; // Removed event_id

    // Validate payment data
    if (!amount || !payment_method) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create payment record
    const [result] = await db.execute(
      `INSERT INTO payments 
       (user_id, amount, payment_method, status) 
       VALUES (?, ?, ?, 'pending')`,
      [userId, amount, payment_method]
    );

    // Process payment based on method
    let paymentStatus = 'completed';
    let receiptUrl = null;

    if (payment_method === 'credit-card') {
      paymentStatus = 'completed';
      receiptUrl = `https://receipts.example.com/${result.insertId}`;
    } else if (payment_method === 'paypal') {
      paymentStatus = 'completed';
      receiptUrl = `https://paypal.com/receipt/${result.insertId}`;
    }

    // Update payment status
    await db.execute(
      `UPDATE payments 
       SET status = ?, receipt_url = ?, payment_date = NOW() 
       WHERE payment_id = ?`,
      [paymentStatus, receiptUrl, result.insertId]
    );

    // Get updated payment record
    const [payment] = await db.execute(
      'SELECT * FROM payments WHERE payment_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      payment: payment[0]
    });

  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ 
      success: false,
      message: "Payment processing failed" 
    });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [payments] = await db.execute(
      `SELECT * FROM payments 
       WHERE user_id = ?
       ORDER BY payment_date DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      payments
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to retrieve payment history" 
    });
  }
};

exports.getPaymentDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const paymentId = req.params.id;

    const [payment] = await db.execute(
      `SELECT * FROM payments
       WHERE payment_id = ? AND user_id = ?`,
      [paymentId, userId]
    );

    if (!payment[0]) {
      return res.status(404).json({ 
        success: false,
        message: "Payment not found" 
      });
    }

    res.status(200).json({
      success: true,
      payment: payment[0]
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to retrieve payment details" 
    });
  }
};