import express from "express";
const router = express.Router();

import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { extractingFields, showInternshipsForMentor, showInternshipsForStudent, uploadInternship, verifyOrRejectInternshipByMentor, showSummaryOfInternship, checkingPlagiarismInInternshipDocument, showingInternshipDetailToMentor, showParticularInternship } from '../controllers/internshipController.js';

// =========== Route for extracting the fields from the internship documents for the easiness of students while uploading the documents =============

router.post("/extractFields",authMiddleware,roleMiddleware(["student"]), extractingFields)

// ========== Route for student submit internships/training details ==========

router.post("/",authMiddleware,roleMiddleware(["student"]), upload.single("documentFile"), uploadInternship)

// ========== Route for fetching (see) all internships/training ==============

router.get("/student",authMiddleware,roleMiddleware(["student"]), showInternshipsForStudent)

// =========== Route for fetching only the detail of particular internship to the student============

router.get("/student/:internshipId",authMiddleware,roleMiddleware(["student"]),showParticularInternship);

// ========== Route for showing all the internship details to mentor ======================

// Rahul Sir login karte hain aur sochte hain:
// “Mere under kaun-kaun se students hain?”
// “Unhone kya submit kiya?”
// “Kiska review pending hai?”

router.get("/mentor",authMiddleware,roleMiddleware(["mentor"]), showInternshipsForMentor)

// =========== Route to show the summary of the internship to the mentor ========================

// in this feature we will use the logic of AI while generating the summary of the document (internship) to the mentor for thier ease

// hum yha kya bhej rhe h long document (jisme internship details h) to ab dekho hum isko route ke thorugh bhejenge as a data fir wo us data se summary generate krke dega kyuki hum yha documentSummaryService function ko use krenge 
// aur long text h isliye hum yha post request bhejenge na ki get request kyuki get request hum tb bhejte h jb hume kuch choti detail (jese id) url m bhejke data chahiye hota h lekin yha to hum id nhi bhej rhe yha to hum long text bhej rhe h jo ki get route ke liye bohot long ho jaega isliye hum yha pr post route ko use krenge 

router.post("/:internshipId/summary",authMiddleware,roleMiddleware(["mentor"]), showSummaryOfInternship)

// =================== Route for mentor to check plagiarism in internship documents =========================

router.post("/:internshipId/plagiarism",authMiddleware,roleMiddleware(["mentor"]),checkingPlagiarismInInternshipDocument)

// ==================== Route for mentor to see the internship details of the particular internship for which they are reviewing ==========

router.get("/mentor/:internshipId",authMiddleware,roleMiddleware(["mentor"]),showingInternshipDetailToMentor);

// ===================== Route for mentor to verify/reject internship ==============================

// this feature will be used in audits

// here we are using patch method because mentor is only updating the status and comments of the internship record (means partially updation of the record on the status andmentorComments fields)
router.patch("/verify/:internshipId",authMiddleware,roleMiddleware(["mentor"]), verifyOrRejectInternshipByMentor);

// ===========================================================

export default router;