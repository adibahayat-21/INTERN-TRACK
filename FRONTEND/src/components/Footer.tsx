import "../styles/footer.css";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT BRAND */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span>I</span>
            <h3>INTERN-TRACK</h3>
          </div>

          <p>
            AI-powered internship management platform for colleges.
            Simplify submissions, verification, and reviews.
          </p>

          <div className="footer-socials">
            <Twitter />
            <Github />
            <Linkedin />
            <Mail />
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links">

          <div>
            <h4>Product</h4>
            <ul>
              <li>Features</li>
              <li>How It Works</li>
              <li>Pricing</li>
              <li>Changelog</li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Press Kit</li>
            </ul>
          </div>

          <div>
            <h4>Resources</h4>
            <ul>
              <li>Documentation</li>
              <li>Help Center</li>
              <li>API Reference</li>
              <li>Status</li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2025 INTERN-TRACK. All rights reserved.</p>
        <p>Made with ❤️ for educators and students</p>
      </div>
    </footer>
  );
};

export default Footer;
