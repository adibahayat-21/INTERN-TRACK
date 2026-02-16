import { useEffect, useState } from "react";
import axios from "axios";
import "./auditlogs.css";
import { NavLink } from "react-router-dom";

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  // 🔹 Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (!token) {
          setError("Admin not authenticated");
          return;
        }

        setLoading(true);

        const res = await axios.get(
          `http://localhost:3000/admin/audit-logs?page=${currentPage}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        setLogs(res.data.data);
        setTotalPages(res.data.pagination.totalPages);

      } catch (err) {
        console.error(err);
        setError("Failed to fetch audit logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token, currentPage]);

  // 🔹 Badge color mapping
  const getActionClass = (action: string) => {
    switch (action) {
      case "VERIFY_INTERNSHIP":
        return "badge-verify";
      case "REJECT_INTERNSHIP":
        return "badge-reject";
      case "ASSIGN_MENTOR":
        return "badge-assign";
      default:
        return "badge-default";
    }
  };

  // 🔹 Format action text
  const formatAction = (action: string) => {
    return action.replaceAll("_", " ");
  };

  // 🔹 Filter logic
  const filteredLogs =
    selectedAction === "ALL"
      ? logs
      : logs.filter((log) => log.action === selectedAction);

  // 🔹 Loading state
  if (loading) {
    return <div>Loading audit logs...</div>;
  }

  // 🔹 Error state
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="audit-container">
      {/* 🔹 Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className="back-wrapper">
          <NavLink to="/admin-dashboard" className="back-button">
            ← Back to Dashboard
          </NavLink>
        </div>

        <h1>System Audit Logs</h1>
      </div>

      {/* 🔹 Filter + Count */}
      <div className="filter-wrapper">
        <p className="log-count">
          Showing {filteredLogs.length} logs
        </p>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Actions</option>
          <option value="ASSIGN_MENTOR">Assign Mentor</option>
          <option value="VERIFY_INTERNSHIP">Verify Internship</option>
          <option value="REJECT_INTERNSHIP">Reject Internship</option>
        </select>
      </div>

      {/* 🔹 Empty state */}
      {filteredLogs.length === 0 && !loading && (
        <p>No audit logs found.</p>
      )}

      {/* 🔹 Table */}
      <table className="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>Performed By</th>
            <th>Internship</th>
            <th>Student</th>
            <th>Internship's Department</th>
          </tr>
        </thead>

        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log._id}>
              <td>
                {new Date(log.createdAt).toLocaleString()}
              </td>

              <td>
                <span
                  className={`action-badge ${getActionClass(log.action)}`}
                >
                  {formatAction(log.action)}
                </span>
              </td>

              <td>
                {log.performedBy?.name} ({log.performedBy?.role})
              </td>

              <td>{log.targetInternship?.company}</td>

              <td>{log.targetInternship?.student?.name}</td>

              <td>{log.targetInternship?.department}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-wrapper">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ← Prev
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next →
        </button>
      </div>

    </div>
  );
};

export default AuditLogs;
