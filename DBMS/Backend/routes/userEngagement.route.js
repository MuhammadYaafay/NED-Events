const express = require('express'); 
const {
    addToFavourites,
    removeFromFavourites,
    getAllFavourites,
    addReview,
    updateReview,
    deleteReview,
    getAllReviews,
} = require('../controller/userEngagement.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/addToFavourites/:event_id', verifyToken, addToFavourites);
router.delete('/removeFromFavourites/:event_id', verifyToken, removeFromFavourites);
router.get('/getAllFavourites', verifyToken, getAllFavourites);
router.post('/addReview/:event_id', verifyToken, addReview);
router.patch('/updateReview/:event_id', verifyToken, updateReview);
router.delete('/deleteReview/:event_id', verifyToken, deleteReview);
router.get('/getAllReviews/:event_id', verifyToken, getAllReviews);

module.exports = router;