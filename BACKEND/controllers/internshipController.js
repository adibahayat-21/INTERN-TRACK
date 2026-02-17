import AuditLogModel from '../models/AuditLog.js';
import InternshipModel from '../models/Internship.js'
import generateGeminiSummary from '../services/ai/documentSummaryService.js';
import extractFieldsFromText from '../services/ai/fieldExtractionService.js';
import calculateSimilarity from '../services/ai/plagiarismService.js';
import extractFieldAI from '../services/ai/ExtractFieldAI.js';

// ==========================================================================================================================

const extractingFields = async (req, res) => {
  const documentData = req.body.documentText;

  if (!documentData || typeof documentData !== "string") {
    return res.status(400).json({ message: "Invalid document text" });
  }

  try {
    // ================================
    // STEP 1: regex extraction (FAST)
    // ================================
    const regexFields = extractFieldsFromText(documentData);

    let finalFields = { ...regexFields };

    // ================================
    // STEP 2: check missing fields
    // ================================
    const isMissing = Object.values(regexFields).some(
      (v) => v === null || v === ""
    );

    // ================================
    // STEP 3: AI fallback (SMART)
    // ================================
    if (isMissing) {
      try {
        const aiFields = await extractFieldAI(documentData);

        //  merge — AI only fills missing
        finalFields = {
          company: regexFields.company || aiFields.company || null,
          role: regexFields.role || aiFields.role || null,
          department: regexFields.department || aiFields.department || null,
          duration: regexFields.duration || aiFields.duration || null,
          startDate: regexFields.startDate || aiFields.startDate || null,
          endDate: regexFields.endDate || aiFields.endDate || null,
        };
      } catch (aiErr) {
        console.error("AI fallback failed:", aiErr.message);
      }
    }

    // ================================
    // STEP 4: response
    // ================================
    return res.status(200).json({
      message: "Fields extracted successfully",
      extractedFields: finalFields,
    });

  } catch (err) {
    console.error("Error extracting fields:", err);
    return res.status(500).json({
      message: "Failed to extract fields from document",
    });
  }
};


// ==============================================================================================================================================================================================

// jo frontend se data aarha h (internship ki details) hum whi yha pe lerhe h aur usko db m save kra rhe h
const uploadInternship = async (req, res) => {
    // Implementation for uploading internship details
    const studentId = req.user.userId;   //yha value chahiye jo ki authMiddleware se mil hi rhi h , hume object nhi chahiye isliye humne iska {} use nhi kiya kyuki yeh object destructing ke liye use hota h
    // id ko jwt se fetch krenge mtlb jo login h uska id aur uske liye fir wo dashboard type ka open ho jaega jisme internship upload krne ka option h
    const { companyName, role, type, startDate, endDate, department, documentText, extractedFields } = req.body;
    // if (!documentText || !extractedFields)
    //     return res.status(400).json({ message: "Document text and extracted fields are required" });
    const filePath = req.file?.path; // multer middleware se file ka path mil jaega req.file se

    // Validation of required fields
    if (!companyName || !role || !type || !startDate || !endDate || !department || !documentText || !filePath) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        // Internship ki ID MongoDB khud banata hai
        // Jab bhi tum new InternshipModel() karke .save() karti ho
        // MongoDB automatically ek _id generate kar deta h

        const new_internship_detail = new InternshipModel({
            student: studentId,
            // mentor:mentor._id,
            company: companyName,
            role,
            type,
            startDate,
            endDate,
            department,
            documentText,
            documentFile: filePath,
            extractedFields,
            status: "pending"
        });
        await new_internship_detail.save();
        res.status(201).json({ message: "Internship uploaded successfully", internship: new_internship_detail });
        console.log("Internship uploaded successfully:", new_internship_detail)
    } catch (err) {
        console.error("Error uploading internship:", err);
        return res.status(500).json({ message: "Failed to upload internship/training" })
    }
}

// ================================================================================================================================================================

// Student jab apna dashboard open kare, to use apni saari submitted internships / trainings dikhni chahiye.
// Bas.
// Ye function isi feature ke liye hai.
const showInternshipsForStudent = async (req, res) => {
    const studentId = req.user.userId; //id ko jwt se fetch krenge mtlb jo login h uska id
    try {
        const detail = await InternshipModel.find({ student: studentId }).populate("mentor", "name email department");
        return res.status(200).json({ message: "Internship details fetched successfully", detail });
        // is line ka yeh mtlb h ki db se data utha liya h aur ab frontend ko bhej rhe h
    } catch (err) {
        console.error("Error fetching internship details:", err);
        return res.status(500).json({ message: "Failed to fetch internship details" })
    }
}

