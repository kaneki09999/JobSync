import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomerSupport = () => {
  const [issueType, setIssueType] = useState('');
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      issueType,
      subject,
      question,
      attachment,
    });
    alert('Form submitted successfully!');
  };

  return (
    <Container className="mt-3">
      <Row className="g-4 align-items-center" style={{textAlign: 'start'}}>
        {/* Form Column (Left Side) */}
        <Col md={6} xs={12}>
          <div className="d-flex align-items-center mb-3">
            <img
              src="/src/assets/logo jobsync2.png"
              alt="Support Icon"
              className="me-2"
              style={{ width: '100px', height: 'auto' }}
            />
            <h3 className="mb-0">JobSync Support</h3>
          </div>
          <p className="fw-bold">me.jobsync@gmail.com</p>
          <Form onSubmit={handleSubmit}>
            {/* Issue Type */}
            <Form.Group className="mb-3" controlId="issueType">
              <Form.Label>Issue Type <span className="text-danger">*</span></Form.Label>
              <Form.Select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
                <option value="">--</option>
                <option value="Account Issue">Account Issue</option>
                <option value="Technical Problem">Technical Problem</option>
                <option value="Billing Inquiry">Billing Inquiry</option>
              </Form.Select>
            </Form.Group>

            {/* Subject */}
            <Form.Group className="mb-3" controlId="subject">
              <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
              <Form.Control type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </Form.Group>

            {/* Question */}
            <Form.Group className="mb-3" controlId="question">
              <Form.Label>Your Question <span className="text-danger">*</span></Form.Label>
              <Form.Control as="textarea" rows={5} value={question} onChange={(e) => setQuestion(e.target.value)} required />
            </Form.Group>

            {/* Attachment */}
            <Form.Group className="mb-3" controlId="attachment">
              <Form.Label className="text-primary" style={{ cursor: 'pointer' }}>📎 Add an attachment</Form.Label>
              <Form.Control type="file" onChange={(e) => setAttachment(e.target.files[0])} />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
          
          {/* Note */}
          <p className="text-muted small mt-3">
            In order to answer your question or troubleshoot a problem, a JobSync representative may need to access
            your account, including, as needed, your messages and settings.
          </p>
        </Col>

        {/* Image Column (Right Side) */}
        <Col md={6} xs={12} className="d-flex justify-content-center align-items-center">
          <img
            src="/src/assets/customersupport.png"
            alt="Customer Support"
            className="img-fluid"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerSupport;
