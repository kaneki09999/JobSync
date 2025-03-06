import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { postToEndpoint } from './apiService';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import banner  from '../assets/employerbanner.png'

const RescheduleMessage = ({ show, handleClose, application_id, job_id }) => {
    const [interview, setInterview] = useState([]);
    const [company, setCompany] = useState([]);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await postToEndpoint('/getCompanyName.php', {
                    job_id
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
    }, [job_id]);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await postToEndpoint('/getInterviewSchedule.php', {
                    application_id,
                    job_id,
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
    }, [ application_id, job_id]);

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Reschedule Interview</Modal.Title>
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
                                    <h6 className="no-margin text-start">Previous Interview Schedule</h6>
                                    <h6 className="no-margin text-start" style={{ display: 'flex' }}>Date: <p style={{ marginLeft: '5px', marginBottom: '0px' }}>{interview.schedule}</p></h6>
                                    <h6 className="no-margin text-start" style={{ display: 'flex' }}>Time: <p style={{ marginLeft: '5px', marginBottom: '0px' }}>{interview.time}</p></h6>
                                </div>
                            </div>
                        </Col>
                    </Row>
                <p>Application ID: {application_id}</p>
                <p>Job ID: {job_id}</p>
                <p>The interview needs to be rescheduled. Please confirm or cancel.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => console.log('Reschedule confirmed')}>
                    Confirm Reschedule
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RescheduleMessage;
