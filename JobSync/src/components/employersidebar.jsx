import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaLayerGroup, FaUser, FaPlusSquare, FaBriefcase, FaEnvelope, FaBookmark, FaCog } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";

function EmployerSidebar() {
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
        backgroundColor: "#E5F1FF",
        color: "#0A65CC",
        fontWeight: "bold"
    };

    return (
        <div className="d-flex flex-column bg-light vh-100 p-3">
            <h2 className="text-muted mt-3 mb-4 text-center" style={{ fontSize: "18px" }}>
                Employer Dashboard
            </h2>
            <Nav className="flex-column">
                {[
                    { path: "/employer/overview", icon: <FaLayerGroup />, label: "Overview" },
                    { path: "/employer/postjob", icon: <FaPlusSquare />, label: "Post a Job" },
                    { path: "/employer/myjobs", icon: <FaBriefcase />, label: "My Jobs" },
                    // { path: "/employer/employermessage", icon: <FaEnvelope />, label: "Messages" },
                    { path: "/employer/savedapplicant", icon: <FaBookmark />, label: "Saved Applicants" },
                    { path: "/employer/settings", icon: <FaCog />, label: "Settings" }
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

export default EmployerSidebar;