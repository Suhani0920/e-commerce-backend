import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductsByCategory,
  getProductDetails,
  getBestsellers,
  getNewArrivals
} from "../controllers/product.js";
import {isAdmin} from "../middlewares/isAdmin.js";
import { verifyJWT } from "../middlewares/auth.js";
import {upload} from "../middlewares/multer.js";
const productrouter = express.Router();

productrouter.post("/", verifyJWT,isAdmin,upload.fields([
  { name: 'imageFile', maxCount: 1 },   // Only one image file
  { name: 'modelFile', maxCount: 1 }    // Only one model file
]), createProduct); // Admin can create a product
productrouter.delete("/:id", isAdmin, deleteProduct); // Admin can delete a product

// Public routes
productrouter.get("/category/:categoryId", getProductsByCategory);
productrouter.get("/:id", getProductDetails);
productrouter.get("/bestsellers", getBestsellers);
productrouter.get("/new-arrivals", getNewArrivals);

export default productrouter;