//===============================================================================================================

const showParticularInternship = async (req, res) => {
    try {

        const internshipId = req.params.internshipId;
        const studentId = req.user.userId;   //jo student login h

        const internship = await InternshipModel
            .findById(internshipId)
            .populate("mentor", "name email department");

        if (!internship) {
            return res.status(404).json({ message: "Internship Not Found" });
        }

        // Security check — koi dusre student ki internship na dekh le
        if (internship.student.toString() !== studentId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        return res.status(200).json({
            message: "Internship fetched successfully",
            internship
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// ======================================================================================================================

// Mentor jab apna dashboard open kare, to use un sab students ki internships/training dikhni chahiye jo us mentor ke under assigned hain.
// Mentor assignment abhi missing feature hai
// Mentor dashboard logically depend karta hai mentor field pe

// Mentor ko sirf whi internships dikhni chahiye jo usko assigned hui h mtlb same department wali internship 
// to yeh logic humne admin route ki taraf se lga diya isliye yha pr check krne ki zarurat nhi h automatically admin ko sirf whi internships dikhengi jo use assigned h aur pending h 

const showInternshipsForMentor = async (req, res) => {
    const mentorId = req.user.userId;   //id ko jwt se fetch krenge mtlb jo login h uska id
    try {
        const detail = await InternshipModel.find({ mentor: mentorId }).populate("student", "name email");     //sirf pending wali internships dikhao
        // here we assuming that mentor is already assigned to the students but later we will implement the feature of assigning mentors to the students
        return res.status(200).json({ message: "Internship details fetched successfully", detail });
    } catch (err) {
        console.error("Error fetching internship details:", err);
        return res.status(500).json({ message: "Failed to fetch internship details" })
    }
}

// ================================================================================================================================================

const showSummaryOfInternship = async (req, res) => {
    try {
        const internshipId = req.params.internshipId;
        const mentorId = req.user.userId;

        // 🔹 Find internship
        const internship = await InternshipModel.findById(internshipId);

        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }

        // 🔹 Security check
        if (internship.mentor?.toString() !== mentorId) {
            return res.status(403).json({
                message: "You are not authorized to view this summary"
            });
        }

        // 🔹 If already generated → return cached summary
        if (internship.aiSummary) {
            return res.status(200).json({
                message: "Summary fetched successfully",
                summary: internship.aiSummary
            });
        }

        // =====================================================
        //  STEP 1: Calculate duration
        // =====================================================

        const durationMonths =
            internship.startDate && internship.endDate
                ? (new Date(internship.endDate).getFullYear() -
                    new Date(internship.startDate).getFullYear()) * 12 +
                (new Date(internship.endDate).getMonth() -
                    new Date(internship.startDate).getMonth())
                : internship.extractedFields?.duration || "Not specified";

        // =====================================================
        //  STEP 2: Build rich context (VERY IMPORTANT)
        // =====================================================

        const contextText = `
Internship Details:
Company: ${internship.company}
Role: ${internship.role}
Department: ${internship.department}
Type: ${internship.type}
Duration: ${durationMonths} months

Extracted Fields:
Company: ${internship.extractedFields?.company || "N/A"}
Role: ${internship.extractedFields?.role || "N/A"}
Department: ${internship.extractedFields?.department || "N/A"}

Description:
${internship.documentText || ""}
`;

        // =====================================================
        //  STEP 3: Generate summary
        // =====================================================

        const summary = await generateGeminiSummary(contextText);

        // =====================================================
        //  STEP 4: Save in DB (cache)
        // =====================================================

        internship.aiSummary = summary;
        await internship.save();

        // =====================================================
        //  STEP 5: Send response
        // =====================================================

        return res.status(200).json({
            message: "Summary generated successfully",
            summary
        });

    } catch (err) {
        console.error("Error generating summary:", err);
        return res.status(500).json({
            message: "Failed to generate summary"
        });
    }
};


// ================================================================================================================================

// We compare the current internship document with other internship documents using a rule-based text similarity approach. The logic is encapsulated in a service, while the controller handles authorization and orchestration

const checkingPlagiarismInInternshipDocument = async (req, res) => {
    try {
        const internshipId = req.params.internshipId; // url se fetch krna h internship id
        const internship = await InternshipModel.findById(internshipId);

        if (!internship)
            return res.status(404).json({ message: "Internship Not Found" });

        const mentorId = req.user.userId;

        if (internship.mentor?.toString() !== mentorId) {
            return res.status(403).json({ message: "You are not authorized to check plagiarism of particular internship" })
        }
        // baaki internship fetch kro db se
        const otherInternships = await InternshipModel.find({ _id: { $ne: internshipId } }).populate("student", "name") // mtlb ki us internship ko chhodke baki sab internships fetch krlo aur  $ne = not equal

        let results = [];
        let maxSimilarity = 0;

        // calculate similarity
        for (let other of otherInternships) {
            const similarity = calculateSimilarity(internship.documentText, other.documentText);
            if (similarity > maxSimilarity)
                maxSimilarity = similarity;

            if (similarity > 0)
                results.push({ internshipId: other._id, company: other.company, role: other.role, studentName: other.student?.name, similarity })
        }
        return res.status(200).json({
            message: "Plagiarism check completed",
            baseInternshipId: internshipId,
            highestSimilarity: maxSimilarity,
            results
        })
    } catch (err) {
        console.error("Error checking plagiarism:", err);
        return res.status(500).json({ message: "Failed to check plagiarism" });
    }
}

// ======================================================================================================================

// ab yha pr hum audit log m save kraenge
// Is function me audit log ka main role hai:
// Mentor ne internship verify ki ya reject ki — us action ko permanently record karna.
// Internship document me sirf current state save hoti hai.
// AuditLog me event history save hoti hai.

const verifyOrRejectInternshipByMentor = async (req, res) => {

    try {
        // url se fetch krna h internship id
        const internshipId = req.params.internshipId;

        // mentor id ko jwt se fetch krenge mtlb jo login h uska id
        const mentorId = req.user.userId;

        // body se fetch krna h status and mentor comments
        const { status, mentorComments } = req.body;

        // Iska main purpose hai:
        // Mentor sirf allowed values hi bhej sake (verified ya rejected)
        // koi galat / random value database me na jaa sake.

        if (!["verified", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed values are 'verified' or 'rejected'" });
        }

        // Agar validation na ho to:
        // koi bhi random string DB me chali jaati
        // data inconsistent ho jata

        // find the internship in db whose id is given in url to update the status and comment from mentor of that particular internships
        const internship = await InternshipModel.findById(internshipId);

        if (!internship) //mtlb ki us particular id ki internship hi nhi mili db m 
            return res.status(404).json({ message: "Internship not found" });

        // ab hume check krna h ki jo mentor internship dekh rha h wo hi us internship ka assigned mentor h ya nhi
        if (internship.mentor.toString() !== mentorId) {
            return res.status(403).json({ message: "You are not authorized to verify/reject this internship" })
        }

        // jo mentor intership/training ko dekh rha h whi us internship ke student ka mentor hua to ab wo status aur comment m update kr skta h 
        internship.status = status;
        internship.mentorComments = mentorComments;
        internship.verifiedAt = new Date(); // current date and time set kr denge verifiedAt field m

        // save the changes in db
        await internship.save();

        try {
            await AuditLogModel.create({
                action: status === "verified" ? "VERIFY_INTERNSHIP" : "REJECT_INTERNSHIP",
                performedBy: req.user.userId,
                role: "mentor",
                targetInternship: internshipId,
                message: status === "verified" ? "Internship is verified by mentor" : "Internship is rejected by mentor"
            })
        } catch (err) {
            console.log("Audit log failed", err.message);
        }

        return res.status(200).json({ message: `Internship is ${status}`, internship });

    } catch (err) {
        console.error("Error verifying internship:", err);
        return res.status(500).json({ message: "Failed to verify internship" });
    }
}

// ==========================================================================================================================

// this function returning single object

const showingInternshipDetailToMentor = async (req, res) => {
    try {
        // url se fetch krna h internship id
        const internshipId = req.params.internshipId;
        const mentorId = req.user.userId;     // authMiddleware se aata hai
        if (!internshipId)
            return res.status(400).json({ message: "internship not found" });
        const internship = await InternshipModel.findById(internshipId).populate("student", "name email department ").populate("mentor", "name email");
        if (!internship)
            return res.status(400).json({ message: "internship not found" });

        if (!internship.mentor || internship.mentor._id.toString() !== mentorId) {
            return res.status(403).json({
                message: "You are not authorized to view this internship",
            });
        }
        return res.status(200).json({ message: "internship details fetched successfully", data: internship })
    }
    catch {
        return res.status(400).json("error occur");
    }
}

// ===================================================================================

export { checkingPlagiarismInInternshipDocument, extractingFields, uploadInternship, showInternshipsForMentor, showInternshipsForStudent, verifyOrRejectInternshipByMentor, showSummaryOfInternship, showingInternshipDetailToMentor, showParticularInternship };
