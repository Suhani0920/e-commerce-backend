import Order from "../models/order.js";

import Shipping from "../models/shipping.js";

// Create a new order with shipment details
const createOrder = async (req, res) => {
    try {
      const { userId, items, totalAmount, shippingAddress } = req.body;
  
      // Create the shipping record
      const shipment = await Shipping.create({
        address: shippingAddress,
        trackingNumber: '', // Initially empty, can be updated later
        status: 'Pending',  // Default status
      });
  
      // Create the order
      const newOrder = await Order.create({
        user: userId,
        items,
        totalAmount,
        shipmentDetails: shipment._id,  // Link the shipment to the order
        paymentStatus: 'Pending',  // This can be updated later
      });
  
      res.status(201).json({
        message: 'Order created successfully',
        order: newOrder,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create order', error });
    }
  };
  
  // Get details of an order (with shipment)
  const getOrderDetails = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      const order = await Order.findById(orderId)
        .populate('user', 'name email')  // Populate user details
        .populate('items.product', 'name price')  // Populate product details
        .populate('shipmentDetails');  // Populate shipment details
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve order details', error });
    }
  };
  
  // Update order (Admin only)
  const updateOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
      const updates = req.body;
  
      const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({
        message: 'Order updated successfully',
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update order', error });
    }
  };
  
  // Cancel/Delete an order
  const cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      const deletedOrder = await Order.findByIdAndDelete(orderId);
  
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({
        message: 'Order canceled successfully',
        order: deletedOrder,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to cancel order', error });
    }
  };


  // Confirm Cash on Delivery (COD) Payment
const confirmCODPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order and ensure payment is in 'Pending' status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus !== 'Pending') {
      return res.status(400).json({ message: 'Payment already confirmed or canceled' });
    }

    // Update the order payment status and overall order status
    order.paymentStatus = 'Completed';
    order.status = 'Delivered'; // Or any other status based on your flow
    await order.save();

    res.status(200).json({
      message: 'COD Payment confirmed successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to confirm COD payment', error: error.message });
  }
};
  
  export { createOrder, getOrderDetails, updateOrder, cancelOrder , confirmCODPayment };

