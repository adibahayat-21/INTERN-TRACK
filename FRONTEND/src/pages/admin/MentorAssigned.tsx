import DashboardLayout from "../../components/layout/DashboardLayout";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { HiOutlineCheckCircle, HiOutlineClipboardList,HiOutlineUserAdd } from "react-icons/hi";

interface Internship {
  _id: string;
  company: string;
  role: string;
  department: string;
  status: "pending" | "verified" | "rejected";
  type: "internship" | "training";
  student: {
    name: string;
    email: string;
  };
  mentor?: {
    name: string;
  };
}

const MentorAssigned = () => {
  
  const navigate = useNavigate();

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH INTERNSHIPS ================= */

  useEffect(() => {
    const fetchAllInternships = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Admin not authenticated");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:3000/admin/allInternships",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInternships(res.data.data);
      } catch (err: unknown) {
        setError(
          "Failed to fetch internships: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllInternships();
  }, []);

  /* ================= LOADING / ERROR ================= */

  if (loading) {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px" }}>Loading admin data...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px", color: "red" }}>
          {error}
        </p>
      </DashboardLayout>
    );
  }

  /* ================= DERIVED STATS ================= */

//   internships whose mentor is assigned 
 const pending = internships.filter(
    (i) => i.status === "pending" && !i.mentor
  );
 const verified = internships.filter((i) => i.status === "verified" && i.mentor);
  const rejected = internships.filter((i) => i.status === "rejected" && i.mentor);
  const assigned = internships.filter((i) => i.mentor);


  /* ================= UI ================= */

  return (
    <DashboardLayout>
    
        {/* -------- LEFT SIDE -------- */}
        <div className="dashboard-left">
          {/* ================= STATS ================= */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">
                <HiOutlineClipboardList />
              </div>
              <div className="stat-text">
                <h3>{internships.length}</h3>
                <p>Total Internships</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">
                <HiOutlineUserAdd />
              </div>
              <div className="stat-text">
                <h3>{assigned.length}</h3>
                <p>Assigned Internships</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <HiOutlineCheckCircle />
              </div>
              <div className="stat-text">
                <h3>{verified.length}</h3>
                <p>Verified</p>
              </div>
            </div>
             <div className="stat-card">
              <div className="stat-icon green">
                <HiOutlineCheckCircle />
              </div>
              <div className="stat-text">
                <h3>{pending.length}</h3>
                <p>Pending</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">
                <HiOutlineUserAdd />
              </div>
              <div className="stat-text">
                <h3>{rejected.length}</h3>
                <p>Rejected</p>
              </div>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="admin-table-card">
            <div className="table-header">
              <h2>Recent Internship Submissions</h2>
              <span className="view-all">View All →</span>
            </div>

            <div className="table-head">
              <span>Student</span>
              <span style={{marginLeft:"35px"}}>Company</span>
              <span style={{marginLeft:"15px"}}>Type</span>
              <span style={{marginLeft:"15px"}}>Status</span>
              <span style={{marginLeft:"15px"}}>Mentor</span>
              <span>Action</span>
            </div>

            {assigned.map((item) => (
              <div className="table-row" key={item._id}>
                <span>{item.student.name}</span>
                <span style={{marginLeft:"40px"}}>{item.company}</span>
                <span className="pill">{item.type}</span>
                <span className={`status ${item.status}`}>
                  {item.status}
                </span>
                <span>
                  {item.mentor ? item.mentor.name : <em>Not Assigned</em>}
                </span>
                <button
                  className="assign-btn"
                  disabled={!!item.mentor}
                  // iska mtlb yeh h ki agar mentor h to button disabled rhega 
                  onClick={() =>
                    navigate(`/admin/assign-mentor/${item._id}`)
                  }
                >
                  Assign Mentor
                </button>
              </div>
            ))}
          </div>
        </div>
    
    </DashboardLayout>
  );
};

export default MentorAssigned;

