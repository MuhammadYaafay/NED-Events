const{  getUserbyID,
    updateUserDetails,
    getAllVendors} = require('../controller/user.controller.js');
const { verifyToken } = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.get('/:id', verifyToken, getUserbyID);
router.put('/:id', updateUserDetails);
router.get('/vendors', verifyToken, getAllVendors);

module.exports = router;
