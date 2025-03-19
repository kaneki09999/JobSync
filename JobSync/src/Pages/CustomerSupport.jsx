import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { MdEmail } from 'react-icons/md'; // Import email icon
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
      <Row className="g-4 align-items-center" style={{ textAlign: 'start' }}>
        {/* Form Column (Left Side) */}
        <Col md={6} xs={12}>
          <div className="d-flex align-items-center mb-3">
            <img
              src="/src/assets/logo jobsync2.png"
              alt="Support Icon"
              className="me-2"
              style={{ width: '100px', height: 'auto' }}
            />
            <h3 className="mb-0" style={{ color: 'black' }}>JobSync Support</h3>
          </div>

          {/* Email with Icon */}
          <p className="fw-bold d-flex align-items-center" style={{ color: 'black' }}>
            <MdEmail className="me-2" style={{ fontSize: '1.5rem' , color: 'black' }} />
            me.jobsync@gmail.com
          </p>

          {/* Form Container with Radial Gradient Background and Box Shadow */}
          <Container 
            className="border p-4 rounded"
            style={{
              background: "#1863b9",
              boxShadow: "box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;",
            }}
          >
            <Form onSubmit={handleSubmit}>
              {/* Issue Type */}
              <Form.Group className="mb-3" controlId="issueType">
                <Form.Label style={{ color: 'white' }}>Issue Type <span className="text-danger">*</span></Form.Label>
                <Form.Select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
                  <option value="">--</option>
                  <option value="Account Issue">Account Issue</option>
                  <option value="Technical Problem">Technical Problem</option>
                  <option value="Billing Inquiry">Billing Inquiry</option>
                </Form.Select>
              </Form.Group>

              {/* Subject */}
              <Form.Group className="mb-3" controlId="subject">
                <Form.Label style={{ color: 'white' }}>Subject <span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </Form.Group>

              {/* Question */}
              <Form.Group className="mb-3" controlId="question">
                <Form.Label style={{ color: 'white' }}>Your Question <span className="text-danger">*</span></Form.Label>
                <Form.Control as="textarea" rows={5} value={question} onChange={(e) => setQuestion(e.target.value)} required />
              </Form.Group>

              {/* Attachment */}
              <Form.Group className="mb-3" controlId="attachment">
                <Form.Label style={{ cursor: 'pointer', color: 'white' }}>📎 Add an attachment</Form.Label>
                <Form.Control type="file" onChange={(e) => setAttachment(e.target.files[0])} />
              </Form.Group>

              {/* Submit Button aligned to the right */}
              <Row>
                <Col className="text-end">
                  <Button style={{ backgroundColor: '#ffbd00' , borderColor: '#ffbd00', color: 'black'}} type="submit">Submit</Button>
                </Col>
              </Row>
            </Form>
          </Container>

          {/* Note */}
          <p className="text-muted small mt-3" style={{ color: 'white' }}>
            In order to answer your question or troubleshoot a problem, a JobSync representative may need to access
            your account, including, as needed, your messages and settings.
          </p>
        </Col>

        {/* Image Column (Right Side) */}
        <Col md={6} xs={12} className="d-flex justify-content-center align-items-center position-relative">
          <div style={{ textAlign: 'center', margin: '2rem 0', position: 'relative', display: 'inline-block' }}>
            <img
              src="https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148887720.jpg?t=st=1742275911~exp=1742279511~hmac=560c110fd80b5dc3666a2ef760ae3d6abfebb042c4c14a2eb20c7a02b1678534&w=740"
              alt="Select a job"
              title="https://www.freepik.com/"
              style={{
                maxWidth: '100%',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                color: '#000000',
                padding: '4px 8px',
                borderRadius: '5px',
                fontSize: '0.8rem',
              }}
            >
              Image by{' '}
              <a
                href="https://www.freepik.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0d6efd', textDecoration: 'none' }}
              >
                Freepik
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerSupport;
