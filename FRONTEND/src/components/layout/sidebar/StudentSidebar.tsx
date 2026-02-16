import { NavLink } from "react-router-dom";
import { FiBriefcase, FiFileText, FiGrid, FiLogOut, FiUpload } from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi";
import "./studentsidebar.css";
import { useAuth } from "../../../context/UseAuth";

const StudentSidebar = () => {
  const {logout}=useAuth();
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo"><div className="hatClass"><HiAcademicCap className="hatlogo"/></div>INTERN-TRACK</h2>

      <nav className="sidebar-nav">
        <NavLink to="/student-dashboard" style={{display:"flex", gap:"7px"}}><FiGrid/>Dashboard</NavLink>
        <NavLink to="/student/internships" style={{display:"flex", gap:"7px"}}><FiBriefcase/>My Internships</NavLink>
        <NavLink to="/student/submit" style={{display:"flex", gap:"7px"}}><FiUpload/>Submit Internship</NavLink>
      </nav>

      {/* <hr/> */}
      <div className="sidebar-logout" style={{display:"flex", gap:"7px"}} onClick={logout}>
        <FiLogOut style={{marginLeft:"10px"}}/>
        Logout
      </div>
    </aside>
  );
};

export default StudentSidebar;
