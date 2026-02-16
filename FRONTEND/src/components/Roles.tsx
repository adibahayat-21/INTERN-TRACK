import "../styles/roles.css";
import { GraduationCap, Users, FileText, Check } from "lucide-react";

const Roles = () => {
  return (
    <section className="roles" id="roles">
      <div className="roles-container">

        {/* SECTION HEADER */}
        <div className="roles-header">
          <div className="roles-badge">For Everyone</div>

          <h2>Built for every stakeholder</h2>

          <p>
            Whether you're a student, mentor, or administrator, INTERN-TRACK
            has the tools you need.
          </p>
        </div>

        {/* ROLE CARDS */}
        <div className="roles-cards">

          {/* STUDENTS */}
          <div className="role-card student">
            <div className="role-header">
              <div className="role-icon">
                <GraduationCap />
              </div>

              <h3>Students</h3>
              <p>Streamline your internship journey with intelligent tools.</p>
            </div>

            <ul>
              <li><Check /> Easy internship submission with guided forms</li>
              <li><Check /> AI-assisted field auto-filling</li>
              <li><Check /> Real-time status tracking</li>
              <li><Check /> Document management dashboard</li>
            </ul>
          </div>

          {/* MENTORS */}
          <div className="role-card mentor">
            <div className="role-header">
              <div className="role-icon">
                <Users />
              </div>

              <h3>Mentors</h3>
              <p>Review and verify submissions with AI-powered insights.</p>
            </div>

            <ul>
              <li><Check /> AI-generated document summaries</li>
              <li><Check /> Integrated plagiarism detection</li>
              <li><Check /> Batch review capabilities</li>
              <li><Check /> Quick approval workflows</li>
            </ul>
          </div>

          {/* ADMINS */}
          <div className="role-card admin">
            <div className="role-header">
              <div className="role-icon">
                <FileText />
              </div>

              <h3>Administrators</h3>
              <p>Oversee the entire internship process with full control.</p>
            </div>

            <ul>
              <li><Check /> Mentor assignment management</li>
              <li><Check /> Comprehensive audit logs</li>
              <li><Check /> Analytics and reporting</li>
              <li><Check /> Institution-wide oversight</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Roles;
