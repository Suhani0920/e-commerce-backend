import express from "express";
import {addToCart, removeFromCart, getUserCart} from "../controllers/cart.js";

import calculateTotalPrice from "../middlewares/calculateTotalPrice.js";
import {verifyJWT} from "../middlewares/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", verifyJWT, calculateTotalPrice, addToCart);
cartRouter.delete("/remove/:cartItemId", verifyJWT, removeFromCart);
cartRouter.get("/:userId", verifyJWT, getUserCart);

export default cartRouter;