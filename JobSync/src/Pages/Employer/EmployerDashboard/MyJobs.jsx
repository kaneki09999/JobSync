import React, { useState, useEffect } from 'react';
import PostedJobTable from '../../../components/PostedJobTable';
import { useAuth } from '../../../AuthContext'; 
import { postToEndpoint } from '../../../components/apiService';
import { Container, Row, Col, Breadcrumb, Button, Offcanvas } from "react-bootstrap";
import EmployerSidebar from '../../../components/employersidebar';
import { FaBars } from "react-icons/fa";

export default function MyJobs() {
    const { user } = useAuth(); 
    const [jobs, setJobs] = useState([]); 
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await postToEndpoint('/countPostjobs.php', { employer_id: user.id });
                if (response.data?.jobs) {
                    setJobs(response.data.jobs);  
                } else {
                    console.error('No jobs found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
    
        fetchJobs();
    }, [user.id]); 

    return (
        <>
        <Container style={{marginTop: '3rem'}}>
        <Row>
          {/* Sidebar */}
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
                            <Offcanvas.Title>Employer Dashboard</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <EmployerSidebar />
                        </Offcanvas.Body>
                    </Offcanvas>
  
          {/* Main Content */}
          <Col lg={9} className="p-4">

            {/* Breadcrumb */}
            <Breadcrumb className="mb-3">
              <Breadcrumb.Item href="/employer/myjobs" style={{ textDecoration: "none", color: "#757575" }}>
                My Jobs
              </Breadcrumb.Item>
            </Breadcrumb>
  
            {/* Heading */}
            <h2
              className="mb-3 text-left"
              style={{
                fontSize: "20px",
                color: "#575757",
                fontWeight: "600",
                marginBottom: "20px",
                marginTop: "25px",
                textAlign: "left",
              }}
            >
              My Jobs {jobs.total_jobs > 0 ? `(${jobs.total_jobs})` : ""}
            </h2>
  
            {/* Job Table */}
            <PostedJobTable />
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
