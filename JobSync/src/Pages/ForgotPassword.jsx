import { useState } from "react";
import { Container, Row, Col, Button, Form, Card, Image } from 'react-bootstrap';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password for:", email);
  };

  return (
    <>
            <Container className="mt-5 paddings">
                    <Row >
                        <Col xs={12} lg={5}>
                        <Card className="shadow-lg p-4 mb-4 cards" style={{ borderRadius: "10px", marginTop: '8rem'}}>
                            <Card.Body>
                            <div className="text-center mb-4">
                                <img src="/assets/logo3-DvGSKCSt.png" alt="Logo" style={{ width: "130px" }} />
                            </div>
                            <h2 className="fw-bold text-center">Forgot Password</h2>
                            <p className="text-muted text-center mb-0">
                                Go back to <a href="/candidate_login" style={{ color: "#0A65CC" }}>Sign In</a>
                            </p>
                            <p className="text-muted text-center">
                                Don’t have an account? <a href="/registration" style={{ color: "#0A65CC" }}>Create account</a>
                            </p>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                <Form.Control
                                    type="email"
                                    placeholder="Email Address"
                                    className="register"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                </Form.Group>

                                <div className="d-grid">
                                <Button type="submit" variant="primary" className="btn-custom" style={{ backgroundColor: '#0A65CC' }}>
                                    Reset Password →
                                </Button>
                                </div>
                            </Form>
                            </Card.Body>
                        </Card>
                </Col>
                <Col xs={12} lg={7} className="d-none d-md-flex align-items-center justify-content-center">
                    <div className="position-relative w-100">
                        {/* Background Image */}
                        <Image
                        src="/assets/our-services.jpg"
                        alt="Registration Visual"
                        fluid
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        />

                        {/* Gradient Overlay */}
                        <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                            background: "linear-gradient(rgba(10, 22, 101, 0.4), rgba(0, 8, 42, 0.7))",
                            zIndex: 1,
                        }}
                        ></div>

                        {/* Image Credit Overlay */}
                        <div
                        className="position-absolute bottom-0 start-0 w-100 text-center"
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "#fff",
                            fontSize: "0.8rem",
                            padding: "0.5rem",
                            zIndex: 2,
                        }}
                        >
                        Image credit: <a href="https://callclickmedia.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f0f0f0", textDecoration: "underline" }}>Call Click Media</a>
                        </div>
                    </div>
                    </Col>
            </Row>
        </Container>
    <style>{`
  #root {
    width: 100%;
  }

  @media (max-width: 1398px) {
    .cards {
        margin-top: 5rem !important;
    }
  }
  @media (max-width: 1195px) {
    .cards {
        margin-top: 2rem !important;
    }
  }
  @media (max-width: 992px) {
    .cards {
        margin-top: 3rem !important;
    }
  }
  @media (max-width: 768px) {
    .cards {
        margin-top: 0rem !important;
    }
  }
  @media (max-width: 576px) {
    .paddings{
        margin-top: 8rem !important;
    }

  `}</style>
    </>
  );
}