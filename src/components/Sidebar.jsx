import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <button
        className="btn btn-dark d-lg-none"
        onClick={toggleSidebar}
        style={{ position: "fixed", top: "10px", left: "10px", zIndex: 1000 }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`d-flex flex-column bg-dark vh-100 p-3 text-white ${isCollapsed ? "d-none" : "d-block"} d-lg-block`}
        style={{ width: "250px", position: "fixed", top: 0, left: 0, zIndex: 999 }}
      >
        <h3 className="mb-4">Dashboard</h3>
        <Link to="/" className="btn btn-outline-light mb-2">
          📊 Stock Table
        </Link>
        <Link to="/chart" className="btn btn-outline-light">
          📈 Stock Chart
        </Link>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "250px", padding: "20px", zIndex: 1 }}>
       
      </div>
    </>
  );
};

export default Sidebar;