const{getUserbyID,updateUserProfile,getAllVendors} = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();

router.get('/:id',verifyToken,getUserbyID);
router.put('/:id',verifyToken,updateUserProfile);
router.get('/vendors',verifyToken,getAllVendors);

module.exports = router;
