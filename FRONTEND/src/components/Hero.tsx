import heroImage from "../assets/fotor-ai-20251227195632.jpg";
import "../styles/hero.css";
import { Link } from "react-router-dom";


const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-container">

        {/* LEFT CONTENT */}
        <div className="hero-content">
          <div className="hero-badge">
            AI-Powered Internship Platform
          </div>

          <h1>
            Manage College Internships <br />
            <span>AND TRAINING</span>
          </h1>

          <p>
            INTERN-TRACK helps students, mentors, and administrators automate
            internship submissions, verification, and reviews using AI.
          </p>

             <Link to="/register" className="btn-primary">
            Get Started
          </Link>

        </div>

        {/* RIGHT IMAGE */}
        <div className="hero-visual">
          <img
            src={heroImage}
            alt="Intern-Track landing illustration"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
