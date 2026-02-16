import express from "express";
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { assigningMentortoInternship, showInternshipsToAdmin, showAuditLogs, getSuggestedMentor, showParticularInternshipDetail, showDepartmentBasedMentorstoAdmin } from "../controllers/adminController.js";

// ======================== Route of admin to assign mentor according to the specific internship ===============================

// this feature will be used in audits

// Admin kuch change karta hai

router.patch("/internships/:internshipId/assign-mentor",authMiddleware,roleMiddleware(["admin"]),assigningMentortoInternship);

// ==================== Route for AI suggestion mentors to admin while assigning mentor to the internships ======================

router.get("/internships/:internshipId/ai-suggest-mentor",authMiddleware,roleMiddleware(["admin"]),getSuggestedMentor);

// ======================= Route for admin to see all the internships along with their assigned mentor and thier status =========

router.get("/allInternships",authMiddleware,roleMiddleware(["admin"]),showInternshipsToAdmin);
// Admin sirf data dekh raha hai

// ======================== Route for admin to see the internship detail of the particular internship for which the admin wants to assign the mentor =============

router.get("/internships/:internshipId",authMiddleware,roleMiddleware(["admin"]),showParticularInternshipDetail);

// ======================= Route for admin to see all the audit logs ========================================================

router.get("/audit-logs",authMiddleware,roleMiddleware(["admin"]),showAuditLogs);

// ======================= Route for admin to see the mentors of same department as of department of internship ===========================
// yeh whi mentors ki list degi response m jiska department same hoga internship ke department se

router.get("/mentors",authMiddleware,roleMiddleware(["admin"]),showDepartmentBasedMentorstoAdmin);

// ======================================================================================================
export default router;