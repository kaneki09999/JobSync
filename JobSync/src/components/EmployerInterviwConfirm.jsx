import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { postToEndpoint } from './apiService';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import banner  from '../assets/employerbanner.png'

const decodeHtmlEntities = (str) => {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || doc.documentElement.innerText;
};

const EmployerInterviewConfirmed = ({ show, handleClose, interviewDetails }) => {
    const [interview, setInterview] = useState({ message: '' });
    const [company, setCompany] = useState([]);
    const [status, setStatus] = useState([]);

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
    }, [interviewDetails.application_id, interviewDetails.job_id]);

    const decodedMessage = decodeHtmlEntities(status.messages);
    const sanitizedDescription = DOMPurify.sanitize(decodedMessage, {
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

    useEffect(() => {
        const fetchInterviewStatus = async () => {
            try {
                const response = await postToEndpoint('/getInterviewStatus.php', {
                    interview_id: interview.interview_id
                });
                if (response.data?.interviewStatus) {
                    setStatus(response.data.interviewStatus);
                } else {
                    console.error('No interview status found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching interview status:', error);
            }
        };

        fetchInterviewStatus();
    }, [interview.interview_id]);

    return (
        <>
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: '600', fontSize: '20px', paddingLeft: '20px' }}>
                        {interview.firstname} {interview.middlename} {interview.lastname} has confirmed the scheduled meeting.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="align-items-center no-margin m-0">
                        <Col>
                            <div className="d-flex align-items-center mb-4" style={{ gap: "10px" }}>
                                <img
                                    src={interview.profile_picture || "https://via.placeholder.com/50"}
                                    alt={`${interview.firstname}'s profile`}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                                <div style={{ textAlign: 'left' }}>
                                    <h5 className="no-margin text-start">{interview.firstname} {interview.middlename} {interview.lastname}</h5>
                                    <span className="company-name no-margin text-start" style={{ fontSize: '15px', fontWeight: '400', color: '#222222' }}>For the position of {company.jobTitle}</span>
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
                        <div className="mt-2">
                            <div>
                            The applicant has officially confirmed their availability for the interview, which is scheduled for <b>{interview.schedule}</b> at <b>{interview.time}</b>. 
                            </div>
                            <h6 className='mt-3' style={{fontWeight: '500'}}>Channel name: <h6 className='mt-2' style={{fontWeight: '400'}}>{interview.channel_name}</h6></h6>
                            <div
                                className="mt-1"
                                style={{
                                padding: "8px 15px 8px",
                                backgroundColor: "#ebebeb",
                                borderRadius: "5px",
                                display: "flex",
                                }}
                            >
                                <strong>Note:</strong>
                                <p
                                style={{
                                    fontSize: "16px",
                                    marginBottom: "0",
                                    marginLeft: "10px",
                                    marginTop: "2px",
                                    color: "#3e3f40",
                                }}
                                >
                               Please note that there is no need to manually input the channel name, as it will be automatically displayed based on the applicant and the channel name you provided.
                                </p>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                            <img
                                src={banner} 
                                alt={`${company.company_name} visual representation`}
                                className='mt-3'
                                style={{
                                    width: '75%', 
                                    height: 'auto',
                                    marginBottom: '10px',  
                                    borderRadius: '10px', 
                                }}
                            />
                            </div>
                        </div>
                    </Container>
                </Modal.Body>
                <Modal.Footer
                style={{
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                    justifyContent: 'space-between'
                }}>
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

                    <Link
                        to={`/employer/publisher/${interviewDetails.application_id}/${interviewDetails.job_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
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
                        >
                            Join Meet
                        </Button>
                    </Link>
            </Modal.Footer>
            </Modal>
        </>
    );
};

export default EmployerInterviewConfirmed;
