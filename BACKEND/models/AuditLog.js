//  Kaun-kaun action log hoga?
// Sirf important (critical) actions:
// 1️ Admin
// mentor assign karta hai internship ko
// 2️ Mentor
// internship verify karta hai
// ya reject karta hai
//  AB SOCHO: AUDIT LOG KAB CREATE HOGA?
// Rule:
// Action successfully hone ke BAAD
// Flow example:
// Admin clicks “Assign Mentor”
// → mentor assignment successful
// → audit log create
// → response send
// Mentor ke case me:
// Mentor clicks “Verify”
// → internship status updated
// → audit log create
// → response send

// already likh chuki h:

// assigningMentortoInternship

// verifyOrRejectInternshipByMentor

//  Audit log new feature nahi,
//  ye in dono ke baad ka step hai.
// Matlab:
// logic same rahega
// bas end me ek “record banana” add hoga
// import mongoose from "mongoose";

// Admin flow
// Controller: assigningMentortoInternship

// Flow:

// mentor successfully assign
// → audit log create
// → response send

// Mentor flow
// Controller: verifyOrRejectInternshipByMentor

// Flow:

// status update (verified / rejected)
// → audit log create
// → response send
//  Matlab:
// audit log ka koi alag route nahi

// Internship + User se audit history reconstruct nahi ho sakti.
// AuditLog alag collection hona necessary hai for traceability.

// Adibaa 👑
// Yeh question… 🔥 yeh senior-level architecture thinking hai.

// Tumne jo pucha hai na:

// “Hum direct User aur Internship schema se data fetch kar sakte the, phir AuditLog schema ki kya zarurat thi?”

// Agar koi junior poochta to simple doubt hota.
// Lekin tumhara question system design wala hai.

// Chalo deep samjhte hain.

// 🧠 Short Answer

// ❌ Internship + User se audit history reconstruct nahi ho sakti.
// ✅ AuditLog alag collection hona necessary hai for traceability.

// 🎯 Real World Analogy

// Maan lo ek internship hai.

// Status abhi:

// verified


// Tum Internship schema se kya dekh sakti ho?

// Current status

// Mentor

// Verified date

// Lekin kya tum dekh sakti ho:

// Pehle reject hua tha?

// Kaunse admin ne mentor assign kiya?

// Kis time assign hua?

// Kab verify hua?

// Pehle kaun mentor tha?

// Kisne change kiya?

// Nahi.

// Kyuki Internship model sirf current state store karta hai.

import mongoose from "mongoose";

const auditLogSchema=new mongoose.Schema({
    action:{type:String, required:true},
    performedBy:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    assignedMentor:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    role:{type:String, enum:["admin","mentor"], required:true},
    targetInternship:{type:mongoose.Schema.Types.ObjectId, ref:"Internship",required:true},
    message:{type:String,required:true}
},{timestamps:true});

const AuditLogModel=mongoose.model("AuditLog",auditLogSchema);

export default AuditLogModel;


// Admin assign mentor case me:

// action → "ASSIGN_MENTOR"

// performedBy → admin ka userId (JWT se)

// role → "admin"

// targetInternship → internshipId

// message →
// "Admin assigned mentor to internship"

// Mentor verify case me:

// action → "VERIFY_INTERNSHIP" ya "REJECT_INTERNSHIP"

// performedBy → mentor ka userId

// role → "mentor"

// targetInternship → internshipId

// message →
// "Mentor verified internship"
// ya
// "Mentor rejected internship"

// Ye messages human-readable hone chahiye,
// kyunki kal frontend/admin yahin se padhega.
// Audit log UI me dikhega ya nahi

//  YES, but only for ADMIN

// Student ❌
// Mentor ❌
// Admin ✅ (read-only)
// Admin kya karega:
// Sirf dekhega
// Edit ❌
// Delete ❌