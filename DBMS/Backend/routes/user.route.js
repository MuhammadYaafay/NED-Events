const {  
    getUserbyID,
    updateUserDetails,
    getAllVendors
  } = require('../controller/user.controller.js');
  const { verifyToken } = require('../middlewares/auth.middleware');
  const express = require('express');
  const router = express.Router();
  

  router.get('/profileDetails', verifyToken, getUserbyID); 
  router.put('/updateProfile',verifyToken,updateUserDetails);

  
  
  module.exports = router;
  