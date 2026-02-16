import UserModel from "../models/User.js";
import InternshipModel from "../models/Internship.js";
import AuditLogModel from "../models/AuditLog.js";
import suggestMentorForInternship from "../services/ai/mentorSuggestionsService.js";

// ======================================================================================================================================================================================

// aur main role audit log ka yha pr bhi h 

const assigningMentortoInternship = async (req, res) => {
    const internshipId = req.params.internshipId;   //wo URL m hi h
    const { mentorId } = req.body;   //example: admin ne frontend pe dropdown se koi mentor select kiya particular internship ko fir wo jo selection tha wo to frontend (UI) pe hua fir uske baad wo flow yha backend m aaega uske baad yeh check hoga jo humne neeche likha h
    try {
        const findInternship = await InternshipModel.findById(internshipId);
        const findMentor = await UserModel.findById(mentorId);
        if (!findInternship)
            return res.status(404).json({ message: "Internship Not Found" });
        if (!findMentor)
            return res.status(404).json({ message: "Selected mentor is not found" });
        if (findMentor.role !== "mentor")
            return res.status(400).json({ message: "Role of user is not of mentor type" })
        if (findMentor.department !== findInternship.department)
            return res.status(400).json({ message: "Department of mentor doesn't match with the department of internship" });
        findInternship.mentor = findMentor._id;
        await findInternship.save();

        // saving this activity in the audit logs
        try {
            await AuditLogModel.create({
                action: "ASSIGN_MENTOR",
                performedBy: req.user.userId,
                assignedMentor: findMentor._id,
                role: req.user.role,
                targetInternship: internshipId,
                message: "Admin assigned mentor to internship"
            })
        } catch (err) {
            console.error("Audit log failed:", err.message);
        }
        return res.status(200).json({ message: "Mentor successfully asigned to the particular internship" })
    } catch (err) {
        console.log("some error found");
    }
}

// =================================================================================================================

// in this feature we will apply AI logic which will make the work easier to the admin at the time of assigning mentor to the students (internships) on the basis of same department and less workload of the mentor

const getSuggestedMentor = async (req, res) => {
    const internshipId = req.params.internshipId;
    try {
        const result = await suggestMentorForInternship(internshipId);
        res.status(200).json({ message: "AI mentor suggestion generated", ...result })
        // Spread operator kya karta hai?
        // ...result ka matlab:
        // result ke andar jo bhi keys hain, unhe yaha directly insert kar do
    } catch (err) {
        console.error("AI mentor suggestion failed:", err.message);
        return res.status(400).json({ message: err.message || "Failed to generate mentor suggestion" });
    }
}

// ================================================================================================================

// admin ke paas saari internships ek jagah dekhne ka view hona chahiye.
// Real life me admin ko yeh chahiye:
// Kaunsi internship pending hai
// Kis mentor ko assign hui
// Status kya hai
// Kaunsi internship kis student ki hai

// Is route pe admin ko yeh data mile:
// Internship details
// Student info
// Mentor info (agar assigned)
// Status (pending / verified / rejected)

// Admin ko COMPLETE picture milni chahiye

// Populate sirf tab kaam karta hai jab:
// field type = ObjectId
// ref = "ModelName"
// Admin ko password nahi chahiye
// Admin ko sirf readable info chahiye
// Internship ke student field me jo ObjectId hai,
// us ObjectId ke base pe User collection se data aata hai,
// aur sirf name, email, role fields hi uthai jaati hain.

const showInternshipsToAdmin = async (req, res) => {
    try {
        const allInternship = await InternshipModel.find().populate("student", "name email role").populate("mentor", "name email department");
        return res.status(200).json({ message: "All the Data Fetched Successfully", data: allInternship })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch internships" });
    }
}

// =============================================================================================================

// Assign-Mentor page ke liye tumhe ye data chahiye:
// Internship se
// company
// department
// Student se
// name
// email
// Mentor se (optional, agar pehle se assigned ho)
// name
// email
// department

const showParticularInternshipDetail = async (req, res) => {
    const internshipId = req.params.internshipId;  //url se hi internship id leli fir usi internship id ki details hum find krke laenge database se aur frontend ko bhejenge taki admin usi internship ke liye mentor assign kr ske
    try {
        // student aur mentor refer horhe h user model ko internship schema ke andar isliye hume populate krna pdega lekin 
        // internship ki details ko populate krne ki zarurat nhi h kyuki wo refer nhi horha wo khud hi schema h jbki student aur mentor uske andar h aur wo user schema ko populate krrha h
        const internshipDetail = await InternshipModel.findById(internshipId).populate("student", "name email").populate("mentor", "name email department")
        if (!internshipDetail)
            return res.status(404).json({ message: "Internship Not Found" });
        return res.status(200).json({ message: "Internship detail of particular internship fetched successfully", data: internshipDetail });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch internship details" });
    }
}

// ===========================================================================================================

const showAuditLogs = async (req, res) => {
    try {
        const page=parseInt(req.query.page) || 1;  //mtlb ek page m 
        const limit=parseInt(req.query.limit) || 10;   //sirf 10 audit logs hone chahiye
        const skip = (page-1)*limit;
        const totalLogs=await AuditLogModel.countDocuments();
        const totalPages = Math.ceil(totalLogs / limit);

        const allData = await AuditLogModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("performedBy", "name role department")
            .populate("assignedMentor", "name role department") // ⭐⭐ MISSING PIECE
            .populate({
                path: "targetInternship",
                select: "company department status student",
                populate: { path: "student", select: "name" }
            });

        return res.status(200).json({ message: "All the audit logs fetched successfully", data: allData, pagination:{totalLogs, totalPages, currentPage:page, limit} });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Dailed to fetch audit logs" })
    }
}

// =======================================================================================================

const showDepartmentBasedMentorstoAdmin = async (req, res) => {
    const { department } = req.query;   //url m hi jo query bhej rhe h usi query m department diya hua h

    const mentors = await UserModel.find({
        role: "mentor",
        department: department,
    }).select("name email department")

    res.status(200).json({ data: mentors });
}

// ===========================================================================================

export { assigningMentortoInternship, getSuggestedMentor, showInternshipsToAdmin, showAuditLogs, showParticularInternshipDetail, showDepartmentBasedMentorstoAdmin };