import DashboardLayout from "../../components/layout/DashboardLayout";
import "./plagiarismInternship.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import { useRef } from "react";
import { NavLink } from "react-router-dom";


const PlagiarismDetail = () => {
  interface Internship {
    _id: string;
    company: string;
    role: string;
    department: string;
    status: "pending" | "verified" | "rejected";
    type: "internship" | "training";
    documentText: string;
    documentFile: string;
    startDate: Date;
    endDate: Date;
    mentorComments?: string;
    student: {
      name: string;
      email: string;
    };
  }

  const { internshipId } = useParams();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plagiarismData, setPlagiarismData] = useState<any>(null);
  const [plagiarismLoading, setPlagiarismLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInternshipDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/internships/mentor/${internshipId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setInternship(res.data.data);
      } catch {
        setError("Failed to load internship");
      } finally {
        setLoading(false);
      }
    };

    fetchInternshipDetail();
  }, [internshipId]);



  useEffect(() => {
    const PlagiarismCheck = async () => {
      try {
        setPlagiarismLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://localhost:3000/internships/${internshipId}/plagiarism`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        console.log(res.data);
        setPlagiarismData(res.data);
      } catch {
        toast.error("failed to check plagiarism");
        setError("Failed to load internship");
      } finally {
        setPlagiarismLoading(false);
      }
    }
    PlagiarismCheck();
  }, [internshipId]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current)
      return;

    // const canvas = await html2canvas(reportRef.current, {
    //   scale: 3,
    //   useCORS: true,
    //   backgroundColor: "#ffffff"
    // });

    const pdf = new jsPDF();
    pdf.text("Plagiarism Report", 20, 20);
    pdf.text(`Highest Similarity: ${plagiarismData.highestSimilarity}%`, 20, 30);

    let y = 40;

    plagiarismData.results.forEach((r: any) => {
      pdf.text(`${r.studentName} - ${r.company} - ${r.similarity}%`, 20, y);
      y += 10;
    });

    pdf.save("Plagiarism_Report.pdf");

  }


  if (plagiarismLoading || loading)
    return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  if (error)
    return <DashboardLayout><p>{error}</p></DashboardLayout>;

    return (
  <DashboardLayout>
    <div className="plagiarism-page-wrapper">
      <div className="back-wrapper">
          <NavLink to={`/internships/mentor/${internshipId}`} className="back-button" style={{backgroundColor:"darkblue"}}>
            ← Back to Dashboard
          </NavLink>
        </div>

      {/* ✅ STUDENT CARD */}
      <div className="detail-card">
        <h3>Student Information</h3>
        <p><strong style={{color:"white"}}>Name:</strong> {internship?.student.name}</p>
        <p><strong style={{color:"white"}}>Email:</strong> {internship?.student.email}</p>
        <p><strong style={{color:"white"}}>Type:</strong> {internship?.type}</p>
      </div>

      {/* ✅ RESULT CARD */}
      {plagiarismData && (
        <div ref={reportRef} className="plagiarism-result-card">

          <div className="plagiarism-header">
            <h3>Plagiarism Check</h3>

            <button className="download-btn" onClick={handleDownloadPDF}>
              Download PDF
            </button>

            <span className={`similarity-badge ${
              plagiarismData.highestSimilarity > 60 ? "danger" :
              plagiarismData.highestSimilarity > 30 ? "warning" : "safe"
            }`}>
              Highest Similarity: {plagiarismData.highestSimilarity}%
            </span>
          </div>

          <h4>Compared Internships</h4>

          <div className="plagiarism-table">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Company</th>
                  <th>Similarity</th>
                </tr>
              </thead>

              <tbody>
                {[...plagiarismData.results]
                  .sort((a: any, b: any) => b.similarity - a.similarity)
                  .map((r: any, index: number) => (
                    <tr key={r.internshipId}>
                      <td>{r.studentName || "Unknown"}</td>

                      <td>
                        <strong>{r.company}</strong>
                        <br />
                        <small>{r.role}</small>
                      </td>

                      <td>
                        <div className="progress">
                          <div
                            className="progress-fill"
                            style={{ width: `${r.similarity}%` }}
                          />
                        </div>

                        <span className={
                          r.similarity > 70 ? "high" :
                          r.similarity > 40 ? "medium" : "low"
                        }>
                          {r.similarity.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  </DashboardLayout>
);

}

export default PlagiarismDetail;