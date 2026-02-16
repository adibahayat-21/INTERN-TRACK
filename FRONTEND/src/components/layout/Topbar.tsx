import { FiSearch, FiBell, FiChevronDown } from "react-icons/fi";
import profileImage from "../../assets/76683d35-d0e9-4bf4-a630-99a6cc7da8c2.jpg";
import { HiHome } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Topbar = () => {
   const [userError,setUserError]=useState("");
   interface UserProfile{
     name:string;
     email:string;
     role:string;
     createdAt:string;
     department:string;
    }
   
  const [user,setUser]=useState<UserProfile|null>(null);
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
    }catch(userError:unknown)
    {
      setUserError("Failed to fetch user profile:"+(userError instanceof Error ? userError.message : "Unknown error"))
    }
  }
  fetchUserProfile();
 },[])

  const navigate = useNavigate();
  return (
    <header className="topbar">
      <div className="topbar-search-wrapper">
            <HiHome className="back-icon" style={{ fontSize: "20px", color:"grey" }} onClick={() => navigate("/")} />
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search internships, companies..."
          className="topbar-search"
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div className="notification">
          <FiBell />
          <span className="badge">3</span>
        </div>

        <div className="topbar-profile">
         <div className="profile-top">
      <img src={profileImage} alt="Profile" />
    </div>
          <div className="profile-info">
            <span className="name">{user?.name || "Guest User"}</span>
            <span className="role">{user?.role || "Student"}</span>
          </div>
          <div><span><FiChevronDown/></span></div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
