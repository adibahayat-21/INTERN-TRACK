import "../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";
import {useAuth} from "../context/UseAuth"

const Navbar = () => {
 const { token, role, logout } = useAuth();

 const location = useLocation();

 const isDashboard=location.pathname.includes("dashboard");

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <div className="navbar-logo">
          <span className="logo-icon">I</span>
          <span className="logo-text">INTERN-TRACK</span>
        </div>

{/* it means if there is no dashboard then just show the navbar of landing page  */}
        {!isDashboard && (
          <>
            {/* LINKS */}
        <ul className="navbar-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#roles">Roles</a></li>
          <li><a href="#cta">Get Started</a></li>
        </ul>
         </>
        )}

{/* it means when there is a specific dashboard then just show the page of that specific thing whether it is student or mentor or admin */}
      {
        isDashboard && (
          <>
           {role === "student" && <a href="/student-dashboard">Dashboard</a>}
          {role === "mentor" && <a href="/mentor-dashboard">Dashboard</a>}
          {role === "admin" && <a href="/admin-dashboard">Dashboard</a>}
          </>
        )
      }

        {/* ACTIONS */}
        <div className="navbar-actions">

          {/* not logged in */}
          {!token && (
            <>
             <Link to="/login" className="btn-login">
            Login
          </Link>

          <Link to="/register" className="btn-primary">
            Get Started
          </Link>

            </>
          )}

          {/* logged in */}
          {token && (
            <>
            {/* role-based dashboard link */}
            {role==="student" && (
              <Link to="/student-dashboard" className="btn-login">
                Dashboard
              </Link>
            )
            }

             {role === "mentor" && (
                <Link to="/mentor-dashboard" className="btn-login">
                  Dashboard
                </Link>
              )}

               {role === "admin" && (
                <Link to="/admin-dashboard" className="btn-login">
                  Dashboard
                </Link>
              )}

               <button className="btn-primary" onClick={logout}>
                Logout
              </button>
            </>
          )}

         
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
