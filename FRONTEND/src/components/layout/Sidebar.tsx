import StudentSidebar from "./sidebar/StudentSidebar";
import MentorSidebar from "./sidebar/MentorSidebar";
import AdminSidebar from "./sidebar/AdminSidebar";

const Sidebar = ({ role }: { role: string }) => {

  if (role === "student") {
    return <StudentSidebar />;
  }

  if (role === "mentor") {
    return <MentorSidebar />;
  }

  if (role === "admin") {
    return <AdminSidebar />;
  }

  return null;
};


export default Sidebar;
