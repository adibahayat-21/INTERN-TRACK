import DashboardLayout from "../../components/layout/DashboardLayout";
import "./internshipDetail.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const InternshipDetail = () => {

  interface Internship {
    _id: string;
    company: string;
    role: string;
    department: string;
    status: "pending" | "verified" | "rejected";
    type: "internship" | "training";
    documentText: string;
    documentFile: string;
    startDate: Date;
    endDate: Date;
    mentorComments?: string;
    student: {
      name: string;
      email: string;
    };
  }

  const { internshipId } = useParams();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const navigate = useNavigate();
 
  /* FETCH DETAILS */

  useEffect(() => {
    const fetchInternshipDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/internships/mentor/${internshipId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setInternship(res.data.data);
      } catch {
        setError("Failed to load internship");
      } finally {
        setLoading(false);
      }
    };

    fetchInternshipDetail();
  }, [internshipId]);

  /* Load previous comment */

  useEffect(() => {
    if (internship?.mentorComments) {
      setComment(internship.mentorComments);
    }
  }, [internship]);

  /* Duration Months */

  let duration = 0;
  if (internship?.startDate && internship?.endDate) {
    const start = new Date(internship.startDate);
    const end = new Date(internship.endDate);

    duration =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
  }

  /* Comment Handler */

  const handleComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  /* Verify / Reject */

  const handleReview = async (status: "verified" | "rejected") => {
    try {
      const token = localStorage.getItem("token");

      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: `You want to ${status} this internship`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
      });

      if (!confirm.isConfirmed) return;

      const res = await axios.patch(
        `http://localhost:3000/internships/verify/${internshipId}`,
        {
          status,
          mentorComments: comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (status === "verified") toast.success("Internship Verified");
      if (status === "rejected") toast.error("Internship Rejected");

      setInternship(res.data.internship);

    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleAiSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("user not authenticated");
        return;
      }
      const res = await axios.post(`http://localhost:3000/internships/${internshipId}/summary`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAiSummary(res.data.summary);
    } catch {
      console.log("")
    }
  }


  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  if (error) return <DashboardLayout><p>{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="internship-detail-container">

        <div className="detail-header">
          <h1 style={{ color: "grey" }}>Internship Review</h1>
          <span className={`status-pill ${internship?.status}`}>
            {internship?.status}
          </span>
        </div>

        <div className="detail-grid">

          {/* LEFT */}

          <div className="detail-left">

            <div className="detail-card">
              <h3>Student Information</h3>
              <p><strong>Name:</strong> {internship?.student.name}</p>
              <p><strong>Email:</strong> {internship?.student.email}</p>
              <p><strong>Type:</strong> {internship?.type}</p>
            </div>

            <div className="detail-card">
              <h3>Internship Details</h3>
              <p><strong>Company:</strong> {internship?.company}</p>
              <p><strong>Department:</strong> {internship?.department}</p>
              <p><strong>Role:</strong> {internship?.role}</p>
              <p><strong>Duration:</strong> {duration} Months</p>
              <p><strong>Description:</strong> {internship?.documentText}</p>
            </div>

            <div className="detail-card">
              <h3>Uploaded Documents</h3>
              <button
                className="doc-btn"
                onClick={() =>
                  window.open(
                    `http://localhost:3000/${internship?.documentFile}`,
                    "_blank",
                    "width=600,height=500"
                  )
                }
              >
                View Offer Letter
              </button>
            </div>

          </div>

          {/* RIGHT */}

          <div className="detail-right">

            {/* Mentor Review */}

            <div className="review-card" >
              <h2 style={{ color: "grey" }}><i>Your Review</i></h2>

              <textarea
                className="review-textarea"
                value={comment}
                onChange={handleComment}
                placeholder="No comments yet..."
              />
              <button className="ai-btn" onClick={handleAiSummary}>
                <HiSparkles /> Generate AI Summary
              </button>

              <button className="ai-btn" onClick={()=>navigate(`/mentor/plagiarism/${internshipId}`)}>
                <HiSparkles /> Check Plagiarism
              </button>

              <div className="review-actions">
                <button
                  className="verify-btn"
                  onClick={() => handleReview("verified")}
                >
                  Verify
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReview("rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
            {aiSummary && (
              <div className="ai-summary-card">
                <h4>AI Summary</h4>
                <p>{aiSummary}</p>
              </div>
            )}

          

            {/* Previous Review */}

            {internship?.status !== "pending" && (
              <div className="review-card">
                <h3>Previous Review</h3>
                <strong>Status:</strong><span>{internship?.status}</span>
                <p><strong>Comment:</strong> {internship?.mentorComments || "No comment"}</p>
              </div>
            )}

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default InternshipDetail; 