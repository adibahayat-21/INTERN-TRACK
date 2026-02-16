import DashboardLayout from "../../components/layout/DashboardLayout";
import "./studentDash.css";
import cardImage from "../../assets/Programming-rafiki.png";
import profileImage from "../../assets/76683d35-d0e9-4bf4-a630-99a6cc7da8c2.jpg";
import { HiOutlineBriefcase, HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface Internship{
  _id:string;
  company:string;
  role:string;
  type:"internship"|"training";
  startDate:string;
  endDate:string;
  status:"pending"|"verified"|"rejected";
}
const StudentDashboard = () => {
  const navigate = useNavigate();
  const [internships,setInternships]=useState<Internship[]>([]);
  const [loading,setLoading]=useState(true);
  const [internshipError,setInternshipError]=useState("");
  const [userError,setUserError]=useState("");
  const {internshipId}=useParams();

 const pendingInternships=internships.filter((i)=>i.status==="pending")
 
 const verifiedInternships=internships.filter((i)=>i.status==="verified")

 const rejectedInternships=internships.filter((i)=>i.status==="rejected")

  interface UserProfile{
  name:string;
  email:string;
  role:string;
  createdAt:string;
  department:string;
 }

 const [user,setUser]=useState<UserProfile|null>(null);

 // Page load hote hi API call
  useEffect(()=>{
    const fetchInternships=async()=>{
      try{
        const token=localStorage.getItem("token");

        if(!token){
          setUserError("user not authenticated");
          return;
        }
       
        const res=await axios.get( "http://localhost:3000/internships/student",{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        })
        setInternships(res.data.detail);
      }catch(error:unknown)
      {
        setInternshipError("failed to fetch internships:"+(error instanceof Error ? error.message : "Unknown error"))
      }
      finally{
        setLoading(false);
      }
    }
    fetchInternships();
  },[])

 useEffect(()=>{
  const fetchUserProfile=async()=>{
    try{
      const token=localStorage.getItem("token");
      if(!token)
      {
        setUserError("User not authenticated");
        return ;
      }
      const res=await axios.get("http://localhost:3000/users/me",{
        headers:{
          Authorization:`Bearer ${token}`,
        }
      })
      console.log(res.data);
      setUser(res.data);
    }catch(error:unknown)
    {
      setUserError("Failed to fetch user profile:"+(error instanceof Error ? error.message : "Unknown error"))
    }
  }
  fetchUserProfile();
 },[])

  
  if(loading)
  {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px" }}>Loading internships...</p>
      </DashboardLayout>
    )
  }
  
    if (internshipError || userError) {
    return (
      <DashboardLayout>
        <p style={{ padding: "20px", color: "red" }}>{internshipError || userError}</p>
      </DashboardLayout>
    );
  }
  return (
  
    <DashboardLayout>
      {/* HERO SECTION */}

      <div className="hero-card">
        <div className="hero-text">
          <h1>Welcome back, Student 👋</h1>
          <p>
            Track your internships and verification status.
            Stay on top of your career journey.
          </p>
          <button className="hero-btn" onClick={()=>navigate("/student/submit")}>
            + Submit Internship
          </button>
        </div>
        <div className="hero-image">
          <img src={cardImage} alt="Programming illustration" className="image1" />
        </div>
      </div>
      {/* STATS SECTION */}
<div className="stats-grid">

  <div className="stat-card">
    <div className="stat-icon purple">
      <HiOutlineBriefcase />
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
      <h3>{pendingInternships.length}</h3>
      <p>Pending Verification</p>
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-icon green">
      <HiOutlineCheckCircle />
    </div>
    <div className="stat-text">
      <h3>{verifiedInternships.length}</h3>
      <p>Verified</p>
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-icon red">
      <HiOutlineXCircle />
    </div>
    <div className="stat-text">
      <h3>{rejectedInternships.length}</h3>
      <p>Rejected</p>
    </div>
  </div>

</div>
{/* ======================================================================== */}

<div className="dashboard-grid">
  <div className="dashboard-left">
    <div className="recent-card">
  <div className="recent-header">
    <div>
      <h2>Recent Internships</h2>
      <p>Your latest internship submissions</p>
    </div>
    <button className="view-all" style={{color:"grey", border:"none", backgroundColor:"white"}} onClick={()=>navigate(`/student/fullDetail/${internshipId}`)}>View All →</button>
  </div>

{/* 👇 HEADER ROW */}
  <div className="internship-head">
    <span style={{marginLeft:"-25px"}}>Company</span>
    <span style={{marginLeft:"-15px"}}>Role</span>
    <span >Type</span>
    <span style={{marginRight:"20px"}}>Duration</span>
    <span>Status</span>
  </div>


  {/* rows yahan aayengi */}
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
              <span className="company-name" style={{marginLeft:"10px"}}>{item.company}</span>
              <span style={{marginLeft:"40px"}}>{item.role}</span>

              <span
                className={`pill ${
                  item.type === "training" ? "training" : ""
                }`}
              >
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>

              <span>{durationMonths} months</span>

              <span className={`status ${item.status}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
          );
        })}
</div>

  </div>

 <div className="dashboard-right">

  <div className="profile-card">
    <div className="profile-avatar">
      <img src={profileImage} alt="Profile" />
    </div>

    <h3 className="profile-name">{user?.name || "Guest User"}</h3>
    <span className="profile-role">{user?.role || "Student"}</span>

    <div className="profile-info-box">
      <div className="info-row">
        <span>Email:</span>
        <p>{user?.email || "no email available"}</p>
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

    <button className="profile-btn">
      View Full Profile
    </button>

  </div>

</div>
</div>

    </DashboardLayout>
  );
};

export default StudentDashboard;
