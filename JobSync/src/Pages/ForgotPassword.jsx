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
                                <img src="/src/assets/logo3.png" alt="Logo" style={{ width: "130px" }} />
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
                        src="/src/assets/forgotpassword.png"
                        alt="Registration Visual"
                        fluid
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        />
                         {/* Overlay Text */}
                         <div className="position-absolute bottom-0 end-0 text-white text-center p-4">
                          <p>Image by <span style={{ color: '#1863b9' , fontWeight: 'bold' }}>Freepik</span></p>
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