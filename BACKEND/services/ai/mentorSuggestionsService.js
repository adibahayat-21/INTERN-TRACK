import UserModel from "../../models/User.js";
import InternshipModel from "../../models/Internship.js";

const suggestMentorForInternship = async (internshipId) => {

    const internship = await InternshipModel.findById(internshipId);
    if (!internship)
        throw new Error("Internship not Found");

    const mentors = await UserModel.find({
        role: "mentor",
        department: internship.department
    });

    if (mentors.length === 0) {
        return {
            suggestedMentor: null,
            reason: "No mentor is available for this department"
        };
    }

    let bestMentor = null;
    let minLoad = Infinity;

    for (const mentor of mentors) {

        const count = await InternshipModel.countDocuments({
            mentor: mentor._id,
            status: "pending"
        });

        if (count < minLoad) {
            minLoad = count;
            bestMentor = mentor;
        }
    }

    return {
        suggestedMentor: {
            _id: bestMentor._id,
            name: bestMentor.name,
            email: bestMentor.email,
            department: bestMentor.department,
            workload: minLoad
        },
        reason: "Same Department mentor with lowest current workload"
    };
};

export default suggestMentorForInternship;
