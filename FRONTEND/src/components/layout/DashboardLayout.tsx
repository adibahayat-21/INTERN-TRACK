import Topbar from "././Topbar"
import "./layout.css";
import { useAuth } from "../../context/UseAuth";
import Sidebar from "./Sidebar";
type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const { role } = useAuth();

  return (
    <div className="dashboard-layout">
     <Sidebar role={role ??"student"}/>

      <div className="dashboard-main">
        <Topbar />

        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
