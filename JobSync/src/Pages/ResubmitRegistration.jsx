import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import React, { useState, useEffect, useRef } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUser, faBuilding, faArrowLeft, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import { postToEndpoint } from '../components/apiService';

export default function ResubmitRegistration() {
    const [formType, setFormType] = useState('employer');
    const { employer_id, token } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); 
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

    const handleSubmit = async () => {
        if (!dtiCertificate || !birCertificate || !businessPermit) {
            Swal.fire({
                icon: "warning",
                title: "Missing Documents",
                text: "Please upload all required documents.",
            });
            return;
        }
    
        setIsLoading(true);
    
        try {
            const dtiBase64 = await convertToBase64(dtiCertificate);
            const birBase64 = await convertToBase64(birCertificate);
            const permitBase64 = await convertToBase64(businessPermit);
    
            const formData = {
                employer_id,
                token,
                dti_document: dtiBase64,
                bir_document: birBase64,
                business_permit: permitBase64,
                account_status: "Pending",
            };
            const response = await postToEndpoint("/ResubmitDocuments.php", formData, {
                "Content-Type": "application/json",
            });
    
            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Documents uploaded successfully!",
                }).then(() => {
                    navigate("/", { replace: true });
                    window.history.pushState(null, "", window.location.href);
                    window.addEventListener("popstate", () => {
                    indow.history.pushState(null, "", window.location.href);
                    });
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Upload Failed",
                    text: response.data.error,
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                console.log(`Base64 Data for ${file.name}:`, reader.result); // Debug log
                resolve(reader.result);
            };
            reader.onerror = (error) => reject(error);
        });
    };
    

    const renderFormFieldsStep2 = () => (

        <>
            <div className="row mb-3">
                {/* DTI Certificate */}
                <div className="col-md-6">
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
                                    <embed src={dtiPreview} width="100%" height="400px" />
                                ) : (
                                    <img src={dtiPreview} alt="DTI Preview" style={{ maxWidth: "100%", maxHeight: "300px" }} />
                                )}
                            </div>
                        ) : (
                            <div className="mt-3">
                                <span className="text-muted mt-3 d-block" style={{fontSize: '17px', width:'100%', height:'400px', background: '#eceff2', alignContent: 'space-around', borderRadius: '10px'}}>Documents Preview <br /><FontAwesomeIcon icon={faFileLines} style={{fontSize: '50px', marginTop: '20px', color: '#7bb3e5'}}/></span>
                            </div>
                        )}
                    </div>
                </div>
    
                {/* BIR Certificate */}
                <div className="col-md-6">
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
                                    <embed src={birPreview} width="100%" height="400px" />
                                ) : (
                                    <img src={birPreview} alt="BIR Preview" style={{ maxWidth: "100%", maxHeight: "300px" }} />
                                )}
                            </div>
                        ) : (
                            <div className="mt-3">
                                <span className="text-muted mt-3 d-block" style={{fontSize: '17px', width:'100%', height:'400px', background: '#eceff2', alignContent: 'space-around', borderRadius: '10px'}}>Documents Preview <br /><FontAwesomeIcon icon={faFileLines} style={{fontSize: '50px', marginTop: '20px', color: '#7bb3e5'}}/></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    
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
                            <embed src={permitPreview} width="100%" height="400px" />
                        ) : (
                            <img src={permitPreview} alt="Business Permit Preview" style={{ maxWidth: "100%", maxHeight: "300px" }} />
                        )}
                    </div>
                ) : (
                    <div className="mt-3">
                        <span className="text-muted mt-3 d-block" style={{fontSize: '17px', width:'100%', height:'200px', background: '#eceff2', alignContent: 'space-around', borderRadius: '10px'}}>Documents Preview <br /><FontAwesomeIcon icon={faFileLines} style={{fontSize: '50px', marginTop: '20px', color: '#7bb3e5'}}/></span>
                    </div>
                )}
            </div>
    
            {/* Buttons */}
            <div className="d-flex justify-content-center mb-3" style={{ position: "relative" }}>
                <button
                    type="button"
                    className="btn btn-primary btn-custom"
                    style={{
                        backgroundColor: "#0A65CC",
                        width: "340px",
                        marginTop: "20px",
                        marginLeft: "20px",
                        border: "none",
                    }}
                    onClick={handleSubmit}
                >
                    Submit <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </>
    
    
        );
    return (
        <>
        <div className="container mt-5 mb-5">
            <div className="row">
            <h3 className="mb-3 text-start">Resubmit Documents</h3>
                    <h4 className="mb-4 text-start" style={{ fontSize: '15px' }}>
                        Already have an account? <Link to="/candidate_login" style={{ textDecoration: 'none', color: '#0A65CC' }}>Log In</Link>
                    </h4>
                    <div className="d-flex justify-content-center mb-1">
                        <div className="d-flex flex-column align-items-center mb-4" style={{ backgroundColor: '#F1F2F4', padding: '26px', borderRadius: '10px', width: '85%' }}>
                            <h5 className="text-center mb-3">Create Account as</h5>
                            <div className="d-flex justify-content-center">
                                    <button 
                                        className={`btn btn-primary mx-1 custom-button ${formType === 'candidate' ? 'active' : ''}`}
                                        style={{ backgroundColor: formType === 'candidate' ? '#042852' : 'white', color: formType === 'candidate' ? 'white' : 'black', width: '300px', borderColor: 'black' }} 
                                        disabled    
                                    >
                                        <FontAwesomeIcon icon={faUser} /> Candidate
                                    </button>
                                <button 
                                    className={`btn btn-primary mx-1 custom-button ${formType === 'employer' ? 'active' : ''}`}
                                    style={{ backgroundColor: formType === 'employer' ? '#042852' : 'white', color: formType === 'employer' ? 'white' : 'black', width: '300px', borderColor: 'black' }} 
                                >
                                    <FontAwesomeIcon icon={faBuilding} /> Employer
                                </button>
                            </div>
                        </div>
                    </div>
                <div className="col" style={{justifyItems: 'center'}}>
                    <form  style={{width: '83%'}}>
                    {renderFormFieldsStep2()}
                    </form>

                </div>

            </div>
        </div>
       
        </>
    );
}