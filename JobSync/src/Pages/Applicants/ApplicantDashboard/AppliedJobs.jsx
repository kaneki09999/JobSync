import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Offcanvas } from "react-bootstrap";
import ApplicantsSidebar from '../../../components/applicantsidebar';
import AppliedJobsTable from '../../../components/JobTable';
import SearchBar2 from '../../../components/searchbar2';
import { FaBars } from 'react-icons/fa';
import { getFromEndpoint } from '../../../components/apiService';
import { useAuth } from '../../../AuthContext';

export default function AppliedJobs() {
    const { user } = useAuth();
    const [showSidebar, setShowSidebar] = useState(false);
    const [appliedCount, setAppliedCount] = useState(0);

    useEffect(() => {
        getFromEndpoint(`/get_applied_jobs_count.php?applicant_id=${user.id}`)
            .then(response => {
                setAppliedCount(response.data.count);
            })
            .catch(error => {
                console.error("Error fetching applied jobs count:", error);
            });
    }, [user.id]);
    
    return (
        <>
        <Container className='paddings' style={{marginTop: '3rem'}}>
            <Row>
                {/* Sidebar (Large Screens) */}
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
                <Col lg={9} className="p-4">
                    <SearchBar2 placeholder="Search applied jobs..." className="mb-3" />
                    
                    <h2 className="mb-3 text-muted" style={{ fontSize: '16px', fontWeight: '500', textAlign: 'start'}}>
                        Applied Jobs ({appliedCount})
                    </h2>
                    
                    <AppliedJobsTable />
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
    @media (max-width: 1399px) { 
        .paddings {
            margin-top: 6rem !important;
        }

@media (max-width: 991px) { 
    .paddings {
        margin-top: 1rem !important;
    }
    .applicant-sidebar {
        display: none; 
    }

    .mobile-sidebar-toggle {
        display: flex !important;
    }
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
    .paddings {
        margin-top: 4rem !important;
    }
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