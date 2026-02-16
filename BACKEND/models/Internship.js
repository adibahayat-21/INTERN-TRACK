// Ye file represent karegi:
// student ki internship / training record

import mongoose from "mongoose";

const internshipSchema=new mongoose.Schema({

    // kis student ki internship / training hai (referring so, here will be the need for populate)
    student:{ type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},

    // kaunsa mentor assigned hai (referring so, here will be the need for populate)
    mentor:{ type:mongoose.Schema.Types.ObjectId, ref:"User"},

    // yeh dono cheez mentor ke liye h jo mentor h wo student ke documents pr comment(feedback) de skta h aur verify reject kr skta h
    mentorComments:{type:String,trim:true},
    verifiedAt:{type:Date},
    // aur yeh bhi pta chlega isse ki mentor ne document ko kis date pr verify/reject kiya

    department:{type:String,enum:["Computer Science","Data Science","AI/ML","IT","Cyber"],required:true},
    company:{type:String,required:true, trim:true},    //trim: true string ke aage aur peeche ke extra spaces automatically hata deta hai save hone se pehle
    // Removes: leading spaces (start ke) trailing spaces (end ke)
    // Does NOT remove: beech ke spaces

    role:{type:String,required:true,trim:true},

    startDate:{type:Date,required:true},
    endDate:{type:Date, required:true},

    // internship ya training
    type:{type:String, enum:["internship","training"], required:true},

    // status of verification by the mentor
    status:{type:String, enum:["pending","verified","rejected"], default:"pending"},

    documentText:{type:String, required:true}, // yeh pura document ka text hoga jo student upload karega,

    documentFile:{type:String, required:true},
    
    extractedFields:{company:String, role:String, department:String, duration:String, startDate:Date, endDate:Date},

    aiSummary:{type:String}
},
    // extra -> createdAt & updatedAt automatically
    {timestamps:true}
)

const InternshipModel=mongoose.model("Internship",internshipSchema);

export default InternshipModel;