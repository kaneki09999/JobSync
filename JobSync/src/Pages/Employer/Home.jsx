import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import JobAdSection from "../../components/jobsection";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  return (
    <Container className="mt-5">
      <Row className="align-items-center justify-content-between">
        {/* Left Content */}
        <Col xs={12} md={7} className="mb-4">
          {/* Greeting Section */}
          <Container fluid className="p-5 rounded bg-light text-dark position-relative overflow-hidden"
          style={{
            boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
          }}>
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "linear-gradient(135deg, rgba(0,123,255,0.1), rgba(0,123,255,0.2))" }}></div>
            <h2 className="fw-bold text-primary position-relative text-center">Hi, Christian</h2>
            <p className="text-muted position-relative text-center">
              You are in the right place to find your next hire. Get started by
              creating your first job ad.
            </p>
            <div className="text-center">
              <Button variant="primary" className="mt-3 px-4 py-2 shadow-sm">Create a Job Ad</Button>
            </div>
          </Container>

          {/* Boost Hiring Section */}
          <Container fluid className="p-5 mt-4 rounded bg-white position-relative overflow-hidden"
          style={{
            boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
          }}>
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "radial-gradient(circle, rgba(0,123,255,0.1), rgba(0,123,255,0.2))" }}></div>
            <Row className="align-items-center position-relative">
              <Col md={7} className="text-center">
                <h5 className="fw-bold text-dark">Boost Your Hiring</h5>
                <p className="text-muted">
                  When you post a job ad, we'll match you with relevant candidates
                  from our database.
                </p>
                <Button variant="outline-primary" className="mt-3 px-4 py-2 shadow-sm">Post a Job Ad</Button>
              </Col>
              <Col xs={12} md={5} className="text-center">
                <img
                  src="/src/assets/pic.png"
                  alt="Employer"
                  className="img-fluid rounded"
                  style={{
                    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
                  }}
                />
              </Col>
            </Row>
          </Container>
        </Col>

        {/* Right Image Section */}
        <Col xs={12} md={5} className="text-center position-relative">
          <img
            src="/src/assets/employer.jpg"
            alt="Employer"
            className="img-fluid rounded"
            style={{
              boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
            }}
          />
          <div className="position-absolute top-50 start-50 translate-middle bg-primary text-white p-3 rounded-circle shadow-lg" style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            🚀
          </div>
        </Col>
      </Row>

      {/* Hiring Made Easy Section */}
      <Container fluid className="p-5 mt-4 rounded bg-white position-relative overflow-hidden"
          style={{
            boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            background: "linear-gradient(135deg, rgba(0,123,255,0.1), rgba(0,123,255,0.2))"
          }}>
      <Row className="align-items-center justify-content-center text-center">
        <Col xs={12}>
          <h3 className="fw-bold text-primary">Hiring Made Easy</h3>
          <p className="text-muted">Post job ads, manage candidates, and find the best talent—all in one place.</p>
        </Col>
      </Row>
      <Row className="align-items-center justify-content-center">
        <Col md={6} className="text-center">
          <img
            src="/src/assets/hiring-process-removebg-preview.png"
            alt="Hiring Process"
            className="img-fluid rounded"
            style={{
              width: "100%",
              maxWidth: "700px",
              height: "auto",
              objectFit: "cover",
              
            }}
          />
        </Col>
        <Col md={5} className="text-center">
          <div className="d-flex flex-column align-items-center">
            <div className="p-4 bg-white rounded mb-3 w-100"
            style={{
              boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
            }}>
              <h5 className="fw-bold text-dark">Post Instantly</h5>
              <p className="text-muted">Create and publish job ads in minutes to reach a wide audience.</p>
            </div>
            <div className="p-4 bg-white rounded mb-3 w-100"
            style={{
              boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
            }}>
              <h5 className="fw-bold text-dark">Smart Matching</h5>
              <p className="text-muted">Get matched with relevant candidates based on job requirements.</p>
            </div>
            <div className="p-4 bg-white rounded w-100"
            style={{
              boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
            }}>
              <h5 className="fw-bold text-dark">Seamless Management</h5>
              <p className="text-muted">Track applications and communicate with candidates effortlessly.</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
    </Container>
  );
}

export default Home;
