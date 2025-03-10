import express from 'express';
import { addReview,getProductReviews,deleteReview,updateReview } from '../controllers/review.js';
import { verifyJWT } from '../middlewares/auth.js'; // Assuming verifyJWT is used for user authentication

const router = express.Router();


router.post('/product/:productId', verifyJWT, addReview);


router.put('/:reviewId', verifyJWT, updateReview);


router.delete('/:reviewId', verifyJWT, deleteReview);


router.get('/product/:productId', getProductReviews);




export default router;
