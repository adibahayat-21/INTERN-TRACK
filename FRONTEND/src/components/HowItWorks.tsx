import { Cpu, Upload, UserCheck } from "lucide-react";
import "../styles/howitworks.css";


const HowItWorks = () => {
    return (
        <>
            <section className="how-it-works" id="how-it-works">
                <div className="how-container">

                    {/* section header */}
                    <div className="how-header">
                        <div className="how-badge">How It Works</div>
                        <h2>Simple, streamlined workflow</h2>
                        <p>
                            From submission to verification in three easy steps, powered by AI.
                        </p>
                    </div>

                    {/* steps row */}
                    <div className="how-steps">

                        {/* step 1 */}
                        <div className="how-step-card">
                            <div className="step-number">1</div>
                            <div className="step-icon"><Upload/></div>
                            <h3>Submit Uploads</h3>
                            <p>Student uploads internship details and supporting documents
                                through a guided form.</p>
                        </div>

                        {/* step 2 */}
                        <div className="how-step-card">
                            <div className="step-number">2</div>

                            <div className="step-icon">
                               <Cpu/>
                            </div>

                            <h3>AI Processing</h3>

                            <p>
                                AI extracts key fields, generates summaries, and runs plagiarism
                                checks automatically.
                            </p>
                        </div>


                        {/* step 3 */}
                        <div className="how-step-card">
                            <div className="step-number">3</div>

                            <div className="step-icon">
                               <UserCheck/>
                            </div>

                            <h3>Mentor Reviews</h3>

                            <p>
                                Mentor reviews AI-generated insights, verifies the submission,
                                or requests changes.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default HowItWorks;