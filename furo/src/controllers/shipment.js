import Shipping from "../models/shipping.js";

const createShipment = async (req, res) => {
    try {
      const { order, address } = req.body;
  
      const newShipment = await Shipping.create({
        order,
        address,
        status: 'Pending',
      });
  
      res.status(201).json({
        message: 'Shipment created successfully',
        shipment: newShipment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create shipment', error });
    }
  };
  
  // Get shipment details
  const getShipmentDetails = async (req, res) => {
    try {
      const { shipmentId } = req.params;
  
      const shipment = await Shipping.findById(shipmentId);
  
      if (!shipment) {
        return res.status(404).json({ message: 'Shipment not found' });
      }
  
      res.status(200).json(shipment);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve shipment details', error });
    }
  };
  
  // Update shipment status (e.g., Pending, Shipped, Delivered)
  const updateShipmentStatus = async (req, res) => {
    try {
      const { shipmentId } = req.params;
      const { status, trackingNumber } = req.body;
  
      const updatedShipment = await Shipping.findByIdAndUpdate(
        shipmentId,
        { status, trackingNumber },
        { new: true, runValidators: true }
      );
  
      if (!updatedShipment) {
        return res.status(404).json({ message: 'Shipment not found' });
      }
  
      res.status(200).json({
        message: 'Shipment updated successfully',
        shipment: updatedShipment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update shipment', error });
    }
  };
  
  // Delete a shipment
  const deleteShipment = async (req, res) => {
    try {
      const { shipmentId } = req.params;
  
      const deletedShipment = await Shipping.findByIdAndDelete(shipmentId);
  
      if (!deletedShipment) {
        return res.status(404).json({ message: 'Shipment not found' });
      }
  
      res.status(200).json({
        message: 'Shipment deleted successfully',
        shipment: deletedShipment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete shipment', error });
    }
  };
  
  export { createShipment, getShipmentDetails, updateShipmentStatus, deleteShipment };