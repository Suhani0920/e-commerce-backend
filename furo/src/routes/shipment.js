import express from "express";
import {createShipment, getShipmentDetails, updateShipmentStatus, deleteShipment} from "../controllers/shipment.js";
import {verifyJWT} from "../middlewares/auth.js";
import {isAdmin} from "../middlewares/isAdmin.js";

const shipmentRouter = express.Router();

shipmentRouter.post('/create', verifyJWT, isAdmin, createShipment);


shipmentRouter.get('/:shipmentId', verifyJWT, isAdmin, getShipmentDetails);


shipmentRouter.patch('/update/:shipmentId', verifyJWT, isAdmin, updateShipmentStatus);


shipmentRouter.delete('/delete/:shipmentId', verifyJWT, isAdmin, deleteShipment);

export default shipmentRouter;