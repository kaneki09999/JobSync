import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AssessmentModal = ({ show, onClose, applicationId, jobId }) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Assessment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Application ID:</strong> {applicationId}</p>
                <p><strong>Job ID:</strong> {jobId}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AssessmentModal;
