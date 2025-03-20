import React, { useState, useEffect } from 'react';
import PostedJobTable from '../../../components/PostedJobTable';
import { Container, Row, Col, Card, Button, Offcanvas } from "react-bootstrap";
import { FaBriefcase, FaUser, FaUsers, FaArrowRight, FaBars } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';
import { getFromEndpoint, postToEndpoint } from '../../../components/apiService';
import EmployerSidebar from '../../../components/employersidebar';

export default function EmployerOverview() {
    const { user } = useAuth(); 
    const [counts, setJobCounts] = useState([]);
      
    const [jobPostCount, setJobPostCount] = useState(0);

    useEffect(() => {
        if (user.id) {
                getFromEndpoint(`/get_open_jobs_count.php?employer_id=${user.id}`)
                .then(response => {
                    setJobPostCount(response.data.count);
                })
                .catch(error => {
                    console.error("Error fetching job post count:", error);
                });
        }
    }, [user.id]);

    
    const [showSidebar, setShowSidebar] = useState(false);
    const [savedCount, setSavedCount] = useState(0);
    const [applicationCount, setApplicationCount] = useState(0);

    useEffect(() => {
        if (user.id) {
                getFromEndpoint(`/get_saved_applicants_count.php?employer_id=${user.id}`)
                .then(response => {
                    setSavedCount(response.data.count);
                })
                .catch(error => {
                    console.error("Error fetching saved applicants count:", error);
                });
        }
    }, [user.id]);


    useEffect(() => {
        if (user.id) {
            getFromEndpoint(`/get_applications_count.php?employer_id=${user.id}`)
                .then(response => {
                    setApplicationCount(response.data.count);
                })
                .catch(error => {
                    console.error("Error fetching applications count:", error);
                });
        }
    }, [user.id]);

    return (
        <>
            <Container className='container-lg' style={{ marginTop: "3rem" }}>
                <Row className="mb-4">
                    <Col lg={3} className="applicant-sidebar vh-100 p-3 d-none d-lg-block" style={{background: '#e6f3ff'}}>
                        <EmployerSidebar />
                    </Col>
                    {/* Sidebar Toggle Button (Small Screens) */}
                    <Col xs={12} className="d-lg-none" style={{display: 'flex'}}>
                        <Button
                            variant="link"
                            onClick={() => setShowSidebar(true)}
                            style={{
                                position: "relative",
                                left: "0",
                                color: "#333", 
                                fontSize: "24px", 
                                padding: "5px"
                            }}
                        >
                            <FaBars />
                        </Button>
                    </Col>
                    {/* Offcanvas Sidebar (Small Screens) */}
                    <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Employer Dashboard</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <EmployerSidebar />
                        </Offcanvas.Body>
                    </Offcanvas>
                    <Col lg={9} className="p-4">
                        <Row className="mb-4 g-3">
                            {/* Open Jobs Card */}
                            <Col xs={12} sm={6} md={4}>
                                <Card className="modern-card shadow-lg border-0 p-3 text-dark">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <Card.Text className="display-6 fw-bold">{jobPostCount}</Card.Text>
                                            <Card.Title className="h6 text-secondary mb-0">Open Jobs</Card.Title>
                                        </div>
                                        <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle">
                                            <FaBriefcase size={30} className="text-primary" />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Saved Applicants Card */}
                            <Col xs={12} sm={6} md={4}>
                                <Card className="modern-card shadow-lg border-0 p-3 text-dark">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <Card.Text className="display-6 fw-bold">{savedCount}</Card.Text>
                                            <Card.Title className="h6 text-secondary mb-0">Saved Applicants</Card.Title>
                                        </div>
                                        <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle">
                                            <FaUser size={30} className="text-warning" />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* Messages Card */}
                            <Col xs={12} sm={6} md={4}>
                                <Card className="modern-card shadow-lg border-0 p-3 text-dark">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <Card.Text className="display-6 fw-bold">{applicationCount}</Card.Text>
                                            <Card.Title className="h6 text-secondary mb-0">Applications</Card.Title>
                                        </div>
                                        <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle">
                                            <FaUsers size={30} className="text-success" />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Recently Posted Jobs Section */}
                        <Row className="mb-3">
                            <Col className="d-flex justify-content-between align-items-center recently-applied">
                                <h3 className="fs-5 fw-semibold text-secondary recently">Recently Posted Jobs</h3>
                                <Button className="d-flex align-items-center text-primary border-0" style={{background: '#ddf2ff', height: '42px', fontSize: '12px'}}>
                                    View All <FaArrowRight className="ms-2" style={{fontSize: '13px'}}/>
                                </Button>
                            </Col>
                        </Row>

                        {/* Posted Jobs Table */}
                        <Row>
                            <Col className="table-responsive">
                                <PostedJobTable />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .offcanvas.show {
                    display: block !important;
                }
                #root {
                    width: 100%;
                }

                .modern-card {
                    background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
                    border-radius: 15px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .modern-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
                }

                .icon-wrapper {
                    background: #ffffff;
                    padding: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .recently-applied {
                    margin-top: 20px;
                    font-size: 16px;
                }

                @media (max-width: 768px) { 
                    .recently-applied {
                        font-size: 14px !important;
                    }

                    .recently-applied button {
                        font-size: 11px;
                    }
                }
            `}</style>
        </>
    );
}
