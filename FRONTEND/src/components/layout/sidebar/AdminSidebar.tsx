import { NavLink } from "react-router-dom";
import {
  HiOutlineViewGrid,
  // HiOutlineClipboardList,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineLogout
} from "react-icons/hi";
import "./adminSidebar.css";
import { useAuth } from "../../../context/UseAuth";

const AdminSidebar = () => {
   const { logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      {/* LOGO */}
      <div className="sidebar-header">
        <span className="logo-icon">🎓</span>
        <h2>INTERN-TRACK</h2>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        <NavLink to="/admin-dashboard" className="menu-item">
          <HiOutlineViewGrid />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/assign-mentor" className="menu-item">
          <HiOutlineUserGroup />
          <span>Assigned Mentor</span>
        </NavLink>

          <NavLink to="/admin/pending-assignment" className="menu-item">
          <HiOutlineUserGroup />
          <span>Pending Assignment </span>
        </NavLink>

        <NavLink to="/admin/audit-logs" className="menu-item">
          <HiOutlineShieldCheck />
          <span>Audit Logs</span>
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

export default AdminSidebar;
