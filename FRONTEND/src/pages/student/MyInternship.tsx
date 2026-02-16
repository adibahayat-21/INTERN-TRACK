import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import "./myInternship.css";
import axios from "axios";
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
  documentFile:string;
  mentor?:{
    name:string;
    department:string;
    email:string
  }
}

const MyInternship = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  // Page load hote hi API call
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User not authenticated");
          return;
        }

        const res = await axios.get(
          "http://localhost:3000/internships/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInternships(res.data.detail);
      } catch (error: unknown) {
        setError(
          "Failed to fetch internships: " +
          (error instanceof Error ? error.message : "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Loading UI
  if (loading) {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px" }}>Loading internships...</p>
      </DashboardLayout>
    );
  }

  // Error UI
  if (error) {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px", color: "red" }}>{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="myinternships-card">
        <h2 className="page-title">
          {internships.length} Internships
        </h2>

        {/* TABLE HEADER */}
        <div className="table-head">
          <span>Company</span>
          <span>Role</span>
          <span>Type</span>
          <span>Duration</span>
          <span>Status</span>
        </div>

        {/* EMPTY STATE */}
        {internships.length === 0 && (
          <p style={{ padding: "20px", color: "gray" }}>
            No internships submitted yet.
          </p>
        )}

        {/* DATA ROWS */}
        {internships.map((item) => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);

          const durationMonths =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());

          return (
            <div className="table-row" key={item._id}>
              <span className="company-name">{item.company}</span>
              <span>{item.role}</span>

              <span
                className={`pill ${item.type === "training" ? "training" : ""
                  }`}
              >
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>

              <span>{durationMonths} months</span>

              <span className={`status ${item.status}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>

              <div className="internship-extra">

                {item?.mentorComments && (
                  <>
                    <div className="comment-title">Mentor's Comment</div>
                    <div className="comment-text">{item.mentorComments}</div>
                  </>
                )}

                <div className="verified-date">
                  Verified At: {item?.verifiedAt
                    ? new Date(item.verifiedAt).toLocaleDateString()
                    : "Not verified yet"}
                </div>

                <div>
                  Mentor : {item?.mentor?.name || "Not Assigned"}
                  <br></br>
                  {/* Mentor's Department : {item?.mentor.department || "Not Assigned"}
                  <br></br>
                  Mentor's Email : {item?.mentor.email || "Not Assigned"} */}
                </div>

                {/* <div>
                  {item?.documentFile && (
                    <button className="view-doc-btn" onClick={()=>window.open(`http://localhost:3000/${item.documentFile}`,"_blank", "width=700, height=600")}>
                      View Uploaded Document
                    </button>
                  )}
                </div> */}

                  <button className="view-doc-btn" onClick={()=>navigate(`/student/fullDetail/${item._id}`)}>
                      View Full Detail
                    </button>

              </div>

            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default MyInternship;
