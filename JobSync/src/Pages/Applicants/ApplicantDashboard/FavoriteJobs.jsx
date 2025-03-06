import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Offcanvas } from "react-bootstrap";
import ApplicantsSidebar from '../../../components/applicantsidebar';
import FavoriteJob from '../../../components/FavJobTable';
import { FaBars } from 'react-icons/fa';

export default function FavoriteJobs() {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
        <Container style={{marginTop: '3rem'}}>
            <Row>
            <Col lg={3} className="applicant-sidebar bg-light vh-100 p-3 d-none d-lg-block">
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
                <Col md={12} lg={9} className="mt-4">
                    <h2 className="fs-5 fw-medium text-dark mb-3 ms-3">
                        Favorite Jobs <span className="text-muted fs-6">(10)</span>
                    </h2>
                    <FavoriteJob />
                </Col>
            </Row>
        </Container>
        <style>{`
            #root {
                width: 100%;
            }
        `}</style>
        </>
    );
}
