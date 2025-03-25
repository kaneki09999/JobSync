import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import React, { useState, useEffect } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../AuthContext';
import { postToEndpoint } from '../components/apiService';
import { Container, Row, Col, Button, Form, Image, Card, InputGroup } from "react-bootstrap";
import TermsAndConditions from '../components/termsandcondition';

function RegistrationForm() {
    const navigate = useNavigate();
    const { user } = useAuth(); 
    
    const [inputs, setInputs] = useState({
        type: 'applicant',
        firstname: '',
        lastname: '',
        gender: '',
        contact: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [passwordError, setPasswordError] = useState(''); 
    const [nameError, setNameError] = useState({ firstname: '', lastname: '' });
    const [showErrors, setShowErrors] = useState(false); 
    const [formCompleted, setFormCompleted] = useState(false);
    const [contactError, setContactError] = useState(''); 


  
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAgreeModal = () => {
        setIsAgreed(true);  // Automatically check the checkbox when "Agree" is clicked
        setShowModal(false);  // Close the modal after agreeing
      };

    useEffect(() => {
        if (user) {
            navigate('/applicants/overview');
        }
    }, [user, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(values => ({ ...values, [name]: value }));
    
        if (name === 'firstname' || name === 'lastname') {
            setNameError(prevErrors => ({ ...prevErrors, [name]: '' }));
            const nameRegex = /^[A-Za-z\s]*$/;
            if (!nameRegex.test(value) && value !== '') {
                setNameError(prevErrors => ({ ...prevErrors, [name]: "Name cannot contain numbers." }));
            }
            if (value.length < 2) {
                setNameError(prevErrors => ({ ...prevErrors, [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 2 characters.` }));
            }
        }
        
        if (name === 'password') {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            setPasswordError(passwordRegex.test(value) ? '' : "Password must be at least 8 characters, one uppercase, lowercase, numbers, and a special character.");
        }
    
        if (name === 'confirmPassword') {
            setErrorMessage(value !== inputs.password ? "Passwords do not match." : '');
        }
    
        if (name === 'contact') {
            const contactRegex = /^[1-9]\d{0,9}$/;
            if (value.length === 10) {
                setContactError('');
            } else if (!contactRegex.test(value) && value !== '') {
                setContactError("Contact number must be 10 digits long and cannot start with 0");
            } else {
                setContactError('');
            }
        }
    };
    
    

    const validateNames = () => {
        const nameRegex = /^([A-Z][a-zA-Z]*(\s[A-Z][a-zA-Z]*)?)$/;
        let errors = { firstname: '', lastname: '' };
    
        if (inputs.firstname.length < 2) {
            errors.firstname = "Must be at least 2 characters.";
        }
        if (inputs.lastname.length < 2) {
            errors.lastname = "Must be at least 2 characters.";
        }
    
        if (!nameRegex.test(inputs.firstname || '')) {
            errors.firstname = "Must start with a capital letter.";
        }
        if (!nameRegex.test(inputs.lastname || '')) {
            errors.lastname = "Must start with a capital letter.";
        }
    
        setNameError(errors);
        return errors.firstname === '' && errors.lastname === '';
    };
    
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setShowErrors(true);

        if (!validateNames() || inputs.password !== inputs.confirmPassword || passwordError) {
            setErrorMessage(inputs.password !== inputs.confirmPassword ? "Passwords do not match." : '');
            return;
        }
    
        setIsLoading(true);
        setErrorMessage('');
    
        postToEndpoint('/index.php', inputs)
            .then(response => {
                setIsLoading(false);
                if (response.data.status === 1) { 
                    navigate('/email_verification', { state: { email: inputs.email, formType: inputs.type } });
                } else {
                    alert(response.data.message || "Registration failed. Please try again.");
                }
            })
            .catch(error => {
                setIsLoading(false);
                alert("An error occurred while submitting the form. Please try again.");
            });
    };
    const [formType, setFormType] = useState('candidate');
    const [isAgreed, setIsAgreed] = useState(false);

    useEffect(() => {
        const requiredFieldsFilled = inputs.firstname && inputs.lastname && inputs.gender && inputs.contact && inputs.email && inputs.password && inputs.confirmPassword;
        setFormCompleted(requiredFieldsFilled && isAgreed);
    }, [inputs, isAgreed]);

    const renderFormFields = () => (
        <>
            <input type="hidden" id="type" name="type" value={inputs.type} />

            {/* First Name & Middle Name */}
            <Row className="mb-3 no-margin-bot">
                <Col xs={12} md={6}>
                    <Form.Control 
                        type="text" 
                        className={`register ${showErrors && nameError.firstname ? "is-invalid" : ""}`} 
                        placeholder="First Name *" 
                        name="firstname" 
                        onChange={handleChange} 
                        onKeyDown={(e) => {
                            if (/[^A-Za-z\s]/.test(e.key) && e.key !== "Backspace") e.preventDefault();
                        }} 
                        required 
                    />
                    {showErrors && nameError.firstname && (
                        <div className="text-danger mt-1 small">{nameError.firstname}</div>
                    )}
                </Col>
                <Col xs={12} md={6}>
                    <Form.Control 
                        type="text" 
                        className="register" 
                        placeholder="Middle Name (Optional)" 
                        name="middlename" 
                        onChange={handleChange} 
                        onKeyDown={(e) => {
                            if (/[^A-Za-z\s]/.test(e.key) && e.key !== "Backspace") e.preventDefault();
                        }} 
                    />
                </Col>
            </Row>

            {/* Last Name & Suffix */}
            <Row className="mb-3 no-margin-bot">
                <Col xs={12} md={6}>
                    <Form.Control 
                        type="text" 
                        className={`register ${showErrors && nameError.lastname ? "is-invalid" : ""}`} 
                        placeholder="Last Name *" 
                        name="lastname" 
                        onChange={handleChange} 
                        onKeyDown={(e) => {
                            if (/[^A-Za-z\s]/.test(e.key) && e.key !== "Backspace") e.preventDefault();
                        }} 
                        required 
                    />
                    {showErrors && nameError.lastname && (
                        <div className="text-danger mt-1 small">{nameError.lastname}</div>
                    )}
                </Col>
                <Col xs={12} md={6}>
                    <Form.Control 
                        type="text" 
                        className="register" 
                        placeholder="Suffix (Optional)" 
                        name="suffix" 
                        onChange={handleChange} 
                        onKeyDown={(e) => {
                            if (/[^A-Za-z\s]/.test(e.key) && e.key !== "Backspace") e.preventDefault();
                        }} 
                    />
                </Col>
            </Row>

            {/* Gender & Contact Number */}
            <Row className="mb-3 no-margin-bot">
                <Col xs={12} md={6}>
                    <Form.Select 
                        className="register" 
                        name="gender" 
                        onChange={handleChange} 
                        required 
                        value={inputs.gender || ""}
                    >
                        <option value="" disabled>Select Gender *</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Form.Select>
                </Col>
                <Col xs={12} md={6}>
                    <InputGroup className='extension' style={{width: '100%'}}>
                        <InputGroup.Text className="text-black extension" style={{height: '50px', background: '#e6e6e6'}}>+63</InputGroup.Text>
                        <Form.Control 
                            type="text" 
                            className={`register3 ${contactError ? "is-invalid" : ""}`} 
                            placeholder="Contact Number *" 
                            name="contact" 
                            onChange={handleChange} 
                            onKeyDown={(e) => {
                                if (inputs.contact.length === 0 && e.key === "0") e.preventDefault();
                                if (!/[0-9]/.test(e.key) && e.key !== "Backspace") e.preventDefault();
                            }} 
                            style={{marginLeft: '57px'}}
                            maxLength={10} 
                            required 
                        />
                    </InputGroup>
                    {contactError && (
                        <div className="text-danger mt-1 small text-end">{contactError}</div>
                    )}
                </Col>
            </Row>

            {/* Email */}
            <Form.Group className="mb-3 no-margin-bot">
                <Form.Control 
                    type="email" 
                    className="register" 
                    placeholder="Email *" 
                    name="email" 
                    onChange={handleChange} 
                    required 
                />
            </Form.Group>

            {/* Password & Confirm Password */}
            <Form.Group className="mb-3 no-margin-bot">
                <Form.Control 
                    type="password" 
                    className={`register ${passwordError ? "is-invalid" : ""}`} 
                    placeholder="Password *" 
                    name="password" 
                    onChange={handleChange} 
                    required 
                />
                {passwordError && (
                    <div className="text-danger mt-1 small">{passwordError}</div>
                )}
            </Form.Group>
            <Form.Group className="mb-3 no-margin-bot">
                <Form.Control 
                    type="password" 
                    className={`register ${errorMessage ? "is-invalid" : ""}`} 
                    placeholder="Confirm Password *" 
                    name="confirmPassword" 
                    onChange={handleChange} 
                    required 
                />
                {errorMessage && (
                    <div className="text-danger mt-1 small">{errorMessage}</div>
                )}
            </Form.Group>

             {/* Terms Agreement */}
      <Form.Group className="mb-3 no-margin-bot d-flex align-items-center">
        <Form.Check 
          type="checkbox" 
          checked={isAgreed} 
          onChange={() => {}}
          disabled={isAgreed}  // Disable the checkbox once agreed
        />
        <div>
          <Form.Label className="ms-2">
            I've read and agreed with{' '}
            <a href="#!" onClick={handleShowModal}>Terms and Conditions</a>
          </Form.Label>
          <TermsAndConditions 
            show={showModal} 
            onClose={handleCloseModal} 
            onAgree={handleAgreeModal} // Pass the agree handler to the modal
          />
        </div>
      </Form.Group>

            {/* Submit Button with Loader */}
            <div className="d-flex justify-content-center position-relative">
                {isLoading ? (
                    <div 
                        className="loader" 
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                ) : null}
                <Button 
                    type="submit" 
                    className="btn-custom w-100" 
                    style={{ maxWidth: "700px", marginTop: "20px" }} 
                    disabled={!formCompleted || isLoading}
                >
                    Create Account <FontAwesomeIcon icon={faArrowRight} />
                </Button>
            </div>
        </>
    );

    return (
        <>
        <Container className="mt-5 paddings">
        <Row>
        <Col xs={12} lg={5}>
                    <h3 className="mb-3 text-start">Create Account</h3>
                    <h4 className="mb-4 text-start" style={{ fontSize: '15px' }}>Already have an account? <Link to="/candidate_login" style={{ textDecoration: 'none', color: '#0A65CC' }}>Log In</Link>
                    </h4>
                    

                    <Form onSubmit={handleSubmit}>
                        {renderFormFields()}
                    </Form>
                </Col>
            {/* Right Section - Image Display */}
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
        /* Card Responsiveness */
        .paddings {

        }
        .btn5 {
            maxWidth: 270px;
        }
        .card {
            width: 100%;
            max-width: 100%;
            border-radius: 10px;
            background-color: #F1F2F4;
            padding: 1rem;
        }

        /* Buttons */
        .button-custom {
            width: 100%;
            max-width: 100%;
            transition: all 0.3s ease-in-out;
        }

        /* Form Inputs */
        .form-control {
            width: 100%;
        }

        /* Image Section */
        .image-container {
            position: relative;
            width: 100%;
        }

        .image-container img {
            width: 100%;
            height: auto;
            object-fit: cover;
        }

        /* Responsive Design */
        @media (max-width: 1390px) {
            .resp {
                width: 193px !important;
            }
        }

        @media (max-width: 1195px) {
            .resp {
                width: 153px !important;
            }
        }

        @media (max-width: 992px) {
            .resp {
                width: 255px !important;
            }
        }

        @media (max-width: 768px) {
            .no-margin-bot {
                margin-bottom: 0 !important
            }
            .register {
                margin-bottom: 1rem !important;
            }
            .extension {
                margin-bottom: 1rem !important;
            }
            .resp {
                width: 225px !important;
            }
            .container {
                margin-top: 8rerm !important;
            }
            
            .row {
                flex-direction: column;
            }

            .col-md-6 {
                width: 100%;
                text-align: center;
            }

            .card {
                max-width: 100%;
            }

            .button-custom {
                max-width: 100%;
            }

            .image-container {
                display: none;
            }
        }

        @media (max-width: 576px) {
            .paddings{
                padding: 0 25px !important;     
                margin-top: 8rem !important;
            }
            .btn5 {
                width: 100% !important;
            }
            .container {
                margin-top: 1rem;
                padding: 0.5rem;
            }
            
            h3, h4, h5 {
                font-size: 1rem;
            }

            .button-custom {
                font-size: 0.9rem;
            }
        }
        `}</style>
        </>
    );
}

export default RegistrationForm;
