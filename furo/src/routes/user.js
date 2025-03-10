import express from "express";
import {verifyJWT} from "../middlewares/auth.js";
import {isAdmin} from "../middlewares/isAdmin.js";

import { createNewAccount, loginAccount  ,logOutUser , updateUserDetails,getUserDetails,getAllUsers,deleteUser,refreshAccessToken} from "../controllers/user.js";
const router = express.Router();

router.post('/register', createNewAccount);
router.post('/login',express.json(), loginAccount); 
router.post('/logout', verifyJWT, logOutUser); 
router.post('/refresh-token', refreshAccessToken);
router.patch('/update/:userId', verifyJWT, updateUserDetails); 
router.get('/:userId', verifyJWT, getUserDetails); 
router.get('/admin/users', verifyJWT, isAdmin, getAllUsers); 
router.delete('/admin/users/:userId', verifyJWT, isAdmin, deleteUser); 

export default router;

