import express from "express";
const router = express.Router();

import {register_user,login_user,userMe} from '../controllers/userController.js';
import authMiddleware from "../middleware/authMiddleware.js";

// ================= New User registration ========================

router.post("/register",register_user);

// Register ke time user ke paas token hota hi nahi
// Login ke time token generate hota hai
// authMiddleware token verify karta hai

// ================= Existing User login ========================

router.post("/login",login_user);

// ================= Showing the detail of the user =====================

router.get("/me",authMiddleware,userMe);


export default router;
