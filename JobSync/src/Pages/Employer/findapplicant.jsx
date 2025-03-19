import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Row, Col, Container, Form, InputGroup, Offcanvas } from "react-bootstrap";
import FindApplicantTable from "../../components/findapplicanttable";

export default function FindApplicant() {
  const [jobSearch, setJobSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const exampleApplicants = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Applicant ${index + 1}`,
    skills: `Skill ${index + 1}`,
  }));

  const filteredApplicants = exampleApplicants.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(jobSearch.toLowerCase()) ||
      applicant.skills.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", jobSearch, locationSearch);
  };

  return (
<>
  <Container fluid style={{ marginTop: '6rem' }}>
    {/* Fixed Search Bar Section */}
    <div className="w-100 p-3 position-fixed top-0 start-0 end-0" 
         style={{ 
           background: 'linear-gradient(62deg, rgba(41,108,182,1) 0%, rgba(40,118,185,1) 51%, rgba(23,96,184,1) 98%)', 
           zIndex: '10',
           marginTop: '11.4rem'
         }}>
      <div className="w-100 d-flex justify-content-center">
        <div className="bg-white p-3 rounded-3 container-lg">
          <Form onSubmit={handleSearch}>
            <div className="d-flex flex-column flex-md-row">
              <div className="d-flex flex-column flex-md-row flex-grow-1">
                <InputGroup className="mb-2 mb-md-0 me-md-2 search-input">
                  <InputGroup.Text className="bg-transparent border-0 text-primary position-absolute" style={{zIndex: "5"}}>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control
                    style={{paddingLeft: '45px'}}
                    type="text"
                    placeholder="Applicant Name, Skills, or Job Title"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="border-0"
                  />
                </InputGroup>

                <InputGroup className="mb-2 mb-md-0 search-input">
                  <InputGroup.Text className="bg-transparent border-0 text-primary position-absolute" style={{zIndex: "5"}}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    style={{paddingLeft: '45px'}}
                    placeholder="City, state, or zip code"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="border-0"
                  />
                </InputGroup>
              </div>

              <Button 
                type="submit" 
                className="ms-md-2 mt-2 mt-md-0" 
                style={{ background: "#0a65cc", fontWeight: "500" }}
              >
                Find
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>

    {/* Spacer to push content below fixed search bar */}
    <div style={{ height: "100px" }}></div>

    {/* Main Content Section */}
    <Container className="mt-4 px-2 px-md-3 marginss">
      <Row>
        {/* Sidebar Button for Mobile */}
        <Col xs={12} className="mb-3 d-none">
          <Button 
            variant="primary" 
            onClick={() => setShowSidebar(true)}
            className="w-100"
          >
            Filters
          </Button>
        </Col>

        <Col md={4} lg={3} className="d-none d-md-block mb-3" style={{zIndex: "2"}}>
          <div className="border p-3 rounded shadow sticky-top" style={{ top: "1rem" }}>
            <h4>Gender</h4>
            <Form.Check type="radio" label="All" name="gender" defaultChecked />
            <Form.Check type="radio" label="Male" name="gender" />
            <Form.Check type="radio" label="Female" name="gender" />
          </div>
        </Col>
        {/* Main Content */}
        <Col md={8} lg={9}>
          <FindApplicantTable applicants={filteredApplicants} />
        </Col>
      </Row>
    </Container>

  </Container>

  <style>{`
    #root {
      width: 100%;
    }
    
    /* Make form controls and inputs have a visible border on mobile */
    @media (max-width: 767.98px) {
      .form-control {
        border: 1px solid #ced4da !important;
      }
      .marginss {
        margin-top: 10rem !important;
      }
      .search-input {
        width: 100% !important;
      }
      .input-group {
        border: none !important;
        background: white;
      }
    }
    
    /* Fix icon positioning */
    .input-group-text {
      left: 0;
      border: none !important;
    }
  `}</style>
</>
  );
}