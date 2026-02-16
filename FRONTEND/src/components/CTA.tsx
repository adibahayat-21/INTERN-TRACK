import "../styles/cta.css";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";


const CTA = () => {
  return (
    <section className="cta" id="cta">
      <div className="cta-container">

        <div className="cta-icon">
          <Sparkles />
        </div>

        <h2>Start managing internships the smarter way</h2>

        <p>
          Join institutions already using INTERN-TRACK to streamline internship
          programs with AI.
        </p>

        <div className="cta-buttons">
            <Link to="/register" className="btn-primary">
            Get Started  <ArrowRight />
          </Link>

          <Link to="/login" className="cta-secondary">
          Login 
          </Link>
        </div>

        <div className="cta-note">
          No credit card required • Free for small teams • Setup in minutes
        </div>

      </div>
    </section>
  );
};

export default CTA;
