import "../styles/features.css"
import {FileText, ScanText, LayoutDashboard, CheckCircle} from "lucide-react"

const Features = () => {
    return (
        <section className="features" id="features">
            <div className="features-container">

                {/* section header */}
                <div className="features-header">

                    <div className="features-badge">
                        Features
                    </div>
                    <h2>Everything you need to manage internships efficiently</h2>
                    <p>
                        Powerful tools designed to streamline the entire internship lifecycle
                        from submission to verification.
                    </p>
                </div>

                {/* features grid */}
                <div className="features-grid">

                    {/* feature 1 */}
                    <div className="feature-card">

                        <div className="feature-icon">
                            {/* yha pr icon aaega */}
                            <FileText/>
                        </div>
                        <h3>AI-Powered Document Summary</h3>

                        <p>
                            Automatically generates concise summaries of internship documents
                            for mentors, saving hours of manual review.
                        </p>
                    </div>

                    {/* feature 2 */}
                    <div className="feature-card">
                        <div className="feature-icon"><ScanText/></div>
                        <h3>Plagiarism & Similarity Detection</h3>

                        <p>
                            Detects similarity between internship reports to maintain academic
                            integrity and ensure originality.
                        </p>
                    </div>

                    {/* feature 3 */}
                    <div className="feature-card">
                        <div className="feature-icon"><LayoutDashboard/></div>
                        <h3>Role-Based Dashboards</h3>

                        <p>
                            Separate dashboards for students, mentors, and admins with clear
                            workflows tailored to each role.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon"><CheckCircle/></div>
                        <h3>Mentor & Admin Verification Flow</h3>
                        <p>
                            Streamlined approval, rejection, and audit logging of internships
                            with complete transparency.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Features;