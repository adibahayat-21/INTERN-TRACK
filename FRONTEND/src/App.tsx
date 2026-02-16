import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentDash from "./pages/student/StudentDash";
import MentorDash from "./pages/mentor/MentorDash";
import AdminDash   from "./pages/admin/AdminDash";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentSubmit from "./pages/student/StudentSubmit";
import MyInternship from "./pages/student/MyInternship";
import AssignMentor from "./pages/admin/AssignMentor";
import MentorAssigned from "./pages/admin/MentorAssigned";
import MentorNotAssigned from "./pages/admin/MentorNotAssigned";
import InternshipDetail from "./pages/mentor/InternshipDetail";
import VerifiedInternships from "./pages/mentor/VerifiedInternships";
import RejectedInternships from "./pages/mentor/RejectedInternships";
import PendingInternships from "./pages/mentor/PendingInternships";
import FullDetail from "./pages/student/FullDetail";
import PlagiarismDetail from "./pages/mentor/PlagiarismInternship";
import AuditLogs from "./pages/admin/AuditLogs";

const App=()=>{
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/student-dashboard" element={<ProtectedRoute allowedRole="student"><StudentDash/></ProtectedRoute>}/>
       <Route path="/student/submit" element={<ProtectedRoute allowedRole="student"><StudentSubmit/></ProtectedRoute>}/>
      <Route path="/student/internships" element={<ProtectedRoute allowedRole="student"><MyInternship/></ProtectedRoute>}/>
      <Route path="/mentor-dashboard" element={<ProtectedRoute allowedRole="mentor"><MentorDash/></ProtectedRoute>}/>
      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDash/></ProtectedRoute>}/>
      <Route path="/admin/assign-mentor/:internshipId" element={<ProtectedRoute allowedRole="admin"><AssignMentor/></ProtectedRoute>}/>
      <Route path="/admin/assign-mentor" element={<ProtectedRoute allowedRole="admin"><MentorAssigned/></ProtectedRoute>}/>
      <Route path="/admin/pending-assignment" element={<ProtectedRoute allowedRole="admin"><MentorNotAssigned/></ProtectedRoute>}/>
      <Route path="/internships/mentor/:internshipId" element={<ProtectedRoute allowedRole="mentor"><InternshipDetail/></ProtectedRoute>}/>
      <Route path="/mentor/verifiedInternships" element={<ProtectedRoute allowedRole="mentor"><VerifiedInternships/></ProtectedRoute>}/>
      <Route path="/mentor/rejectedInternships" element={<ProtectedRoute allowedRole="mentor"><RejectedInternships/></ProtectedRoute>}/>
      <Route path="/mentor/pendingInternships" element={<ProtectedRoute allowedRole="mentor"><PendingInternships/></ProtectedRoute>}/>
      <Route path="/student/fullDetail/:internshipId" element={<ProtectedRoute allowedRole="student"><FullDetail/></ProtectedRoute>}/>
      <Route path="/mentor/plagiarism/:internshipId" element={<ProtectedRoute allowedRole="mentor"><PlagiarismDetail/></ProtectedRoute>}/>
      <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRole="admin"><AuditLogs/></ProtectedRoute>}/>

    </Routes>
    <ToastContainer position="top-center" autoClose={3000}/>
    </>
  )
}
export default App
