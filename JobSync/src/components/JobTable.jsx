import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import JobDetailsModal from "../components/jobdetailsmodal";
import Pagination from "../components/Pagination";
import { useAuth } from "../AuthContext";
import { postToEndpoint } from "../components/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faLocationDot, faPesoSign } from "@fortawesome/free-solid-svg-icons";
import { Container, Table, Badge, Button } from "react-bootstrap";
import jobsynclogo_style_3 from "../assets/logo3.png";

function AppliedJobsTable() {
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [applied, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState({ job_id: null, application_id: null });
    const { user } = useAuth();
    const [expandedRows, setExpandedRows] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedJob({ job_id: null, application_id: null });
    };

    const handleViewDetails = (job_id, application_id) => {
        setSelectedJob({ job_id, application_id });
        setShowModal(true);
    };

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                setLoading(true);
                const response = await postToEndpoint("/getAppliedJobs.php", { applicant_id: user.id });
                if (response.data && !response.data.error) {
                    setAppliedJobs(response.data);
                } else {
                    console.error("Error in response:", response.data.error);
                }
            } catch (error) {
                console.error("Error fetching applicant profiles:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAppliedJobs();
        }
    }, [user]);

    if (loading) {
        return <div id="preloader"></div>;
    }


    const toggleRow = (job_id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [job_id]: !prev[job_id],
        }));
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentJobs = applied.slice(startIndex, startIndex + itemsPerPage);
    const totalItems = applied.length;

    return (
        <>
            <Container className="container-fluid px-0 d-flex flex-column">
                <div className="flex-grow-1 table-responsive">
                    <Table className="table mb-0" responsive="md">
                        <thead className="thead-light">
                            <tr>
                                <th style={{ color: 'white', background: '#1863b9', fontWeight: '500', fontSize: '13px' }}>JOB</th>
                                {windowWidth > 992 && <th  style={{ color: 'white', background: '#1863b9', fontWeight: '500', fontSize: '13px' }}>DATE APPLIED</th>}
                                {windowWidth > 768 && <th style={{ color: 'white', background: '#1863b9', fontWeight: '500', fontSize: '13px' }}>STATUS</th>}
                                {windowWidth > 576 && <th style={{ color: 'white', background: '#1863b9', fontWeight: '500', fontSize: '13px' }}>ACTION</th>}
                            </tr>
                        </thead>
                        {/* <tfoot className="tfoot-light">
                            <tr>
                                <th style={{ color: '#676767', background: '#ebebebc2', fontWeight: '500', fontSize: '13px' }}>JOB</th>
                                {windowWidth > 992 && <th  style={{ color: '#676767', background: '#ebebebc2', fontWeight: '500', fontSize: '13px' }}>DATE APPLIED</th>}
                                {windowWidth > 768 && <th style={{ color: '#676767', background: '#ebebebc2', fontWeight: '500', fontSize: '13px' }}>STATUS</th>}
                                {windowWidth > 576 && <th style={{ color: '#676767', background: '#ebebebc2', fontWeight: '500', fontSize: '13px' }}>ACTION</th>}
                            </tr>
                        </tfoot> */}
                        <tbody>
                            {currentJobs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center p-4">
                                        <h5 className="text-muted">You have not applied for any jobs yet.</h5>
                                    </td>
                                </tr>
                            ) : (
                            currentJobs.map((appliedJob) => (
                                <React.Fragment key={appliedJob.job_id}>
                                    {/* Main Row */}
                                    <tr className="border-bottom">
                                    <td>
                                    <div className="d-flex align-items-center">
                                        <Button
                                            variant="light"
                                            className="btn-sm d-md-none"   
                                            onClick={() => toggleRow(appliedJob.job_id)}
                                        >
                                            <FontAwesomeIcon icon={expandedRows[appliedJob.job_id] ? faMinus : faPlus} />
                                        </Button>

                                        <img
                                              src={appliedJob.logo}
                                              alt="Job Logo"
                                              className="me-2"
                                              style={{ width: "50px" }}
                                              onError={(e) => {
                                                e.target.onerror = null; // Prevents looping if the default image fails too
                                                e.target.src = jobsynclogo_style_3; // Path to your default image
                                              }}
                                        />
                                        <div>
                                            <div className="d-flex align-items-center flex-wrap">
                                                <h6 className="mb-0" style={{ padding: '5px', color: '#373737' }}>{appliedJob.jobTitle}</h6>
                                                <span className="badge"
                                                    style={{
                                                        background: '#cde8ff',
                                                        padding: '7px 13px',
                                                        color: '#0076df',
                                                        fontWeight: '600',
                                                        borderRadius: '50px',
                                                        fontSize: '11px',
                                                        marginLeft: '7px'
                                                    }}
                                                >{appliedJob.jobType}</span>
                                            </div>
                                            <div className="d-flex align-items-center flex-wrap">
                                                <FontAwesomeIcon icon={faLocationDot} className="me-1" style={{ color: '#4198e5' }} />
                                                <small className="text-muted me-3">{appliedJob.city}</small>
                                                <FontAwesomeIcon icon={faPesoSign} className="me-1" style={{ color: '#9ea0a2' }} />
                                                <span className="text-muted" style={{ fontSize: '14px' }}>₱{appliedJob.minSalary} - ₱{appliedJob.maxSalary}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                        
                                        {windowWidth > 992 && (
                                        <td style={{ padding: '17px' }}>
                                            <span
                                                style={{
                                                    marginTop: '15px',
                                                    display: 'inline-block',
                                                    color: '#656565',
                                                    fontWeight: '600',
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {new Intl.DateTimeFormat('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                }).format(new Date(appliedJob.applied_at))}
                                            </span>
                                        </td>
                                        )}
                                        {windowWidth > 768 && (
                                        <td>
                                            <span className={`status-text ${appliedJob.status === "Active" ? "text-success" : "text-danger"}`}>
                                                {appliedJob.status}
                                            </span>
                                        </td>
                                        )}
                                        {windowWidth > 576 && (
                                        <td>
                                            <Button
                                                variant="light"
                                                className="btn-sm text-primary view-details-btn"
                                                onClick={() => handleViewDetails(appliedJob.job_id, appliedJob.application_id)}
                                            >
                                                View Details
                                            </Button>
                                        </td>
                                        )}
                                    </tr>

                                    {/* Expandable Row */}
                                    {expandedRows[appliedJob.job_id] && (
                                        <tr>
                                            <td colSpan="5" className="p-3" style={{textAlign: 'start'}}>
                                            <div className="d-md-none">
                                                {windowWidth <= 992 && (
                                                    <>
                                                        <strong>Date Applied:</strong>{" "}
                                                        {new Intl.DateTimeFormat("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        }).format(new Date(appliedJob.applied_at))}
                                                        <hr />
                                                    </>
                                                )}
                                                {windowWidth <= 768 && (
                                                    <>
                                                        <strong>Status:</strong>{" "}
                                                        <span
                                                        style={{
                                                            padding: '10px',
                                                            fontSize: '14px',
                                                            fontWeight: '700',
                                                            display: 'inline-block', 
                                                            marginTop: '5px',
                                                            textAlign: 'center', 
                                                        }}
                                                        className={appliedJob.status === "Active" ? "text-success" : "text-danger"}>{appliedJob.status}</span>
                                                        <hr />
                                                    </>
                                                )}
                                                {windowWidth <= 576 && (
                                                    <>
                                                        <Button variant="light" className="btn-sm text-primary" style={{
                                                                width: '73%',
                                                                fontWeight: '500',
                                                                marginTop: '5px',
                                                                background: '#ddf2ff',
                                                                padding: '10px',
                                                                borderRadius: '6px'
                                                            }} onClick={() => handleViewDetails(appliedJob.job_id, appliedJob.application_id)}>
                                                            View Details
                                                        </Button>
                                                        <hr />
                                                    </>
                                                )}
                                            </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                            )}
                            
                            
                        </tbody>
                    </Table>
                </div>

                <div className="d-flex justify-content-center py-3">
                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        paginate={(pageNumber) => setCurrentPage(pageNumber)}
                    />
                </div>

                <JobDetailsModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    job_id={selectedJob.job_id}
                    application_id={selectedJob.application_id}
                />
            </Container>

    <style>{`
    /* Table Header Styling */
    .table-header {
        color: #676767;
        background: #ebebebc2;
        font-weight: 500;
        font-size: 13px;
        white-space: nowrap;
    }
    /* Job Logo */
.job-logo {
    width: 50px;
    height: 50px;
}

/* Job Title */
.job-title {
    padding: 5px;
    color: #373737;
}

/* Job Type Badge */
.job-type-badge {
    background: #cde8ff !important;
    padding: 7px 13px;
    color: #0076df !important;
    font-weight: 600;
    border-radius: 50px;
    font-size: 11px;
    margin-left: 7px;
}

/* Icons */
.location-icon {
    color: #4198e5;
}

.salary-icon {
    color: #9ea0a2;
}

/* Salary Text */
.salary-text {
    font-size: 14px;
}

/* Date Applied */
.date-applied {
    margin-top: 15px;
    display: inline-block;
    color: #656565;
    font-weight: 600;
    font-size: 14px;
}

/* Status */
.status-text {
    padding: 10px;
    font-size: 14px;
    font-weight: 700;
    display: inline-block;
    margin-top: 5px;
    text-align: center;
}

/* View Details Button */
.view-details-btn {
    width: 100%;
    max-width: 150px;
    font-weight: 500;
    margin-top: 5px;
    background: #ddf2ff;
    padding: 10px;
    border-radius: 6px;
}

/* Responsive Styles */
@media (max-width: 768px) {
    .table-responsive {
        overflow-x: auto;
    }
    .job-logo {
        width: 40px;
        height: 40px;
    }
    .job-title {
        font-size: 14px;
    }

    .job-type-badge {
        font-size: 10px;
        padding: 5px 10px;
    }

    .salary-text {
        font-size: 13px;
    }

    .status-text {
        font-size: 12px;
    }

    .view-details-btn {
        font-size: 12px;
        padding: 8px;
    }
}

    `}</style>
    </>
    );
}

export default AppliedJobsTable;
