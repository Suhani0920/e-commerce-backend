import Payment from "../models/payment.js";
import Order from "../models/order.js";
import User from "../models/user.js";

// Create a payment entry (This could be for Cash on Delivery or online payments)
const createPayment = async (req, res) => {
    try {
      const { orderId, userId, amount, method } = req.body;
  
      // Ensure that the order and user exist
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new Payment record
      const payment = new Payment({
        order: orderId,
        user: userId,
        amount,
        method: method || 'COD', // Default to 'COD' if not provided
      });
  
      // Save the payment record
      await payment.save();
  
      // Optionally, you can update the order status to reflect payment initiation
      order.paymentStatus = 'Pending'; // Mark order as awaiting payment
      await order.save();
  
      res.status(201).json({
        message: 'Payment created successfully',
        payment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create payment', error: error.message });
    }
  };
  
  // Confirm payment (for both COD and online payments)
  const confirmPayment = async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { status, transactionId } = req.body; // Status: 'Completed', 'Cancelled'
  
      // Find the payment
      const payment = await Payment.findById(paymentId).populate('order');
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
  
      // Ensure the payment is still pending
      if (payment.status !== 'Pending') {
        return res.status(400).json({ message: 'Payment already confirmed or canceled' });
      }
  
      // Update payment status based on the confirmation
      payment.status = status;
      if (status === 'Completed') {
        payment.transactionId = transactionId || 'N/A'; // Transaction ID for online payments
        payment.order.paymentStatus = 'Completed'; // Update order status as completed
      } else if (status === 'Cancelled') {
        payment.order.paymentStatus = 'Cancelled'; // Update order status as canceled
      }
  
      await payment.save();
      await payment.order.save();
  
      res.status(200).json({
        message: 'Payment status updated successfully',
        payment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to confirm payment', error: error.message });
    }
  };
  
  // Handle payment failure
  const handlePaymentFailure = async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { errorMessage } = req.body;
  
      // Find the payment
      const payment = await Payment.findById(paymentId).populate('order');
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
  
      // Update payment status and order status for failure
      payment.status = 'Cancelled';
      payment.order.paymentStatus = 'Cancelled';
      payment.order.errorMessage = errorMessage;
  
      await payment.save();
      await payment.order.save();
  
      res.status(200).json({
        message: 'Payment failed, order status updated',
        payment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to handle payment failure', error: error.message });
    }
  };
  
  // Update payment status manually (e.g., for administrative purposes)
  const updatePaymentStatus = async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { status } = req.body; // Status: 'Pending', 'Completed', 'Cancelled'
  
      // Find the payment
      const payment = await Payment.findById(paymentId).populate('order');
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
  
      // Update payment status
      payment.status = status;
      if (status === 'Completed') {
        payment.order.paymentStatus = 'Completed';
      } else if (status === 'Cancelled') {
        payment.order.paymentStatus = 'Cancelled';
      }
  
      await payment.save();
      await payment.order.save();
  
      res.status(200).json({
        message: 'Payment status updated successfully',
        payment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update payment status', error: error.message });
    }
  };
  
  // Get all payments for an order (optional, for admin or user view)
  const getPaymentsForOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find all payments related to the order
      const payments = await Payment.find({ order: orderId }).populate('user');
      if (!payments.length) {
        return res.status(404).json({ message: 'No payments found for this order' });
      }
  
      res.status(200).json({ payments });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
    }
  };
  
  export {
    createPayment,
    confirmPayment,
    handlePaymentFailure,
    updatePaymentStatus,
    getPaymentsForOrder,
  };