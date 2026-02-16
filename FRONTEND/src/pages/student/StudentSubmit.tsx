import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import "./studentSubmit.css";
import { HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";
import { HiSparkles } from "react-icons/hi";


const StudentSubmit = () => {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const initialFormData = {
  companyName: "",
  role: "",
  type: "",
  startDate: "",
  endDate: "",
  department: "",
  documentText: ""
};
  const [formData, setFormData] = useState(initialFormData);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (!formData.documentText.trim()) {
      newErrors.documentText = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate())   //it is used to check the empty fields
      return;

    if (!documentFile) {
      alert("Please upload document");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = new FormData();

      // text fields
      data.append("companyName", formData.companyName);
      data.append("role", formData.role);
      data.append("department", formData.department);
      data.append("type", formData.type);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("documentText", formData.documentText);

      // file (MOST IMPORTANT)
      data.append("documentFile", documentFile);

      const res = await axios.post(
        "http://localhost:3000/internships",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Success:", res.data);
      toast.success("Internship submitted successfully")
      setFormData(initialFormData);
      setErrors({});
    } catch (err) {
      console.error("Error submitting internship:", err);
      toast.error("Error submitting internship");
    }
  };

  const extractingFields=async()=>{
    try{
      if(!formData.documentText.trim())
      {
        toast.error("Please write description first");
        return ;
      }
      const token=localStorage.getItem("token");
      if(!token)
        return ;
      const res=await axios.post(`http://localhost:3000/internships/extractFields`,{
        documentText:formData.documentText
      },
     {
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    const extracted=res.data.extractedFields;
    setFormData((prev)=>({...prev, 
      companyName:extracted.company || prev.companyName,
      role:extracted.role || prev.role,
      department:extracted.department || prev.department,
      type:extracted.type || prev.type,
      startDate:extracted.startDate || prev.startDate,
      endDate:extracted.endDate || prev.endDate,
    }))
    toast.success("Fields auto-filled using AI")
    }catch{
      toast.error("AI extraction failed");
    }
  }

  return (
    <DashboardLayout>
      {/* PAGE HEADER */}
      <div className="page-header">
        <h1>
          <Link to="/student-dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <HiArrowLeft className="back-icon" style={{ fontSize: "15px" }} />
          </Link>
          Submit Internship
        </h1>
        <p>Add a new internship or training for verification</p>
      </div>

      {/* FORM CARD */}
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Internship Details</h2>

          {/* Document Text */}
        <div className="form-group">
          <label>Internship Description</label>
          <textarea
            name="documentText"
            placeholder="Describe your work, responsibilities, achievements..."
            value={formData.documentText}
            onChange={handleChange}
            required
          />
        </div>

        <button onClick={extractingFields} className="ai-btn">
          <HiSparkles />Extract Field using AI
          </button>

        {/* Company */}
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            placeholder="e.g. Google, Microsoft"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label>Role / Position</label>
          <input
            type="text"
            name="role"
            placeholder="e.g. Software Engineer Intern"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>

        {/* Department */}
        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Data Science">Data Science</option>
            <option value="AI/ML">AI/ML</option>
            <option value="IT">IT</option>
            <option value="Cyber">Cyber</option>
          </select>
        </div>

        {/* Type */}
        <div className="form-group">
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="internship">Internship</option>
            <option value="training">Training</option>
          </select>
        </div>

        {/* Dates */}
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Upload Certificate / Offer Letter</label>

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setDocumentFile(e.target.files[0]);
              }
            }}
            required
          />

          <small>PDF / JPG / PNG only (max 5MB)</small>
        </div>

        {errors.companyName && (
          <p className="error-text">{errors.companyName}</p>
        )}

        <button className="submit-btn" type="submit">
          Submit for Verification
        </button>
      </form>
    </DashboardLayout>
  );
};

export default StudentSubmit;
