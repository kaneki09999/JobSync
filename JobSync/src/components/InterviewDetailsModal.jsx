import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { postToEndpoint } from './apiService';
import DOMPurify from 'dompurify';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { useAuth } from '../AuthContext';

const decodeHtmlEntities = (str) => {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || doc.documentElement.innerText;
};

const InterviewDetailsModal = ({ show, handleClose, interviewDetails }) => {
    const [interview, setInterview] = useState({ message: '' });
    const [company, setCompany] = useState([]);
    const [showDeclineModal, setShowDeclineModal] = useState(false);  
    const [applicant, setapplicant] = useState([]);
    const [firstname, setFirstname] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [lastname, setLastname] = useState('');
    const { user } = useAuth(); 
    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await postToEndpoint('/getApplicantInfo.php', {
                    applicant_id: user.id
                });

                if (response.data) {
                    const { lastname, firstname, middlename} = response.data;
                    setFirstname(firstname || '');
                    setMiddlename(middlename || '');
                    setLastname(lastname || '');
                } else {
                    console.error('No interview found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching interview:', error);
            }
        };

        fetchInterview();
    }, [user.id]);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await postToEndpoint('/getInterviewSchedule.php', {
                    application_id: interviewDetails.application_id,
                    job_id: interviewDetails.job_id,
                });
    
                if (response.data?.interview) {
                    setInterview(response.data.interview);
                } else {
                    console.error('No interview found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching interview:', error);
            }
        };
        fetchInterview();
        const interval = setInterval(fetchInterview, 10000); 
        return () => clearInterval(interval);  
    }, [interviewDetails.application_id, interviewDetails.job_id]);
    

    const decodedMessage = decodeHtmlEntities(interview.message);
    const cleanedMessage = decodedMessage.replace(/\n\s*\n/g, '\n');  
    const sanitizedDescription = DOMPurify.sanitize(cleanedMessage, {
        ALLOWED_TAGS: ['b', 'strong', 'i', 'u', 'h2', 'h3', 'p', 'ul', 'li', 'a', 'br'],
        ALLOWED_ATTR: ['href'],
    });
    

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await postToEndpoint('/getCompanyName.php', {
                    job_id: interviewDetails.job_id,
                });

                if (response.data?.companyname) {
                    setCompany(response.data.companyname);
                } else {
                    console.error('No company found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching company:', error);
            }
        };

        fetchCompany();
    }, [interviewDetails.job_id]);

    const handleConfirmInterview = async () => {
        const result = await Swal.fire({
          title: 'Are you sure?',
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Yes',
          reverseButtons: true,
        });
        if (result.isConfirmed) {
          try {
            const response = await postToEndpoint('/updateInterviewStatus.php', {
              application_id: interviewDetails.application_id,
              job_id: interviewDetails.job_id,
              company_name: interviewDetails.company_name,
              status: 'Confirmed',
              interview_id: interview.interview_id,
              schedule: interview.schedule,
              time: interview.time,
              jobTitle: company.jobTitle,

            });
      
            if (response.data?.success) {
              Swal.fire({
                icon: 'success',
                title: 'Interview Confirmed!',
                text: 'The interview has been confirmed successfully.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false
              }).then(() => {
                handleClose();
            });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error confirming the interview. Please try again.',
              });
            }
          } catch (error) {
            console.error('Error sending confirmation:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error sending the confirmation. Please try again later.',
            });
          }
        }
      };

      const [declineReason, setDeclineReason] = useState("");  
      const handleDecline = async () => {
        if (!declineReason) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Reason',
                text: 'Please provide a reason before declining!',
                confirmButtonColor: '#d33'
            });
            return;
        }
        Swal.fire({
            title: 'Processing...',
            text: 'Please wait while we process your request.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();  
            }
        });
        try {
            const response = await postToEndpoint('/declineInterview.php', {
                application_id: interviewDetails.application_id,
                job_id: interviewDetails.job_id,
                reason: declineReason,
                interview_id: interview.interview_id,
                jobTitle: company.jobTitle,
                email: company.email,
                firstname: firstname,
                lastname: lastname,
                company_name: company.company_name,
                decision_type: decisionType  
            });
    
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: `Interview ${decisionType.toLowerCase()} successfully.`,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    setShowDeclineModal(false);
                    setShowDecisionModal(false);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Something went wrong. Please try again later.',
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            console.error('Error declining interview:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to decline the interview. Please try again.',
                confirmButtonColor: '#d33'
            });
        }
    };
    
      
      const [decisionType, setDecisionType] = useState("Decline");  
      const [showDecisionModal, setShowDecisionModal] = useState(false);
      const handleDeclineClick = () => {
        setShowDecisionModal(true); 
    };
      const handleDeclinedClick = () => {
          setDecisionType("Decline");
          setShowDeclineModal(true);
      };
      
      const handleRescheduleClick = () => {
          setDecisionType("Reschedule");
          setShowDeclineModal(true);
      };

    return (
        <>
            <Modal show={show && !showDeclineModal && !showDecisionModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: '600', fontSize: '20px', paddingLeft: '20px' }}>
                        {company.company_name} has invited you for an interview.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="align-items-center no-margin m-0">
                        <Col>
                            <div className="d-flex align-items-center mb-4" style={{ gap: "10px" }}>
                                <img
                                    src={company.logo || "https://via.placeholder.com/50"}
                                    alt={`${company.company_name}'s profile`}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                                <div style={{ textAlign: 'left' }}>
                                    <h5 className="no-margin text-start">{company.jobTitle}</h5>
                                    <span className="company-name no-margin text-start" style={{ fontSize: '13px', fontWeight: '500' }}>at {company.company_name}</span>
                                    <span className="badge ms-2 no-margin" style={{ padding: '7px', textTransform: 'uppercase', borderRadius: '3px', fontSize: '9px', background: '#119d5c' }}>{company.jobType}</span>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="d-flex align-items-center mb-4" style={{ gap: "10px" }}>
                                <div style={{ textAlign: 'left' }}>
                                    <h6 className="no-margin text-start">Interview Schedule</h6>
                                    <h6 className="no-margin text-start" style={{ display: 'flex' }}>Date: <p style={{ marginLeft: '5px', marginBottom: '0px' }}>{interview.schedule}</p></h6>
                                    <h6 className="no-margin text-start" style={{ display: 'flex' }}>Time: <p style={{ marginLeft: '5px', marginBottom: '0px' }}>{interview.time}</p></h6>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Container>
                    <div
                        className="mt-2 sanitized-content"
                        style={{ marginLeft: '20px', whiteSpace: 'pre-line' }}
                        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                    />
                    </Container>
                </Modal.Body>
                <Modal.Footer
                style={{
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                    justifyContent: interview.status === 'Confirmed' || interview.status === 'Reschedule' || interview.status === 'Declined' ? 'flex-end' : 'space-between',
                }}>
                {interview.status !== 'Confirmed' && interview.status !== 'Declined' && interview.status !== 'Reschedule' && (
                    <Button
                        style={{
                            height: "40px",
                            fontSize: "12px",
                            borderRadius: "3px",
                            width: "75px",
                            color: "#fff",
                            background: "#cf6267",
                            border: "none",
                            fontWeight: "700",
                        }}
                        onClick={handleDeclineClick}  
                    >
                        Decline
                    </Button>

                )}
                <div>
                {interview.status !== 'Confirmed' && interview.status !== 'Declined' && interview.status !== 'Reschedule' && (
                    <Button
                        variant="primary"
                        style={{
                            width: "150px",
                            height: "40px",
                            fontSize: "12px",
                            borderRadius: "3px",
                            background: "#156ad7",
                            fontWeight: "500",
                        }}
                        onClick={handleConfirmInterview}
                    >
                        Confirm Interview
                    </Button>
                )}
                <Button
                    variant="outline-secondary"
                    style={{
                        height: "40px",
                        fontSize: "12px",
                        borderRadius: "3px",
                        width: "75px",
                        color: "#156ad7",
                        background: "#bce0ff",
                        border: "none",
                        fontWeight: "700",
                        marginLeft: '10px'
                    }}
                    onClick={handleClose}
                >
                    Close
                </Button>
                </div>
            </Modal.Footer>
            </Modal>
            <Modal show={showDecisionModal} onHide={() => setShowDecisionModal(false)} centered size="md">
                <Modal.Body className="text-center p-4">
                    <h5 className="mb-3">Interview Decision</h5>
                    <p className="text-muted">
                        Would you like to decline the interview or request a reschedule?
                    </p>
                    <div className="d-flex mt-4" style={{ justifyContent: 'space-between' }}>
                        <Button onClick={() => setShowDecisionModal(false)} className="me-2"
                            variant="outline-secondary"
                            style={{
                                height: "40px",
                                fontSize: "12px",
                                borderRadius: "3px",
                                width: "75px",
                                color: "#156ad7",
                                background: "#bce0ff",
                                border: "none",
                                fontWeight: "700",
                                marginLeft: '10px'
                            }}>
                            Cancel
                        </Button>
                        <div>
                            <Button onClick={handleRescheduleClick}
                                style={{
                                    height: "40px",
                                    fontSize: "12px",
                                    borderRadius: "3px",
                                    width: "145px",
                                    color: "#5f4c1b",
                                    background: "#ffca2c",
                                    border: "none",
                                    fontWeight: "700",
                                }}>
                                Request Reschedule
                            </Button>
                            <Button variant="danger" className="ms-2" onClick={handleDeclinedClick}
                                style={{
                                    height: "40px",
                                    fontSize: "12px",
                                    borderRadius: "3px",
                                    width: "145px",
                                    color: "#fff",
                                    background: "#c4393f",
                                    border: "none",
                                    fontWeight: "700",
                                }}>
                                Decline Interview
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            
            {/* Decline Confirmation Modal */}
            <Modal show={showDeclineModal} onHide={() => setShowDeclineModal(false)} centered size='lg'>
    <Modal.Header closeButton>
        <Modal.Title>{decisionType} Interview</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Row className="align-items-center no-margin m-0">
            <Col>
                <div className="d-flex align-items-center mb-4" style={{ gap: "10px" }}>
                    <img
                        src={company.logo || "https://via.placeholder.com/50"}
                        alt={`${company.company_name}'s profile`}
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />
                    <div style={{ textAlign: 'left' }}>
                        <h5 className="no-margin text-start">{company.jobTitle}</h5>
                        <span className="company-name no-margin text-start" style={{ fontSize: '13px', fontWeight: '500' }}>at {company.company_name}</span>
                        <span className="badge ms-2 no-margin" style={{ padding: '7px', textTransform: 'uppercase', borderRadius: '3px', fontSize: '9px', background: '#119d5c' }}>{company.jobType}</span>
                    </div>
                </div>
            </Col>
            <Col>
                <div className="d-flex align-items-center mb-4" style={{ gap: "10px" }}>
                    <div style={{ textAlign: 'left' }}>
                        <h6 className="no-margin text-start">Interview Schedule</h6>
                        <h6 className="no-margin text-start" style={{ display: 'flex' }}>Date: <p style={{ marginLeft: '5px', marginBottom: '0px' }}>{interview.schedule}</p></h6>
                        <h6 className="no-margin text-start" style={{ display: 'flex' }}>Time: <p style={{ marginLeft: '5px', marginBottom: '0px' }}>{interview.time}</p></h6>
                    </div>
                </div>
            </Col>
        </Row>  
        <p className='mb-2' style={{ color: '#494949' }}>Please provide a reason for your decision:</p>
        <ReactQuill
            value={declineReason}
            onChange={setDeclineReason}
            placeholder={`Type your reason for ${decisionType.toLowerCase()} here...`}
        />
    </Modal.Body>
    <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button onClick={() => {
                    setShowDeclineModal(false);
                    setShowDecisionModal(false);  
                }}
            variant="outline-secondary"
            style={{
                height: "40px",
                fontSize: "12px",
                borderRadius: "3px",
                width: "75px",
                color: "#156ad7",
                background: "#bce0ff",
                border: "none",
                fontWeight: "700",
                marginLeft: '10px'
            }}>
            Close
        </Button>
        <Button variant={decisionType === "Decline" ? "danger" : "warning"}
            onClick={decisionType === "Decline" ? handleDecline : handleDecline}
            style={{
                height: "40px",
                fontSize: "12px",
                borderRadius: "3px",
                width: "120px",
                color: "#fff",
                background: decisionType === "Decline" ? "#c4393f" : "#ffca2c",
                border: "none",
                fontWeight: "700",
            }}>
            {decisionType}
        </Button>
    </Modal.Footer>
</Modal>
        </>
    );
};

export default InterviewDetailsModal;
