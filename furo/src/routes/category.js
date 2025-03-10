import express from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import{createCategory, 
    deleteCategory, 
    getAllCategories, 
    updateCategory 
}from "../controllers/category.js";

const categoryRouter = express.Router();


categoryRouter.post('/', verifyJWT, isAdmin, createCategory);
categoryRouter.delete('/:categoryId', verifyJWT, isAdmin, deleteCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.patch('/:categoryId', verifyJWT, isAdmin, updateCategory);

export default categoryRouter;



