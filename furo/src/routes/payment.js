import express from "express";
import {  createPayment,
    confirmPayment,
    handlePaymentFailure,
    updatePaymentStatus,
    getPaymentsForOrder, } from "../controllers/payment.js";
    import { verifyJWT } from '../middlewares/auth.js'; 
    import { isAdmin } from '../middlewares/isAdmin.js';    
const paymentRouter = express.Router();

// 1. Get all payments - Only admin can access this route
paymentRouter.post('/payments', verifyJWT, isAdmin, createPayment);

// 2. Get a specific payment by ID - Any authenticated user can access this route
//paymentRouter.get('/payments/:id', verifyJWT, getPaymentById);

// 3. Create a new payment - Any authenticated user can create payments
paymentRouter.post('/payments', verifyJWT, createPayment);

// 4. Update payment details (e.g., change status) - Only admin can update payments
paymentRouter.put('/payments/:id', verifyJWT, isAdmin, updatePaymentStatus);

// 5. Get all payments for a specific user - Any authenticated user can view their own payments
paymentRouter.get('/payments/user/:userId', verifyJWT, getPaymentsForOrder);

export default paymentRouter;