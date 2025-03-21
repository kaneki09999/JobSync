import React, { useState, useEffect, useRef } from 'react'; 
import { Tabs, Tab, Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUser, faBuilding, faArrowLeft, faFileLines } from '@fortawesome/free-solid-svg-icons';
import Webcam from 'react-webcam';

const IDVerification = () => {

    
    const [documentImage, setDocumentImage] = useState(null);
    const [faceImage, setFaceImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const webcamRef = useRef(null);

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

  return (
    <>
        <Container style={{marginTop: '2rem'}}>
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
                        style={{ backgroundColor: '#0A65CC', width: '150px', border: 'none' }}
                    >
                        Verify 
                    </button>
                </Col>
            </Row>
        </Container>  
    </>
  );
};

export default IDVerification;
