import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../vendor/jquery/jquery.min.js'; 
import * as sbAdmin from '../../js/sb-admin-2.js';
import '../../js/sb-admin-2.min.js';
 

const Sidebar = () => {
  
    const [collapseTwo, setCollapseTwo] = useState(false);
    const [collapseUtilities, setCollapseUtilities] = useState(false);
    const [collapsePages, setCollapsePages] = useState(false);

    useEffect(() => {
      // You can use jQuery and other scripts here if needed.
      console.log(sbAdmin.$);
    }, []);

    // Calculate the dropdown height dynamically based on its visibility
    const getCollapseStyle = (isOpen) => {
        return {
            maxHeight: isOpen ? '200px' : '0', // Adjust the max height to match the dropdown content
            padding: isOpen ? '10px 0' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, padding 0.3s ease',
            width: '200px', // Adjust the width of the dropdown here
        };
    };

    return (
        <>
            <style>
    {`
        /* Apply black color to all collapse items */
        .sidebar .collapse-item {
            color: black !important;  /* Ensures that all dropdown items are black */
            font-weight: normal !important; /* Remove bold text */
            text-align: left !important; /* Align the text to the left */
            padding-left: 20px; /* Optional: Add padding for better spacing */
        }

        .sidebar .collapse-item:hover {
            background-color: #f8f9fc;  /* Optional: adds a subtle background on hover */
            color: #333 !important; /* Optional: darkens text color on hover */
            text-decoration: none;
        }

        /* Adjust the width of the dropdown background */
        .sidebar .collapse-inner {
            width: 200px; /* Adjust the width here */
            margin: 0 auto;
        }
        h6 {
            margin-left: 20px;
            text-align: left;
            font-weight: bold;
            font-size: 14px;
        }
    `}
</style>

            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                {/* Sidebar - Brand */}
                <li className="sidebar-brand d-flex align-items-center justify-content-center">
                    <Link to="/" className="d-flex align-items-center">
                        <div className="sidebar-brand-icon">
                            <img 
                                src="/assets/logo3.png" 
                                alt="Brand Icon" 
                                style={{ width: '40px', height: 'auto', filter: 'brightness(0) invert(1)' }} 
                            />
                        </div>
                        <div className="sidebar-brand-text mx-3" style={{ color: 'white', whiteSpace: 'nowrap' }}>JobSync Admin</div>
                    </Link>
                </li>

                {/* Divider */}
                <hr className="sidebar-divider my-0" />

                {/* Nav Item - Dashboard */}
                <li className="nav-item active">
                    <Link className="nav-link" to="/admindashboard">
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>

                {/* Divider */}
                <hr className="sidebar-divider" />

                {/* Heading */}
                <div className="sidebar-heading">
                    Interface
                </div>

                {/* Nav Item - Components */}
                <li className="nav-item">
                    <button
                        className="nav-link collapsed d-flex justify-content-between"
                        onClick={() => setCollapseTwo(!collapseTwo)}
                        aria-expanded={collapseTwo ? "true" : "false"}
                    >
                        <span><i className="fas fa-fw fa-table"></i>User Tables</span>
                        <i className={`fas fa-chevron-${collapseTwo ? 'up' : 'down'}`}></i>
                    </button>
                    <div 
                        className={`bg-white collapse-inner rounded`} 
                        style={getCollapseStyle(collapseTwo)}
                    >
                        <h6 className="collapse-header" >USER TABLES</h6>
                        <div className="d-flex flex-column">
                            <Link className="collapse-item mb-1" to="/adminapplicants">Applicants</Link>
                            <Link className="collapse-item" to="/adminemployers">Representative</Link>
                        </div>
                    </div>
                </li>
                
                {/* Nav Item - Pages */}
                <li className="nav-item">
                    <button
                        className="nav-link collapsed d-flex justify-content-between"
                        onClick={() => setCollapsePages(!collapsePages)}
                        aria-expanded={collapsePages ? "true" : "false"}
                    >
                        <span><i className="fas fa-fw fa-briefcase"></i>Companies</span>
                        <i className={`fas fa-chevron-${collapsePages ? 'up' : 'down'}`}></i>
                    </button>
                    <div 
                        className={`bg-white collapse-inner rounded`} 
                        style={getCollapseStyle(collapsePages)}
                    >
                        <h6 className="collapse-header" style={{ textAlign: 'left' , marginLeft: '10px' }}>Companies Table</h6>
                        <div className="d-flex flex-column">
                            <Link className="collapse-item mb-2" to="/login">Companies</Link>
                        </div>
                        <div className="collapse-divider"></div>
                        <h6 className="collapse-header" style={{ textAlign: 'left' , marginLeft: '10px' }}>Jobs Table</h6>
                        <div className="d-flex flex-column">
                            <Link className="collapse-item" to="/404">Jobs</Link>
                        </div>
                    </div>
                </li>
                {/* Divider */}
                <hr className="sidebar-divider" />
                {/* Heading */}
                <div className="sidebar-heading">
                    Addons
                </div>
                {/* Nav Item - Utilities */}
                <li className="nav-item">
                    <button
                        className="nav-link collapsed d-flex justify-content-between"
                        onClick={() => setCollapseUtilities(!collapseUtilities)}
                        aria-expanded={collapseUtilities ? "true" : "false"}
                    >
                        <span><i className="fas fa-fw fa-wrench"></i> Customer Support</span>
                        <i className={`fas fa-chevron-${collapseUtilities ? 'up' : 'down'}`}></i>
                    </button>
                    <div 
                        className={`bg-white collapse-inner rounded`} 
                        style={getCollapseStyle(collapseUtilities)}
                    >
                        <h6 className="collapse-header">Customer Support</h6>
                        <div className="d-flex flex-column">
                            <Link className="collapse-item mb-1" to="/utilities-color">Email</Link>
                            <Link className="collapse-item" to="/utilities-border">Accounts</Link>
                        </div>
                    </div>
                </li>

                <hr className="sidebar-divider" />

                <div className="sidebar-heading">
                Settings
                </div>
                <li className="nav-item">
                    <Link className="nav-link" to="/tables">
                        <i className="fas fa-fw fa-cog"></i>
                        <span>Settings</span>
                    </Link>
                </li>
            </ul>
        </>
    );
};

export default Sidebar;
