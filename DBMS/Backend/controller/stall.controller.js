const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");

//request stall booking on clicking book stall
const requestStallBooking = async (req, res) => {
  try {
    // Step 1: Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }

    const { size, description, products } = req.body;
    const { event_id } = req.params;
    const vendor_id = req.user.id;

    // Step 2: Check if the vendor has already booked a stall for this event
    const [existingBooking] = await db.query(
      `SELECT sb.id FROM stall_bookings sb
       JOIN stalls s ON sb.stall_id = s.id
       WHERE sb.vendor_id = ? AND s.event_id = ?`,
      [vendor_id, event_id]
    );

    if (existingBooking.length > 0) {
      return res
        .status(409)
        .json({
          message: "You have already requested/booked a stall for this event",
        });
    }

    // Step 3: Find an available stall (unbooked) for this event
    const [availableStalls] = await db.query(
      `SELECT s.id FROM stalls s
       LEFT JOIN stall_bookings sb ON s.id = sb.stall_id
       WHERE s.event_id = ? AND sb.stall_id IS NULL
       LIMIT 1`,
      [event_id]
    );

    if (availableStalls.length === 0) {
      return res
        .status(404)
        .json({ message: "No available stalls for this event" });
    }

    const stall_id = availableStalls[0].id;

    // Step 4: Insert booking request
    const [result] = await db.query(
      `INSERT INTO stall_bookings (stall_id, vendor_id, size, description, products)
       VALUES (?, ?, ?, ?, ?)`,
      [stall_id, vendor_id, size, description, products]
    );

    res.status(201).json({
      message: "Stall booking request created successfully",
      request: {
        id: result.insertId,
        stall_id,
        vendor_id,
        event_id,
        size,
        description,
        products,
      },
    });
  } catch (error) {
    console.error("Error in requestStallBooking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all vendor's request
const getStallBookingRequests = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const [requests] = await db.query(
      `SELECT 
        sb.booking_id,
        u.name AS vendor_name,
        e.title AS event_name,
        sb.status,
        sb.created_at AS requested_date
      FROM stall_bookings sb
      JOIN users u ON sb.vendor_id = u.user_id
      JOIN stalls s ON sb.stall_id = s.stall_id
      JOIN events e ON s.event_id = e.event_id
      WHERE sb.status != 'confirmed'
      ORDER BY sb.created_at DESC`
    );

    if (requests.length === 0) {
      return res.status(404).json({ message: "No pending requests found" });
    }

    res.status(200).json({
      message: "Requests fetched successfully",
      requests,
    });
  } catch (error) {
    console.error("Error in getStallBookingRequests:", error);
    res.status(500).json({ message: "Requests fetching failed" });
  }
};

//accept request
const approveStallBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const [existingRequests] = await db.query(
      `SELECT * FROM stall_bookings WHERE booking_id = ? AND status != 'confirmed'`,
      [booking_id]
    );

    if (existingRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "Booking request not found or already handled" });
    }

    const [result] = await db.query(
      `UPDATE stall_bookings SET status = 'approved' WHERE booking_id = ?`,
      [booking_id]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "Approval failed" });
    }

    res.status(200).json({
      message: "Request approved successfully",
      booking_id,
    });
  } catch (error) {
    console.error("Error in approveStallBooking:", error);
    res.status(500).json({ message: "Approval failed" });
  }
};

//reject request
const rejectStallBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const [existingRequests] = await db.query(
      `SELECT * FROM stall_bookingss WHERE booking_id = ? AND status != 'confirmed'`,
      [booking_id]
    );

    if (existingRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "Booking request not found or already handled" });
    }

    const [result] = await db.query(
      `UPDATE stall_bookings SET status = 'rejected' WHERE booking_id = ?`,
      [booking_id]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "Rejection failed" });
    }

    res.status(200).json({
      message: "Request rejected successfully",
      booking_id,
    });
  } catch (error) {
    console.error("Error in rejectStallBooking:", error);
    res.status(500).json({ message: "Rejection failed" });
  }
};

//get vendor products
const getVendorProducts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const vendor_id = req.user.id;
    const [products] = await db.query(
      `SELECT name, price, image FROM products WHERE vendor_id = ?`,
      [vendor_id]
    );
    if (products.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json({
      message: "Products fetched successfully",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Products fetching failed" });
  }
};

// update vendor products
const updateVendorProducts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const vendor_id = req.user.id;
    const { product_id } = req.params;
    const { name, price, image } = req.body;

    const [existingProduct] = await db.query(
      `SELECT * FROM products WHERE product_id = ? AND vendor_id = ?`,
      [product_id, vendor_id]
    )

    if (existingProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const [product] = await db.query(
      `SELECT * FROM products WHERE product_id = ? AND vendor_id = ?`,
      [product_id, vendor_id]
    );
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [updatedProduct] = await db.query(
      `UPDATE products SET name = ?, price = ?, image = ? WHERE product_id = ? AND vendor_id = ?`,
      [name, price, image, product_id, vendor_id]
    );
    if (updatedProduct.affectedRows === 0) {
      return res.status(500).json({ message: "Product updating failed" });
    }
    res.status(200).json({
      message: "Product updated successfully",
      product: { name, price, image, vendor_id, product_id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Product updating failed" });
  }
};

//delete vendor products
const deleteVendorProducts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const vendor_id = req.user.id;
    const { product_id } = req.params;

    const [existingProduct] = await db.query(
      `SELECT * FROM products WHERE product_id = ? AND vendor_id = ?`,
      [product_id, vendor_id]
    );
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const [deletedProduct] = await db.query(
      `DELETE FROM products WHERE product_id = ? AND vendor_id = ?`,
      [product_id, vendor_id]
    );
    res.status(200).json({
      message: "Product deleted successfully",
      product: {
        product_id,
        vendor_id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Product deleting failed" });
  }
};

//get vendor events
const getVendorEvents = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const vendor_id = req.user.id;
    const [events] = await db.query(
      `SELECT * FROM events WHERE vendor_id = ?`,
      [vendor_id]
    );
    if (events.length === 0) {
      return res.status(404).json({ message: "Events not found" });
    }
    res.status(200).json({
      message: "Events fetched successfully",
      events: events,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Events fetching failed" });
  }
};

//get vendor's all stall bookings requests history
const getVendorStallBookingRequestsHistory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const vendor_id = req.user.id;
    const [requests] = await db.query(
      `SELECT 
        e.title AS event_name, 
        e.start_date AS date, 
        s.stall_number
        sb.status 
        FROM stall_bookings sb
        JOIN stalls s ON sb.stall_id = s.stall_id
        JOIN events e ON s.event_id = e.event_id
        WHERE sb.vendor_id = ?`,
      [vendor_id]
    );
    if (requests.length === 0) {
      return res.status(404).json({ message: "Requests not found" });
    }
    res.status(200).json({
      message: "Requests fetched successfully",
      requests: requests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Requests fetching failed" });
  }
};

module.exports = {
  requestStallBooking,
  getStallBookingRequests,
  approveStallBooking,
  rejectStallBooking,
  getVendorStallBookingRequestsHistory,
  getVendorProducts,
  updateVendorProducts,
  deleteVendorProducts,
  getVendorEvents,
};
