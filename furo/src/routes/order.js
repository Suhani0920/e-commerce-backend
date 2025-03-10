import express from "express";
import {createOrder, 
    getOrderDetails, 
    updateOrder, 
    cancelOrder , confirmCODPayment } from "../controllers/order.js";

    const orderRouter = express.Router();

    import { verifyJWT } from '../middlewares/auth.js'; 
    import { isAdmin } from '../middlewares/isAdmin.js';    


orderRouter.post('/create', verifyJWT, createOrder);


orderRouter.get('/:orderId', verifyJWT, getOrderDetails);


orderRouter.patch('/update/:orderId', verifyJWT, isAdmin, updateOrder);


orderRouter.delete('/cancel/:orderId', verifyJWT, cancelOrder);


orderRouter.patch('/cancel/:orderId', verifyJWT, cancelOrder);


//orderRouter.delete('/delete/:orderId', verifyJWT, isAdmin, deleteOrder);


//orderRouter.get('/user/orders', verifyJWT, getUserOrders);


//orderRouter.get('/admin/orders', verifyJWT, isAdmin, getAllOrders);

export default orderRouter;