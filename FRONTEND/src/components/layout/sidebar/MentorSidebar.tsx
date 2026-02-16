import { NavLink} from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineClipboardCheck,
  HiOutlineLogout,
} from "react-icons/hi";
import "./mentorSidebar.css";
import { useAuth } from "../../../context/UseAuth";
import { HiOutlineClock, HiOutlineXCircle } from "react-icons/hi2";

const MentorSidebar = () => {
  const { logout } = useAuth();
  return (
    <aside className="mentor-sidebar">
      {/* LOGO */}
      <div className="sidebar-header">
        <span className="logo-icon">🎓</span>
        <h2>INTERN-TRACK</h2>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        <NavLink to="/mentor-dashboard" className="menu-item">
          <HiOutlineViewGrid />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/mentor/verifiedInternships" className="menu-item">
          <HiOutlineClipboardCheck />
          <span>Verified Internships</span>
        </NavLink>

         <NavLink to="/mentor/rejectedInternships" className="menu-item">
          <HiOutlineXCircle />
          <span>Rejected Internships</span>
        </NavLink>

         <NavLink to="/mentor/pendingInternships" className="menu-item">
          <HiOutlineClock />
          <span>Pending Internships</span>
        </NavLink>

      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <HiOutlineLogout />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default MentorSidebar;
