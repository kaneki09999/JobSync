import React, { useState, useEffect, useRef } from 'react'; 
import { Tabs, Tab, Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUser, faBuilding, faArrowLeft, faFileLines } from '@fortawesome/free-solid-svg-icons';
import Webcam from 'react-webcam';
import { postToEndpoint } from '../../../components/apiService';
import Swal from 'sweetalert2';
import { useAuth } from '../../../AuthContext';

export default function IDVerification(){
    const { user } = useAuth();   
    const [documentImage, setDocumentImage] = useState(null);
    const [faceImage, setFaceImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const webcamRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false); 
    const [applicant, setApplicant] = useState([]);
    const [verified, setVerified] = useState([]);
    const [idFrontImagePreview, setIdFrontImagePreview] = useState(null);
    const [backImagePreview, setBackImagePreview] = useState(null);

    const captureFaceImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setFaceImage(imageSrc);
        setCameraActive(false);
    };

    const handleImageUpload = (event, setImage, setPreview) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    useEffect(() => {
        const fetchApplicant = async () => {
            try {
                const response = await postToEndpoint('/getApplicantinfo.php', { applicant_id: user?.id });

                if (response.data) {
                    setApplicant(response.data);
                } else {
                    console.error('No company found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching company:', error);
            }
        };
        fetchApplicant();
    }, [user?.id]);

    useEffect(() => {
        const fetchApplicant = async () => {
            try {
                const response = await postToEndpoint('/getVerifiedId.php', { applicant_id: user?.id });
                console.log(response.data.verified)
                if (response.data.verified) {
                    setVerified(response.data.verified);
                } else {
                    console.error('No company found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching company:', error);
            }
        };
        fetchApplicant();
    }, [user?.id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
    
        const documentBase64 = await convertToBase64(documentImage);
        const backBase64 = await convertToBase64(backImage);
    
        const payload = {
            document: documentBase64,
            face: faceImage.split(',')[1],
            backSideId: backBase64,
            email: applicant.email,
            lastname: applicant.lastname,
            applicant_id: user?.id
        };
    
        try {
            const response = await postToEndpoint('/verificationId.php', payload);
    
            if (response.data.decision) {
                if (response.data.decision === 'accept') {
                    await Swal.fire({
                        title: 'Verified!',
                        text: "Your ID has been successfully verified.",
                        icon: 'success',
                        showConfirmButton: true,
                        allowOutsideClick: false, 
                        allowEscapeKey: false     
                    });
                    window.location.reload(); 
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
    
        } finally {
            setIsLoading(false);
        }
    };
    
    
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

  return (
    <>
    {verified[0]?.account_status === 'verified' ? (
    <Container className="mb-3" style={{marginTop: '2rem'}}>
        <Row className="justify-content-center">
            <Col md={8}>
                <div className="card border-success mb-3 shadow-sm">
                    <div className="card-header bg-success text-white d-flex align-items-center">
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        Account Verified
                    </div>
                    <div className="card-body text-success">
                        <h5 className="card-title">You're verified!</h5>
                        <p className="card-text">
                            Your identity has been successfully verified. You now have full access to our features and services.
                        </p>
                    </div>
                </div>
            </Col>
        </Row>
    </Container>
    ) : (
        <Container className='mb-5' style={{marginTop: '2rem'}}>
            <Row className="mb-3">
                {/* Front ID Upload */}
                <Col xs={12} md={6} lg={6} className="d-flex flex-column">
                    <small className="form-text text-muted">Upload the front of your Government ID</small>
                    <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setDocumentImage, setIdFrontImagePreview)}
                    required
                    />
                    <div className="mt-2 d-flex align-items-center justify-content-center rounded" style={{ height: "300px", background: '#f0f0f0' }}>
                    {idFrontImagePreview ? (
                        <img src={idFrontImagePreview} alt="Uploaded Front ID Preview" className="img-fluid rounded" style={{ height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span className="text-muted">Front ID Preview</span>
                    )}
                    </div>
                </Col>

                {/* Back ID Upload */}
                <Col xs={12} md={6} lg={6} className="d-flex flex-column">
                    <small className="form-text text-muted">Upload the back of your Government ID</small>
                    <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setBackImage, setBackImagePreview)}
                    required
                    />
                    <div className="mt-2 d-flex align-items-center justify-content-center rounded" style={{ height: "300px", background: '#f0f0f0' }}>
                    {backImagePreview ? (
                        <img src={backImagePreview} alt="Uploaded Back ID Preview" className="img-fluid rounded" style={{ height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span className="text-muted">Back ID Preview</span>
                    )}
                    </div>
                </Col>
                </Row>

            {/* Selfie Capture Section */}
            <Row className="justify-content-center mb-3">
                <Col xs={12} md={6} className="text-center">
                {faceImage && (
                    <div className="mb-2">
                    <p>Captured Face Image Preview:</p>
                    <img src={faceImage} alt="Face Preview" className="img-fluid rounded" style={{ width: "100%", height: "320px", objectFit: "cover" }} />
                    </div>
                )}
                {cameraActive ? (
                    <>
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-100 rounded" />
                    <button type="button" onClick={captureFaceImage} className="btn btn-primary mt-2">Capture</button>
                    </>
                ) : (
                    <>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setFaceImage)} style={{ display: "none" }} id="face-upload" />
                    <button type="button" onClick={() => setCameraActive(true)} className="btn btn-primary mt-2">Open Camera</button>
                    </>
                )}
                </Col>
            </Row>

            {/* Navigation Buttons */}
            <Row className="justify-content-center">
                <Col xs={12} md={6} className="d-flex flex-column flex-md-row justify-content-center">
                    <button 
                        type="button" 
                        className="btn btn-primary btn-custom" 
                        onClick={handleSubmit}
                        style={{ backgroundColor: '#0A65CC', width: '150px', border: 'none' }}
                    >
                        Verify 
                    </button>
                </Col>
            </Row>
        </Container>
        )}  
    </>
  );
};

