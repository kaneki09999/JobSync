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
    <Row className="mb-3">
    {/* DTI Certificate */}
    <Col xs={12} md={6}>
        <div className="mb-3">
        <label className="form-label">Upload DTI Business Name Registration</label>
        <input
            type="file"
            className="form-control"
            accept=".pdf,.jpg,.png"
            onChange={(e) => handleFileUpload(e, setDtiCertificate, setDtiPreview)}
        />
        {dtiPreview ? (
            <div className="mt-3">
            {dtiCertificate.type === "application/pdf" ? (
                <embed src={dtiPreview} className="w-100" height="400px" />
            ) : (
                <img src={dtiPreview} alt="DTI Preview" className="img-fluid rounded" style={{ maxHeight: "300px" }} />
            )}
            </div>
        ) : (
            <div className="mt-3 text-center bg-light rounded d-flex flex-column align-items-center justify-content-center" style={{ height: "200px" }}>
            <span className="text-muted">Documents Preview</span>
            <FontAwesomeIcon icon={faFileLines} className="mt-2 text-primary" style={{ fontSize: "50px" }} />
            </div>
        )}
        </div>
    </Col>

    {/* BIR Certificate */}
    <Col xs={12} md={6}>
        <div className="mb-3">
        <label className="form-label">Upload BIR Registration Certificate</label>
        <input
            type="file"
            className="form-control"
            accept=".pdf,.jpg,.png"
            onChange={(e) => handleFileUpload(e, setBirCertificate, setBirPreview)}
        />
        {birPreview ? (
            <div className="mt-3">
            {birCertificate.type === "application/pdf" ? (
                <embed src={birPreview} className="w-100" height="400px" />
            ) : (
                <img src={birPreview} alt="BIR Preview" className="img-fluid rounded" style={{ maxHeight: "300px" }} />
            )}
            </div>
        ) : (
            <div className="mt-3 text-center bg-light rounded d-flex flex-column align-items-center justify-content-center" style={{ height: "200px" }}>
            <span className="text-muted">Documents Preview</span>
            <FontAwesomeIcon icon={faFileLines} className="mt-2 text-primary" style={{ fontSize: "50px" }} />
            </div>
        )}
        </div>
    </Col>
    </Row>

    {/* Business Permit */}
    <div className="mb-3">
    <label className="form-label">Upload Business Permit</label>
    <input
        type="file"
        className="form-control"
        accept=".pdf,.jpg,.png"
        onChange={(e) => handleFileUpload(e, setBusinessPermit, setPermitPreview)}
    />
    {permitPreview ? (
        <div className="mt-3">
        {businessPermit.type === "application/pdf" ? (
            <embed src={permitPreview} className="w-100" height="400px" />
        ) : (
            <img src={permitPreview} alt="Business Permit Preview" className="img-fluid rounded" style={{ maxHeight: "300px" }} />
        )}
        </div>
    ) : (
        <div className="mt-3 text-center bg-light rounded d-flex flex-column align-items-center justify-content-center" style={{ height: "200px" }}>
        <span className="text-muted">Documents Preview</span>
        <FontAwesomeIcon icon={faFileLines} className="mt-2 text-primary" style={{ fontSize: "50px" }} />
        </div>
    )}
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

    </>


    );

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
                            setFirstName(e.target.value);
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
                        onChange={(e) => setMiddleName(e.target.value)} 
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
                            setLastName(e.target.value);
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
                        onChange={(e) => setSuffix(e.target.value)} 
                        onKeyDown={handleTextInput} 
                    />
                </div>
            </div>
            <div className="row mb-3 no-margin-bot">
                <div className="col">
                    <input 
                        type="text" 
                        className={`form-control register ${positionError && showValidation ? 'is-invalid' : ''}`} 
                        placeholder="Designation *" 
                        value={position} 
                        onChange={(e) => {
                            setPosition(e.target.value);
                            if (showValidation) setPositionError('');
                        }} 
                        onKeyDown={handleTextInput} 
                    />
                    {positionError && showValidation && <div style={{ color: 'red', fontSize: '0.8em' }}>{positionError}</div>}
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
                    placeholder="Email *"
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
            <div className="d-flex flex-column align-items-center mb-3" style={{ position: 'relative' }}>
                <Button
                    type="button"
                    className="btn btn-secondary btn-custom w-100"
                    style={{
                        backgroundColor: 'transparent',
                        color: '#000000',
                        marginTop: '20px',
                        borderColor: '#000000',
                    }}
                    onClick={handleBack2}
                    disabled={isLoading}
                >
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                </Button>

                {isLoading ? (
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
                ) : null}

                <Button
                    type="submit"
                    className="btn btn-success btn-custom w-100"
                    style={{
                        backgroundColor: '#0A65CC',
                        marginTop: '20px',
                        border: 'none',
                        opacity: !isAgreed || isLoading ? 0.4 : 1,
                    }}
                    disabled={!isStep4Valid() || isLoading || !isAgreed}
                >
                    {isLoading ? 'Verifying your ID...' : <>Create Account <FontAwesomeIcon icon={faArrowRight} /></>}
                </Button>
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
        <Container className="mt-5 mb-5 paddings">
        <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
                <h3 className="mb-3 text-start">Create Account</h3>
                <h4 className="mb-4 text-start" style={{ fontSize: "15px" }}>
                    Already have an account?{" "}
                    <Link to="/candidate_login" style={{ textDecoration: "none", color: "#0A65CC" }}>
                        Log In
                    </Link>
                </h4>

                <div className="d-flex justify-content-center mb-4">
                        <Card className="p-4 text-center w-100" style={{ backgroundColor: "#F1F2F4", borderRadius: "10px"}}>
                            <h5 className="text-center mb-3">Create Account as</h5>
                            <div className="d-flex flex-column flex-sm-row justify-content-center">
                                <Link to="/registration" className="text-decoration-none">
                                    <Button 
                                         className={`btn btn-primary mx-1 custom-button ${formType === 'candidate' ? 'active' : ''} resp btn5 customss`}
                                         style={{ backgroundColor: formType === 'candidate' ? '#042852' : 'white', color: formType === 'candidate' ? 'white' : 'black', width: '225px', borderColor: 'black' }} 
                                        onClick={() => setFormType('candidate')}

                                    >
                                        <FontAwesomeIcon icon={faBuilding} /> Candidate
                                    </Button>
                                </Link>
                                <Button 
                                     className={`btn btn-primary mx-1 custom-button ${formType === 'employer' ? 'active' : ''}  btn5`}
                                     style={{ backgroundColor: formType === 'employer' ? '#042852' : 'white', color: formType === 'employer' ? 'white' : 'black', width: '225px', borderColor: 'black' }} 
                                     onClick={() => setFormType('employer')}
                                >
                                    <FontAwesomeIcon icon={faUser} /> Employer
                                </Button>
                            </div>
                        </Card>
                    </div>
                {/* Form Section */}
                <div className="text-center">
                    {renderProgressBar()}
                    <form onSubmit={handleSubmit} style={{ width: step === 3 ? "100%" : "100%", margin: "auto" }}>
                        {step === 1 
                        ? renderFormFieldsStep1() 
                        : step === 2
                        ? renderFormFieldsStep2() 
                        : renderFormFieldsStep3()}
                    </form>
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
