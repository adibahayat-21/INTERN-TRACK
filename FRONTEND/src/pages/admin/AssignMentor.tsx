import { useNavigate, useParams } from "react-router-dom";
import "./assignMentor.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AssignMentor = () => {
  const navigate = useNavigate();
  const { internshipId } = useParams();

  interface Internship {
    company: string;
    department: string;
    student: {
      name: string;
    };
  }

  interface Mentor {
    _id: string;
    name: string;
    department?: string;
    workload?: string;
  }

  const [internship, setInternship] = useState<Internship | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [suggestedMentor, setSuggestedMentor] = useState<Mentor | null>(null);

  const [selectedMentor, setSelectedMentor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // FETCH INTERNSHIP DETAILS
  // ================================

  const fetchInternshipDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Admin not authenticated");
        return;
      }

      const res = await axios.get(
        `http://localhost:3000/admin/internships/${internshipId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInternship(res.data.data);
    } catch {
      setError("Failed to load internship details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (internshipId) {
      fetchInternshipDetails();
    }
  }, [internshipId]);

  // ================================
  // FETCH MENTORS (Manual Dropdown)
  // ================================

  useEffect(() => {
    if (!internship?.department) return;

    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `http://localhost:3000/admin/mentors?department=${internship.department}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMentors(res.data.data);
      } catch {
        toast.error("Failed to load mentors");
      }
    };

    fetchMentors();
  }, [internship?.department]);

  // ================================
  // FETCH AI SUGGESTION
  // ================================

  const fetchAISuggestion = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `http://localhost:3000/admin/internships/${internshipId}/ai-suggest-mentor`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      setSuggestedMentor(res.data.suggestedMentor);
    } catch {
      toast.error("Failed to fetch AI suggestion");
    }
  };

  useEffect(() => {
    if (internshipId) {
      fetchAISuggestion();
    }
  }, [internshipId]);

  // ================================
  // ASSIGN AI SUGGESTED MENTOR
  // ================================

  const handleAISuggestionAssign = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !suggestedMentor) return;

      await axios.patch(
        `http://localhost:3000/admin/internships/${internshipId}/assign-mentor`,
        { mentorId: suggestedMentor._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("AI Mentor assigned successfully");
      navigate("/admin-dashboard");
    } catch {
      toast.error("Failed to assign AI mentor");
    }
  };

  // ================================
  // MANUAL ASSIGNMENT
  // ================================

  const handleManualAssign = async () => {
    if (!selectedMentor) {
      toast.error("Please select a mentor");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.patch(
        `http://localhost:3000/admin/internships/${internshipId}/assign-mentor`,
        { mentorId: selectedMentor },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Mentor assigned successfully");
      navigate("/admin-dashboard");
    } catch {
      toast.error("Failed to assign mentor");
    }
  };

  // ================================
  // UI STATES
  // ================================

  if (loading) {
    return (
      <div className="modal-backdrop">
        <div className="assign-modal">
          <p>Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="modal-backdrop">
        <div className="assign-modal">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </div>
    );
  }

  // ================================
  // UI
  // ================================

  return (
    <div className="modal-backdrop">
      <div className="assign-modal">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Assign Mentor</h2>
          <p>AI-assisted mentor recommendation</p>
        </div>

        {/* INTERNSHIP INFO */}
        <div className="info-card">
          <p><strong>Student:</strong> {internship.student.name}</p>
          <p><strong>Company:</strong> {internship.company}</p>
          <p><strong>Department:</strong> {internship.department}</p>
        </div>

        {/* AI SUGGESTED MENTOR */}
        {suggestedMentor && (
          <div className="ai-suggestion">
            <span className="ai-badge">AI Recommended</span>

            <h4>{suggestedMentor.name}</h4>
            <p>Department: {suggestedMentor.department}</p>
            <p>Current Workload: {suggestedMentor.workload}</p>

            <button
              className="use-ai-btn"
              onClick={handleAISuggestionAssign}
            >
              Use AI Suggested Mentor
            </button>
          </div>
        )}

        {/* MANUAL SELECT */}
        <div className="select-box">
          <label>Select another mentor</label>
          <select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
          >
            <option value="">Choose mentor</option>
            {mentors.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* ACTIONS */}
        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            Cancel
          </button>

          <button
            className="confirm-btn"
            onClick={handleManualAssign}
          >
            Assign Mentor
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssignMentor;
