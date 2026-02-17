import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import "./mentorDash.css";
import {
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import axios from "axios";
import profileImage from "../../assets/76683d35-d0e9-4bf4-a630-99a6cc7da8c2.jpg";
import heroImage from "../../assets/mentoring-program-concept-flat-vector-illustration-senior-colleague-guiding-young-professional-fostering-skill-development-302160789.webp";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

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

interface UserProfile {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

/* ================= COMPONENT ================= */

const MentorDashboard = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* ================= FETCH ASSIGNED INTERNSHIPS ================= */

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

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    };
    fetchProfile();
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

  /* ================= DERIVED STATS ================= */

const pending = internships.filter((i) => i.status === "pending");
const verified = internships.filter((i) => i.status === "verified");
const rejected = internships.filter((i) => i.status === "rejected");


  return (
    <DashboardLayout>
      {/* ================= HERO ================= */}
      <div className="hero-card mentor-hero">
        <div className="hero-text">
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>
            Review assigned internships, verify submissions and guide students.
          </p>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Mentor Hero" />
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="dashboard-grid">
        {/* -------- LEFT -------- */}
        <div className="dashboard-left">
          {/* ================= STATS ================= */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">
                <HiOutlineClipboardList />
              </div>
              <div className="stat-text">
                <h3>{internships.length}</h3>
                <p>Total Assigned</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon yellow">
                <HiOutlineClock />
              </div>
              <div className="stat-text">
                <h3>{pending.length}</h3>
                <p>Pending Reviews</p>
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
              <div className="stat-icon red">
                <HiOutlineXCircle />
              </div>
              <div className="stat-text">
                <h3>{rejected.length}</h3>
                <p>Rejected</p>
              </div>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="mentor-table-card">
            <div className="table-header">
              <h2>Assigned Internship Submissions</h2>
            </div>

            <div className="table-head">
              <span>Student</span>
              <span>Company</span>
              <span>Type</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {internships.map((item) => (
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

        {/* -------- RIGHT -------- */}
        <div className="dashboard-right">
          <div className="profile-card">
            <div className="profile-avatar">
              <img src={profileImage} alt="Profile" />
            </div>

            <h3 className="profile-name">{user?.name}</h3>
            <span className="profile-role">Mentor</span>

            <div className="profile-info-box">
              <div className="info-row">
                <span>Email:</span>
                <p>{user?.email}</p>
              </div>

              <div className="info-row">
                <span>Joined:</span>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "No date available"}</p>
              </div>
            </div>

            <div className="profile-status">
              <span className="active-dot"></span>
              Active
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard;
