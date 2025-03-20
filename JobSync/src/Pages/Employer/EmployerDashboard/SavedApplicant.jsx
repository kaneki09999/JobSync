import React, { useState, useEffect } from 'react';
import SavedApplicantTable from '../../../components/SavedApplicantTable';
import EmployerSidebar from '../../../components/employersidebar';
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import { FaBars } from "react-icons/fa";
import axios from 'axios';
import { getFromEndpoint } from '../../../components/apiService';
import { useAuth } from '../../../AuthContext';

export default function SavedApplicant() {
    const { user } = useAuth();
    const [showSidebar, setShowSidebar] = useState(false);
    const [savedCount, setSavedCount] = useState(0);

    useEffect(() => {
        if (user?.id) {
            getFromEndpoint(`/get_saved_applicants_count.php?employer_id=${user?.id}`)
                .then(response => {
                    setSavedCount(response.data.count);
                })
                .catch(error => {
                    console.error("Error fetching saved applicants count:", error);
                });
        }
    }, [user?.id]);

    return (
        <Container style={{ marginTop: '3rem' }}>
            <Row className="d-flex">
                <Col lg={3} className="applicant-sidebar vh-100 p-3 d-none d-lg-block" style={{background: '#e6f3ff'}}>
                    <EmployerSidebar />
                </Col>

                {/* Sidebar Toggle Button (Small Screens) */}
                <Col xs={12} className="d-lg-none" style={{ display: 'flex' }}>
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
                        <h2 style={{
                            fontSize: '19px',
                            color: '#333',
                            fontWeight: '500',
                            marginBottom: '20px',
                            marginTop: '25px',
                            textAlign: 'left',
                            marginLeft: '15px'
                        }}>
                            Saved Applicants ({savedCount})
                        </h2>
                        <SavedApplicantTable />
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
