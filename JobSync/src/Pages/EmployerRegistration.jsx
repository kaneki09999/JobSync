import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Webcam from 'react-webcam';
import React, { useState, useEffect, useRef } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUser, faBuilding, faArrowLeft, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../AuthContext';
import Swal from 'sweetalert2';
import { postToEndpoint } from '../components/apiService';
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Form } from 'react-bootstrap';
import EmployerTermsAndConditions from '../components/empterms&conditions';


export default function EmployerRegistrationForm() {
    const [formType, setFormType] = useState('employer');
    const [isAgreed, setIsAgreed] = useState(false);
    const [step, setStep] = useState(1); 
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [suffix, setSuffix] = useState('');
    const [position, setPosition] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); 
    const { user } = useAuth(); 

    const [dtiCertificate, setDtiCertificate] = useState(null);
    const [birCertificate, setBirCertificate] = useState(null);
    const [businessPermit, setBusinessPermit] = useState(null);

    const [dtiPreview, setDtiPreview] = useState(null);
    const [birPreview, setBirPreview] = useState(null);
    const [permitPreview, setPermitPreview] = useState(null);

    const [showModal, setShowModal] = useState(false);


    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    
    const handleFileUpload = (e, setFile, setPreview) => {
        const file = e.target.files[0];
        setFile(file);

        if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    


    const isStep3Valid = () => {
        return dtiCertificate && birCertificate && businessPermit;
    };
    
    const isStep4Valid = () => {
        return (
            email.trim() !== '' &&
            password.trim() !== '' &&
            confirmPassword.trim() !== '' &&
            password === confirmPassword
        );
    };

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [positionError, setPositionError] = useState('');
    const [contactError, setContactError] = useState('');
    const [showValidation, setShowValidation] = useState(false); 

    const handleContactChange = (e) => {
        const value = e.target.value;
        setContactError('');

        if (value.length <= 10 && /^[0-9]*$/.test(value)) {
            setContactNumber(value);
        }

        if (value.length === 10) {
            if (!contactRegex.test(value)) {
                setContactError("Contact number must be 10 digits long and cannot start with 0");
            } else {
                setContactError(''); 
            }
        } else if (value.length > 10) {
            setContactError("Contact number cannot exceed 10 digits");
        } else if (value.length < 10) {
            setContactError("Contact number must be exactly 10 digits");
        }
    };

    const validateFirstName = () => {
        if (firstName.trim() === '' || firstName.length <= 1) {
            setFirstNameError('Must be at least 2 characters long');
            return false;
        } else if (firstName.charAt(0) !== firstName.charAt(0).toUpperCase()) {
            setFirstNameError('Must start with an uppercase letter');
            return false;
        } else {
            setFirstNameError('');
            return true;
        }
    };

    const validateLastName = () => {
        if (lastName.trim() === '' || lastName.length <= 1) {
            setLastNameError('Must be at least 2 characters long');
            return false;
        } else if (lastName.charAt(0) !== lastName.charAt(0).toUpperCase()) {
            setLastNameError('Must start with an uppercase letter');
            return false;
        } else {
            setLastNameError('');
            return true;
        }
    };

    const validatePosition = () => {
        if (position.trim() === '' || position.length <= 1) {
            setPositionError('Position must be at least 2 characters.');
            return false;
        } else if (position.charAt(0) !== position.charAt(0).toUpperCase()) {
            setPositionError('Position name must start with an uppercase letter.');
            return false;
        } else {
            setPositionError('');
            return true;
        }
    };

    const handleTextInput = (e) => {
        if (/[^a-zA-Z-]/.test(e.key)) {
            e.preventDefault();
        }
    };
    
    
    const handleNext = (e) => {
        e.preventDefault();
        
        setShowValidation(true);

        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isPositionValid = validatePosition();
        const isContactValid = !contactError && contactNumber.length === 10;

        if (!isFirstNameValid || !isLastNameValid || !isPositionValid || !isContactValid) {
            return; 
        }

        if (firstName.trim() !== '' && lastName.trim() !== '' && position.trim() !== '' && contactNumber.trim() !== '') {
            setStep(2); 
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill out all required fields.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    

    useEffect(() => {
        if (user) {
            navigate('/employer/dashboard');
        }
    }, [user, navigate]);

    const isFirstStepValid = () => {
        return firstName.trim() !== '' && 
               lastName.trim() !== '' && 
               position.trim() !== '' && 
               contactNumber.trim() !== '';
    };

    const handleBack1 = () => {
        setStep(1); 
    };
    const handleBack2 = () => {
        setStep(2); 
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
    
        const dtiBase64 = await convertToBase64(dtiCertificate); 
        const birBase64 = await convertToBase64(birCertificate); 
        const permitBase64 = await convertToBase64(businessPermit);
    
        const payload = {
            dti_certificate: dtiBase64,
            bir_certificate: birBase64,
            business_permit: permitBase64,
            firstName,
            middleName,
            lastName,
            suffix,
            position,
            contactNumber,
            email,
            password,
            type: 'employer'
        };
    
        try {
            const response = await postToEndpoint('/employer.php', payload, {
                'Content-Type': 'application/json'
            });
    
            if (response.data.decision) {
                if (response.data.decision === 'accept') {
                    await Swal.fire({
                        title: 'Verified!',
                        text: "Your ID has been successfully verified.",
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000,             
                        timerProgressBar: true,   
                        allowOutsideClick: false, 
                        allowEscapeKey: false     
                    });
                    navigate('/email_verification', { state: { email, formType } });
                } else if (response.data.decision === 'reject') {
                    await Swal.fire({
                        title: 'Rejected!',
                        text: "Your ID verification has been rejected.",
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } else if (response.data.error) {
                let warningText = "";
            
                if (response.data.warnings && response.data.warnings.length > 0) {
                    warningText = `<strong style="color: #f27474; font-weight: 500;">Reasons:</strong><br>`;
                    warningText += `<div style="font-size: 0.9em; margin-top: 5px;">`;
                    warningText += response.data.warnings.map((warning, index) => `${index + 1}. ${warning}`).join('<br>');
                    warningText += `</div>`;
                }
            
                await Swal.fire({
                    title: 'Rejected!',
                    html: `Your ID verification has been rejected.<br>${warningText}`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false
                });
            } else {
                await Swal.fire({
                    title: 'Unexpected Response',
                    text: "Unexpected response from the server.",
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
            }
    
        } catch (error) {
            console.error("Error:", error);
            await Swal.fire({
                title: 'Error!',
                text: "Error verifying ID.",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsLoading(false);
        }
        console.log(payload);
    };
    
    
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const renderFormFieldsStep2 = () => (

        <>
        <Row className="mb-3" style={{textAlign: 'start'}}>
          {/* DTI Certificate */}
            <div className="mb-3">
              <label className="form-label">DTI Business Name Registration</label>
              <input
                type="file"
                className="form-control"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileUpload(e, setDtiCertificate, setDtiPreview)}
              />
            </div>
      
          {/* BIR Certificate */}
            <div className="mb-3">
              <label className="form-label">BIR Registration Certificate</label>
              <input
                type="file"
                className="form-control"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileUpload(e, setBirCertificate, setBirPreview)}
              />
            </div>

      
        {/* Business Permit */}
        <div className="mb-3">
          <label className="form-label">Business Permit</label>
          <input
            type="file"
            className="form-control"
            accept=".pdf,.jpg,.png"
            onChange={(e) => handleFileUpload(e, setBusinessPermit, setPermitPreview)}
          />
        </div>
      
        {/* Buttons */}
        <div className="d-flex flex-column flex-md-row justify-content-center mb-3">
          <button
            type="button"
            className="btn btn-secondary btn-custom mb-2 mb-md-0"
            style={{ backgroundColor: "transparent", width: "100%", maxWidth: "340px", color: "#000000" }}
            onClick={handleBack1}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
      
          <button
            type="button"
            className="btn btn-primary btn-custom ms-md-3"
            style={{
              backgroundColor: "#0A65CC",
              width: "100%",
              maxWidth: "340px",
              border: "none",
            }}
            onClick={() => { setStep(4) }}
            disabled={!isStep3Valid()}
          >
            Next <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
        </Row>
      </>
      

    );
    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };
    const renderFormFieldsStep1 = () => (
        <>
            <h6 style={{ textAlign: 'left', color: '#505050' }}>Authorized Representative:</h6>
            <div className="row mb-3 no-margin-bot">
                <div className="col">
                    <input 
                        type="text" 
                        className={`form-control register ${firstNameError && showValidation ? 'is-invalid' : ''}`} 
                        placeholder="First Name *" 
                        value={firstName} 
                        onChange={(e) => {
                            const capitalized = capitalizeWords(e.target.value);
                            setFirstName(capitalized);
                            if (showValidation) setFirstNameError('');
                        }} 
                        onKeyDown={handleTextInput} 
                    />
                    {firstNameError && showValidation && <div style={{ color: 'red', fontSize: '0.8em' }}>{firstNameError}</div>}
                </div>
                <div className="col">
                    <input 
                        type="text" 
                        className="form-control register" 
                        placeholder="Middle Name (Optional)" 
                        value={middleName} 
                        onChange={(e) => setMiddleName(capitalizeWords(e.target.value))} 
                        onKeyDown={handleTextInput} 
                    />
                </div>
            </div>
    
            <div className="row mb-3 no-margin-bot">
                <div className="col">
                    <input 
                        type="text" 
                        className={`form-control register ${lastNameError && showValidation ? 'is-invalid' : ''}`} 
                        placeholder="Last Name *"     
                        value={lastName} 
                        onChange={(e) => {
                            const capitalized = capitalizeWords(e.target.value);
                            setLastName(capitalized);
                            if (showValidation) setLastNameError('');
                        }} 
                        onKeyDown={handleTextInput} 
                    />
                    {lastNameError && showValidation && <div style={{ color: 'red', fontSize: '0.8em' }}>{lastNameError}</div>}
                </div>
                <div className="col">
                    <input 
                        type="text" 
                        className="form-control register" 
                        placeholder="Suffix (Optional)" 
                        value={suffix} 
                        onChange={(e) => setSuffix(capitalizeWords(e.target.value))} 
                        onKeyDown={handleTextInput} 
                    />
                </div>
            </div>
            <div className="row mb-3 no-margin-bot">
            <div className="col">
                <select 
                    className={`form-control register ${positionError && showValidation ? 'is-invalid' : ''}`} 
                    value={position} 
                    onChange={(e) => {
                        setPosition(e.target.value);
                        if (showValidation) setPositionError('');
                    }}
                >
                    <option value="">Select Designation *</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Hiring Manager">Hiring Manager</option>
                    <option value="Founder / CEO">Founder / CEO</option>
                    <option value="COO">COO</option>
                    <option value="CTO">CTO</option>
                    <option value="Talent Acquisition Specialist">Talent Acquisition Specialist</option>
                    {/* Add more relevant employer designations here */}
                </select>
                {positionError && showValidation && (
                    <div style={{ color: 'red', fontSize: '0.8em' }}>{positionError}</div>
                )}
            </div>
            </div>
            <div className="row mb-3 no-margin-bot">
                <div className="col d-flex">
                    <input 
                        type="text" 
                        className="form-control register" 
                        style={{ backgroundColor: '#e6e6e6', width: '65px', marginRight: '-1px', borderRadius: '10px 0px 0px 10px', textAlign: 'center' }} 
                        value="+63" 
                        disabled 
                    />
                    <input 
                        type="text" 
                        className={`form-control register ${contactError && showValidation ? 'is-invalid' : ''}`} 
                        style={{ borderRadius: '0px 10px 10px 0px' }} 
                        placeholder="Contact Number *" 
                        value={contactNumber} 
                        onChange={handleContactChange}
                        onKeyDown={(e) => {
                            if (contactNumber.length === 0 && e.key === '0') {
                                e.preventDefault();
                            }
                            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                                e.preventDefault();
                            }
                        }} 
                        maxLength={10} 
                        required 
                    />
                </div>
                {contactError && showValidation && <div style={{ color: 'red', fontSize: '0.8em' }}>{contactError}</div>}
            </div>

             {/* Terms Agreement */}
             <Form.Group className="mb-3 no-margin-bot d-flex align-items-center">
                <Form.Check 
                    type="checkbox" 
                    checked={isAgreed} 
                    onChange={() => setIsAgreed(!isAgreed)} 
                />
                <div>
                <Form.Label className="ms-2">
                    I've read and agreed with{' '}
                    <a href="#!" onClick={handleShowModal}> Terms and Condition</a>
                </Form.Label>
                <EmployerTermsAndConditions show={showModal} onClose={handleCloseModal} />
                </div>
            </Form.Group>

            <div className="d-flex justify-content-center">
                <button 
                    type="button" 
                    className="btn btn-primary btn-custom" 
                    style={{ backgroundColor: '#0A65CC', width: '700px', marginTop: '20px', border: 'none' }}
                    onClick={handleNext}
                    disabled={!isFirstStepValid()} 
                >
                    Next <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </>
    );
    
    const renderFormFieldsStep3 = () => (
        <>
    <div>
            <h6 style={{ textAlign: 'left', color: '#505050' }}>Account Setup:</h6>
            <div className="mb-3">
                <input
                    type="email"
                    className="form-control register"
                    placeholder="Service email or Business email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    className="form-control register"
                    placeholder="Password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    className="form-control register"
                    placeholder="Confirm Password *"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <div className="form-check mb-3 d-flex align-items-center">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isAgreed}
                    onChange={() => setIsAgreed(!isAgreed)}
                />
                <label className="form-check-label" style={{ marginLeft: 10 }}>
                    I've read and agreed with your Terms and Services
                </label>
            </div>

            {/* Button Section */}
            <div className="d-flex flex-column mb-3">
                {/* Flex container that switches direction based on screen size */}
                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center position-relative w-100">
                    {/* Back Button */}
                    <Button
                        type="button"
                        className="btn btn-secondary btn-custom w-100 w-md-50 me-md-2"
                        style={{
                            backgroundColor: 'transparent',
                            color: '#000000',
                            borderColor: '#000000',
                        }}
                        onClick={handleBack2}
                        disabled={isLoading}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </Button>

                    {/* Loader */}
                    {isLoading && (
                        <div
                            className="loader"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                border: '5px solid #f3f3f3',
                                borderTop: '5px solid #3498db',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                animation: 'spin 2s linear infinite',
                            }}
                        />
                    )}

                    {/* Create Account Button */}
                    <Button
                        type="submit"
                        className="btn btn-success btn-custom w-100 w-md-50 mt-3 mt-md-0"
                        style={{
                            backgroundColor: '#0A65CC',
                            border: 'none',
                            opacity: !isAgreed || isLoading ? 0.4 : 1,
                        }}
                        disabled={!isStep4Valid() || isLoading || !isAgreed}
                    >
                        {isLoading ? 'Verifying your ID...' : <>Create Account <FontAwesomeIcon icon={faArrowRight} /></>}
                    </Button>
                </div>
            </div>

        </div>
        </>
    );

    const renderProgressBar = () => (
        <div className="progress-bar-container mb-4" style={{ width: '100%' }}>
        <div className="progress-bar-step">
          <div className={`circle ${step >= 1 ? 'completed' : ''}`}>1</div>
          <span className="step-label">Authorized Representative</span>
        </div>
        <div className={`progress-line ${step > 1 ? 'completed' : ''}`}></div>
        <div className="progress-bar-step">
          <div className={`circle ${step >= 2 ? 'completed' : ''}`}>2</div>
          <span className="step-label">Upload Documents</span>
        </div>
        <div className={`progress-line ${step > 2 ? 'completed' : ''}`}></div>
        <div className="progress-bar-step">
          <div className={`circle ${step === 3 ? 'completed' : ''}`}>3</div>
          <span className="step-label">Account Setup</span>
        </div>
      </div>
      
      );
      
    return (
        <>
<Container className="mb-5 paddings">
    <Row className="justify-content-center">
        <Col xs={12} md={6} lg={6}>
            <h3 className="mb-3 text-start">Create Account</h3>
            <h4 className="mb-4 text-start" style={{ fontSize: "15px" }}>
                Already have an account?{" "}
                <Link to="/employer_login" style={{ textDecoration: "none", color: "#0A65CC" }}>
                    Log In
                </Link>
            </h4>

            <div className="d-flex justify-content-center mb-4">
                <Card className="p-4 text-center" style={{ background: 'aliceblue', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 10px', borderRadius: "10px", border: 'none'}}>
                    <h5 className="text-center mb-3">Create Account as</h5>
                    <div className="container">
                        <Button 
                            className={`btn btn-primary mx-1 custom-button ${formType === 'employer' ? 'active' : ''}  btn5`}
                            style={{ backgroundColor: formType === 'employer' ? '#1863b9' : 'white', color: formType === 'employer' ? 'white' : 'black', width: '100%',  }} 
                            onClick={() => setFormType('employer')}
                        >
                            <FontAwesomeIcon icon={faUser} /> Employer
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Form Section */}
            <div className="text-center" style={{ padding: '40px', borderRadius: '10px', background: 'aliceblue', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 10px'}}>
                {renderProgressBar()}
                <form onSubmit={handleSubmit} style={{ width: "100%", margin: "auto" }}>
                    {step === 1 
                    ? renderFormFieldsStep1() 
                    : step === 2
                    ? renderFormFieldsStep2() 
                    : renderFormFieldsStep3()}
                </form>
            </div>
        </Col>
        <Col xs={12} md={6} lg={6} className="mb-4 mb-md-0" style={{alignContent: 'center'}}>
            {/* Image Column */}
            <div className="image-wrapper text-center">
                <img 
                    src="https://img.freepik.com/premium-vector/woman-sitting-online-marketing-working-with-pc-desktop-from-home-flat-design_115968-65.jpg?w=996" 
                    alt="Create Account" 
                    className="img-fluid form-image"
                    style={{ borderRadius: '10px', maxHeight: '500px', objectFit: 'cover', width: '800px', boxShadow: 'none'}}
                />
            </div>
        </Col>

    </Row>
</Container>
    <style>{`
            #root {
                width: 100%;
            }
            .form-image {
                width: 100%;
                border-radius: 10px;
                box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;
            }
        /* Card Responsiveness */   
        .paddings {
            margin-top: 6rem;   
        }
        .btn5 {
            width: 270px;
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

        /* Responsive Design */
        @media (max-width: 1390px) {
            .resp {
                width: 193px !important;
            }
        }

        @media (max-width: 1195px) {
            .resp {
                width: 197px !important;
            }
        }

        @media (max-width: 768px) {
            .btn-custom {
                width: 100% !important;
                margin-left: 0 !important;
            }
            .progress-bar-step span {
                display: none;
              }
            .progress-line {
                top: 0;
            }  
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

        }

        @media (max-width: 576px) {
            .paddings{
                padding: 0 25px !important;     
                margin-top: 8rem !important;
            }
            .customss {
                margin-bottom: 1rem
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
};
