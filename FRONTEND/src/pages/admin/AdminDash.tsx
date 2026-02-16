import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import "./adminDash.css";
import {
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineUserAdd,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import profileImage from "../../assets/76683d35-d0e9-4bf4-a630-99a6cc7da8c2.jpg";
import heroImage from "../../assets/admin-control-panel-vector.jpg"

/* ================= TYPES ================= */

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

interface UserProfile {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

/* ================= COMPONENT ================= */

const AdminDashboard = () => {
  
  const navigate = useNavigate();

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState<UserProfile | null>(null);
  const [userError, setUserError] = useState("");

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

  /* ================= FETCH ADMIN PROFILE ================= */

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserError("User not authenticated");
          return;
        }

        const res = await axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (error: unknown) {
        setUserError(
          "Failed to fetch user profile: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
      }
    };

    fetchUserProfile();
  }, []);

  /* ================= LOADING / ERROR ================= */

  if (loading) {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px" }}>Loading admin data...</p>
      </DashboardLayout>
    );
  }

  if (error || userError) {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px", color: "red" }}>
          {error || userError}
        </p>
      </DashboardLayout>
    );
  }

  /* ================= DERIVED STATS ================= */

  const verified = internships.filter((i) => i.status === "verified");
  const rejected = internships.filter((i) => i.status === "rejected");
  const unassigned = internships.filter((i) => !i.mentor);
  const assigned = internships.filter((i) => i.mentor);

  /* ================= UI ================= */

  return (
    <DashboardLayout>
      {/* ================= HERO ================= */}
      <div className="hero-card admin-hero" style={{display:"flex"}}>
        <div className="hero-text">
          <h1>Welcome back, {user?.name || "Admin"} 👋</h1>
          <p>
            Manage internships and assign mentors efficiently.
            Keep track of all student submissions in one place.
          </p>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Admin Profile" style={{borderRadius:"20px"}}/>
        </div>
    </div>
      {/* ================= MAIN GRID ================= */}
      <div className="dashboard-grid">
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
              <div className="stat-icon yellow">
                <HiOutlineClock />
              </div>
              <div className="stat-text">
                <h3>{unassigned.length}</h3>
                <p>Unassigned</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">
                <HiOutlineUserAdd />
              </div>
              <div className="stat-text">
                <h3>{assigned.length}</h3>
                <p>Assigned</p>
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

            {internships.map((item) => (
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

        {/* -------- RIGHT SIDE -------- */}
        <div className="dashboard-right">
          <div className="profile-card">
             <div className="profile-avatar">
      <img src={profileImage} alt="Profile" />
    </div>
            <h3 className="profile-name">{user?.name}</h3>
            <span className="profile-role">{user?.role}</span>

            <div className="profile-info-box">
              <div className="info-row">
                <span>Email:</span>
                <p>{user?.email}</p>
              </div>

              <div className="info-row">
                <span>Joined:</span>
                <p>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className="profile-status">
              <span className="active-dot"></span>
              Active
            </div>

            <button className="profile-btn">View Full Profile</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
