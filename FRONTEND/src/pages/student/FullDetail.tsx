import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import "./myInternship.css";
import "./fullDetail.css"
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Internship {
    _id: string;
    company: string;
    role: string;
    type: "internship" | "training";
    startDate: string;
    endDate: string;
    status: "pending" | "verified" | "rejected";
    mentorComments: string;
    verifiedAt: Date;
    documentFile: string;
    mentor?: {
        name: string;
        department: string;
        email: string;
    };
}

const FullDetail = () => {
    const { internshipId } = useParams();
    const [internship, setInternship] = useState<Internship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchInternship = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("User not authenticated");
                    return;
                }

                // ⚠️ Route check: agar tumhara backend /internships/student/:internshipId hai
                const res = await axios.get(
                    `http://localhost:3000/internships/student/${internshipId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                console.log(res.data);
                setInternship(res.data.internship);
            } catch (error: unknown) {
                setError(
                    "Failed to fetch internship: " +
                    (error instanceof Error ? error.message : "Unknown error")
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInternship();
    }, [internshipId]);

    if (loading) {
        return (
            <DashboardLayout>
                <p style={{ padding: "20px" }}>Loading internship...</p>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <p style={{ padding: "20px", color: "red" }}>{error}</p>
            </DashboardLayout>
        );
    }

    if (!internship) {
        return (
            <DashboardLayout>
                <p style={{ padding: "20px" }}>No internship found.</p>
            </DashboardLayout>
        );
    }

    const start = new Date(internship.startDate);
    const end = new Date(internship.endDate);

    const durationMonths =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

    return (
        <DashboardLayout>
            <div className="full-detail-container">

                {/* HEADER */}
                <div className="full-detail-header">
                    <button
                        className="back-btn"
                        onClick={() => navigate(`/student/internships`)}
                    >
                        ← Back to My Internships
                    </button>

                    <div>
                        <h1 style={{ marginLeft: "-10px" }}>{internship.company}</h1>
                        <p style={{ textAlign:"center" }} className="role-text">{internship.role}</p>
                    </div>

                    <span className={`status-pill ${internship.status}`}>
                        {internship.status}
                    </span>
                </div>

                {/* GRID */}
                <div className="full-detail-grid">

                    {/* LEFT SIDE */}

                    <div className="detail-card">
                        <h3>Internship Information</h3>

                        <div className="detail-row">
                            <span>Type</span>
                            <strong>{internship.type}</strong>
                        </div>

                        <div className="detail-row">
                            <span>Duration</span>
                            <strong>{durationMonths} Months</strong>
                        </div>

                        <div className="detail-row">
                            <span>Verified Date</span>
                            <strong>
                                {internship.verifiedAt
                                    ? new Date(internship.verifiedAt).toLocaleDateString()
                                    : "Not verified"}
                            </strong>
                        </div>
                    </div>

                    {/* Mentor Section */}

                    <div className="detail-card">
                        <h3>Mentor Information</h3>

                        <div className="detail-row">
                            <span>Name</span>
                            <strong>{internship.mentor?.name || "Not Assigned"}</strong>
                        </div>

                        <div className="detail-row">
                            <span>Email</span>
                            <strong>{internship.mentor?.email || "Not Available"}</strong>
                        </div>

                        <div className="detail-row">
                            <span>Department</span>
                            <strong>{internship.mentor?.department || "Not Available"}</strong>
                        </div>
                    </div>

                    {/* Mentor Comment */}

                    {internship.mentorComments && (
                        <div className="detail-card">
                            <h3>Mentor Feedback</h3>
                            <p className="comment-box">{internship.mentorComments}</p>
                            <p><i>  ~ Proff. {internship.mentor?.name}</i></p>
                        </div>
                    )}

                    {/* Document */}

                    <div className="detail-card">
                        <h3>Documents</h3>

                        {internship.documentFile && (
                            <button
                                className="view-doc-btn"
                                onClick={() =>
                                    window.open(
                                        internship.documentFile,
                                        "_blank",
                                        "width=800,height=600"
                                    )
                                }
                            >
                                View Uploaded Document
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );

};

export default FullDetail;
