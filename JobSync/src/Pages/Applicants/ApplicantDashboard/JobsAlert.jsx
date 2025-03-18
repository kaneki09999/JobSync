import React, { useState } from 'react';
import { Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import ApplicantsSidebar from '../../../components/applicantsidebar';
import JobAlers from '../../../components/JobAlertTable';
import { FaBars } from 'react-icons/fa';

export default function JobsAlert() {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
        <Container style={{marginTop: '3rem'}}>
            <Row>
                <Col lg={3} className="applicant-sidebar vh-100 p-3 d-none d-lg-block" style={{background: '#e6f3ff'}}>
                    <ApplicantsSidebar />
                </Col>
                {/* Sidebar Toggle Button (Small Screens) */}
                <Col xs={12} className="d-lg-none" style={{display: 'flex'}}>
                    <Button
                        variant="link"
                        onClick={() => setShowSidebar(true)}
                        style={{
                            position: "relative",
                            left: "0",
                            color: "#333", // Dark color
                            fontSize: "24px", // Bigger icon
                            padding: "5px"
                        }}
                    >
                        <FaBars />
                    </Button>
                </Col>


                {/* Offcanvas Sidebar (Small Screens) */}
                <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Applicant Dashboard</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ApplicantsSidebar />
                    </Offcanvas.Body>
                </Offcanvas>

                {/* Main Content */}
                <Col xs={12} md={9} lg={9} className="mt-4">
                    <h2 className="mb-3" style={{ fontSize: '17px', color: '#333', fontWeight: '500', marginLeft: '20px' }}>
                        Job Alerts 
                    </h2>
                    <JobAlers />
                </Col>
            </Row>
        </Container>
        <style>{`
        #root {
            width: 100% !important;
        }
        `}</style>
        </>
    );
}
