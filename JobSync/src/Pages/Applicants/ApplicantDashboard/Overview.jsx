import React, { useState } from 'react';
import ApplicantsSidebar from '../../../components/applicantsidebar';
import AppliedJobsTable from '../../../components/JobTable';
import { FaBriefcase, FaBell, FaArrowRight, FaBars, FaBookmark } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import { Container, Row, Col, Card, Button, Offcanvas } from "react-bootstrap";

export default function Overview() {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
<Container className='container-lg' style={{ marginTop: '3rem' }}>
    <Row>
                {/* Sidebar (Large Screens) */}
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
                <Offcanvas 
                    show={showSidebar} 
                    onHide={() => setShowSidebar(false)} 
                    placement="start">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Applicant Dashboard</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ApplicantsSidebar />
                    </Offcanvas.Body>
                </Offcanvas>


        {/* Main Content */}
        <Col lg={9} className="p-4">
            <Row className="mb-4 g-3">
            {/* Applied Jobs Card */}
            <Col xs={12} sm={6} md={4}>
                <Card className="shadow-lg border-0 modern-card p-3 text-dark">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Text className="display-6 fw-bold">5</Card.Text>
                        <Card.Title className="h6 text-secondary mb-0">Applied Jobs</Card.Title>
                    </div>
                    <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle">
                        <FaBriefcase size={30} className="text-primary" />
                    </div>
                    </Card.Body>
                </Card>
            </Col>

            {/* Favorite Jobs Card */}
            <Col xs={12} sm={6} md={4}>
                <Card className="shadow-lg border-0 modern-card p-3 text-dark">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Text className="display-6 fw-bold">3</Card.Text>
                        <Card.Title className="h6 text-secondary mb-0">Favorite Jobs</Card.Title>
                    </div>
                    <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle">
                        <FaBookmark size={30} className="text-warning" />
                    </div>
                    </Card.Body>
                </Card>
            </Col>

            {/* Job Alerts Card */}
            <Col xs={12} sm={6} md={4}>
                <Card className="shadow-lg border-0 modern-card p-3 text-dark">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Text className="display-6 fw-bold">2</Card.Text>
                        <Card.Title className="h6 text-secondary mb-0">Job Alerts</Card.Title>
                    </div>
                    <div className="icon-wrapper d-flex align-items-center justify-content-center rounded-circle">
                        <FaBell size={30} className="text-success" />
                    </div>
                    </Card.Body>
                </Card>
                </Col>
            </Row>

            {/* Recently Applied Section */} 
            <Row className="mb-3">
                <Col className="d-flex justify-content-between align-items-center recently-applied">
                    <h3 className="fs-5 fw-semibold text-secondary recently">Recently Applied</h3>
                    <Button className="d-flex align-items-center text-primary border-0" style={{background: '#ddf2ff', height: '42px', fontSize: '12px'}}>
                        View All <FaArrowRight className="ms-2" style={{fontSize: '13px'}}/>
                    </Button>
                </Col>
            </Row>

            {/* Applied Jobs Table */}
            <Row>
                <Col className="table-responsive">
                    <AppliedJobsTable />
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
    .recently {
        font-size: 15px !important;
        margin-top: 19px !important
    }
    /* Sidebar - Hide on small screens */
@media (max-width: 991px) { 
    .applicant-sidebar {
        display: none; 
    }

    .mobile-sidebar-toggle {
        display: flex !important;
    }
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

@media (min-width: 992px) { 
    .mobile-sidebar-toggle {
        display: none !important;
    }
}

/* Cards - Stack on small screens */
@media (max-width: 768px) { 
    .dashboard-card {
        text-align: center;
    }

    .dashboard-card .bg-light {
        margin: 0 auto;
    }
}


/* Table - Make it scrollable on small screens */
@media (max-width: 1196px) { 
    .titles {
        font-size: 13px !important;
    }

}

@media (max-width: 768px) { 
    .recently {
        font-size: 16px !important;
    }
    .dashboard-card .bg-light{
        margin: 0 !important
    }
    h3, .fs-3 { 
        font-size: 1.2rem; /* Reduce heading size for tablets */
    }
    .fs-5 {
        font-size: 1rem;
    }
    
    .dashboard-card .bg-light { 
        padding: 5px; /* Adjust padding inside cards */
    }

    /* Icons - Shrink on smaller screens */
    .dashboard-card svg {
        width: 30px !important; 
        height: 30px !important;
    }

    /* Table - Reduce font size on mobile */
    .table-responsive td, .table-responsive th {
        font-size: 0.9rem;
    }
}

/* "Recently Applied" Header and Button */
@media (max-width: 576px) { 
    .titles {
        font-size: 17px !important;
    }
    h3, .fs-3 { 
        font-size: 1rem; /* Further reduce for mobile */
    }
    .fs-5 {
        font-size: 0.875rem;
    }

    /* Icons - Smaller for phones */
    .dashboard-card svg {
        width: 25px !important; 
        height: 25px !important;
    }
    .recently-applied {
        flex-direction: column;
        align-items: flex-start !important;
    }

    .recently-applied button {
        margin-top: 10px;
    }
}


    `}</style>
        </>
    );
}
