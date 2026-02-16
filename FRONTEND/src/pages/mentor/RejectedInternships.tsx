import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface Internship {
  _id: string;
  company: string;
  role: string;
  status: "pending" | "verified" | "rejected";
  type: "internship" | "training";
  student: {
    name: string;
    email: string;
  };
}

const RejectedInternships=()=>{
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
    const fetchMentorInternships = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Mentor not authenticated");
          setLoading(false);
          return;
        }
        const res = await axios.get(
          "http://localhost:3000/internships/mentor",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data.detail);
        setInternships(res.data.detail || []);
      } catch {
        setError("Failed to load internships");
      } finally {
        setLoading(false);
      }
    };

    fetchMentorInternships();
  }, []);

   if (loading) {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px" }}>Loading mentor dashboard...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p style={{ color: "red", padding: "20px" }}>{error}</p>
      </DashboardLayout>
    );
  }

  const rejected = internships.filter((i) => i.status === "rejected");

    return (
        <>
         <DashboardLayout>

      {/* ================= GRID ================= */}
      <div className="dashboard-grid">
        {/* -------- LEFT -------- */}
        <div className="dashboard-left">
          {/* ================= STATS ================= */}

          {/* ================= TABLE ================= */}
          <div className="mentor-table-card">
            <div className="table-header">
              <h2>All Rejected Internships: {rejected.length}</h2>
            </div>

            <div className="table-head">
              <span>Student</span>
              <span>Company</span>
              <span>Type</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {rejected.map((item) => (
              <div className="table-row" key={item._id}>
                <span>{item.student.name}</span>
                <span>{item.company}</span>
                <span className="pill">{item.type}</span>
                <span className={`status ${item.status}`}>
                  {item.status}
                </span>
                <button
                  className="review-btn"
                  onClick={() => navigate(`/internships/mentor/${item._id}`)}
                >
                  {item?.status}
                </button>

              </div>
            ))}
          </div>
        </div>
        </div>
        </DashboardLayout>
        </>
    )
}

export default RejectedInternships;