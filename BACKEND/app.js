import express from 'express';
import mongoose from 'mongoose';
import userRoutes from "./routes/userRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import adminRoutes from "./routes/adminRoute.js";
import cors from "cors";
import path from "path";

import dotenv from 'dotenv';
dotenv.config();

const app=express();
app.use(cors());
const PORT=3000;

// ========================================================

// Frontend jab data bhejega (forms, JSON), to:
// Express ko batana padta hai
// “Main JSON samajh sakta hoon”
// Warna baad me req.body undefined milega.

app.use(express.json());
// this is used for reading JSON data coming from frontend

app.use("/uploads",express.static(path.join(process.cwd(),"uploads")))

// ================= Mongo Connection ==================

// local mongoDB connection , change it at last

mongoose.connect(process.env.MONGODB_ATLAS_URL)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.error("MongoDB Connection Failed:", err));


// ====== Testing Route ================

app.get("/",(req,res)=>{
    res.send("Welcome to INTERN-TRACK");
})

// ========== User-related routes (register, login) =====================================

app.use("/users",userRoutes)

// ================ Internship / Training related routes =====================

app.use("/internships",internshipRoutes)

// =============== Admin related routes ==============================

app.use("/admin",adminRoutes);

// ============================= Server Listening ==============================

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})