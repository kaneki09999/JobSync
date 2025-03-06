import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { postToEndpoint } from '../components/apiService';
import '../css/Specific.css';
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";

function EmailVerification() {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, formType } = location.state || {};
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); 
    

    const handleVerify = (event) => {
        event.preventDefault();
        setLoading(true);
    
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('verification_code', verificationCode);
        formData.append('formType', formType);
    
        postToEndpoint('/verify_code.php', formData) 
            .then(response => {
                setLoading(false);
                setMessage(response.data.message);
                if (response.data.status === 1) {
                    setError(false);
                    setErrorMessage('');
                    Swal.fire({
                        icon: 'success',
                        title: 'Email Verified!',
                        text: 'Your email has been successfully verified.',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        navigate('/');
                    });
                } else {
                    setError(true);
                    setErrorMessage(response.data.message);
                }
            })
            .catch(() => {
                setLoading(false);
                setError(true);
                setErrorMessage("Verification failed. Please try again.");
            });
    };

    const handleInputChange = (e) => {
        setVerificationCode(e.target.value);
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    };

    if (!email) {
        return (
            <>
        <div className="d-flex justify-content-center align-items-center" style={{ marginBottom: '6.5rem', padding: 0 }}>
            <div className="container" style={{ maxWidth: '100%', margin: 0, padding: 0 }}>
                <h3 className="text-center" style={{ marginTop: 0 }}>Email not provided!</h3>
                <p className="text-center" style={{ marginTop: 0, color: '#a6a6a6'}}>
                        The email address was not provided
                </p>
                <form style={{ margin: 0, padding: 0 }}>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="verification_code"
                            className={`form-control ${error ? 'is-invalid' : ''}`}
                            style={{ height: '50px', borderRadius: '10px', textAlign: 'center', fontSize: 'x-large', letterSpacing: '7px' }}
                            placeholder="xxxxxx"
                            value={verificationCode}
                            onChange={handleInputChange}
                            maxLength={6}
                            disabled
                        />
                        {error && <div className="invalid-feedback">{errorMessage}</div>}
                    </div>
                    <Link to="/">
                    <button type="btn" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                            <span>
                                Go back home
                            </span>
                    </button>
                    </Link>
                </form>
            </div>
        </div>
            </>
        );
    }

    return (
        <Container className="d-flex justify-content-center align-items-center">
        <Row className="w-100">
            <Col xs={12} md={{ span: 6, offset: 3 }}>
                <div className="text-center">
                    <h3>Email Verification</h3>
                    <p>
                        We’ve sent a verification email to <b>{email}</b> to verify your email address and activate your account.
                    </p>
                </div>
                <Form onSubmit={handleVerify}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="verification_code"
                            className={`text-center fs-4 ${error ? "is-invalid" : ""}`}
                            style={{ height: "50px", borderRadius: "10px", letterSpacing: "7px" }}
                            placeholder="xxxxxx"
                            value={verificationCode}
                            onChange={handleInputChange}
                            maxLength={6}
                            required
                        />
                        {error && <div className="invalid-feedback text-center">{errorMessage}</div>}
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100 py-2" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Verify my Account <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                            </>
                        )}
                    </Button>
                </Form>

                <p className="mt-3 text-center">
                    Didn't receive any code?{" "}
                    <Link to="/path-to-resend-page" className="text-primary">
                        Resend
                    </Link>
                </p>
            </Col>
        </Row>
    </Container>
    );
}

export default EmailVerification;
