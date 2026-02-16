// yeh file represent krti h schema about -> user and user may be any of these - student, mentor, admin

import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    role:{type:String, enum:["student","mentor","admin"]},
    createdAt:{type:Date, default:Date.now},
    department:{type:String,enum:["Computer Science","Data Science","IT","AI/ML","Cyber"], required:function(){return this.role==="mentor"}}
    // Yeh Mongoose ka conditional validation hai.
// “Ye field kab required hogi, wo hum function se decide kar rahe hain”
// Jab role = mentor
// this.role === "mentor"   // true
// function true return karega
// iska matlab:
// department field required hai
// function false return karega
// iska matlab:
// department required nahi hai
// Student bina department ke bhi save ho sakta hai
// “Department sirf mentor ke liye compulsory hai, sabke liye nahi”
},{timestamps:true});

const UserModel=mongoose.model("User",userSchema);

export default UserModel;