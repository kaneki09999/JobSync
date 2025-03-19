import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaLayerGroup, FaBriefcase, FaBookmark, FaBell, FaCog } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";

function ApplicantsSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const buttonStyle = {
        color: "#838383",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
        padding: "10px 15px",
        borderRadius: "5px",
        width: "100%",
        textAlign: "left",
        background: "none",
        border: "none"
    };

    const activeStyle = {
        backgroundColor: "#9ecbff",
        color: "#0A65CC",
        fontWeight: "bold"
    };

    return (
        <div className="d-flex flex-column vh-100 p-3">
            <h2 className="text-muted mt-3 mb-4 text-center" style={{ fontSize: "18px" }}>
                Applicant Dashboard
            </h2>
            <Nav className="flex-column">
                {[
                    { path: "/applicants/overview", icon: <FaLayerGroup />, label: "Overview" },
                    { path: "/applicants/appliedjobs", icon: <FaBriefcase />, label: "Applied Jobs" },
                    { path: "/applicants/favoritejobs", icon: <FaBookmark />, label: "Favorite Jobs" },
                    { path: "/applicants/jobsalert", icon: <FaBell />, label: "Job Alerts" },
                    { path: "/applicants/applicantsettings", icon: <FaCog />, label: "Settings" }
                ].map(({ path, icon, label }) => (
                    <Nav.Link
                        key={path}
                        onClick={() => navigate(path)}
                        style={isActive(path) ? { ...buttonStyle, ...activeStyle } : buttonStyle}
                    >
                        {icon} {label}
                    </Nav.Link>
                ))}
            </Nav>
        </div>
    );
}

export default ApplicantsSidebar;
