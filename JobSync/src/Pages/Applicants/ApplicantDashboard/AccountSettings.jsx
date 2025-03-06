import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Row, Col, Image, InputGroup } from 'react-bootstrap';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaBriefcase } from 'react-icons/fa';
import { left } from '@popperjs/core';

const FileUpload = ({ label, required, onChange, imageSrc }) => (
  <Form.Group controlId={`form${label.replace(' ', '')}`} className="text-start">
    <Form.Label>
      {label} {required && <span style={{ color: 'red' }}>*</span>}
    </Form.Label>
    <Form.Control type="file" accept="image/*" onChange={onChange} />
    {imageSrc && (
      <Image
        src={imageSrc}
        alt={label}
        className="mt-3"
        thumbnail
        style={{ width: label === 'Upload Company Logo' ? '150px' : '100%', height: 'auto' }}
      />
    )}
  </Form.Group>
);

const AccountSettings = () => {
  const [logo, setLogo] = useState(null);
  const [contactNumber, setContactNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [mapLocation, setMapLocation] = useState('');
  const [profilePrivacy, setProfilePrivacy] = useState(true);
  const [resumePrivacy, setResumePrivacy] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ logo, contactNumber, emailAddress, mapLocation });
  };

  return (
    <Container fluid className="text-start px-3 py-4 padds">
      <Form onSubmit={handleSubmit}>
      <Row className="mb-4">
        <Col xs={12} sm={6}>
          <Form.Group controlId="formMapLocation">
            <Form.Label>Map Location <span style={{ color: 'red' }}>*</span></Form.Label>
            <InputGroup>
              <InputGroup.Text><FaMapMarkerAlt /></InputGroup.Text>
              <Form.Control
                style={{paddingLeft: '40px'}}
                type="text"
                className='register1'
                placeholder="Enter map location"
                value={mapLocation}
                onChange={(e) => setMapLocation(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6}>
          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number <span style={{ color: 'red' }}>*</span></Form.Label>
            <InputGroup>
              <InputGroup.Text><FaPhoneAlt /></InputGroup.Text>
              <Form.Control
                type="tel"
                style={{paddingLeft: '40px'}}
                className='register1'
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12}>
          <Form.Group controlId="formEmailAddress">
            <Form.Label>Email Address <span style={{ color: 'red' }}>*</span></Form.Label>
            <InputGroup>
              <InputGroup.Text><FaEnvelope /></InputGroup.Text>
              <Form.Control
                type="email"
                style={{paddingLeft: '40px'}}
                className='register1'
                placeholder="Enter email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>


        <Row className="mb-4">
          <Col className="d-grid">
            <Button type="submit" className="btn btn-primary" style={{width: '200px', backgroundColor: '#0A65CC', height: '48px'}}>Save Changes</Button>
          </Col>
        </Row>

        <hr className="my-4" />

        <h5>Notification</h5>
        <Row>
          <Col xs={12} sm={6}>
            <Form.Check type="checkbox" label="Notify on job updates" />
            <Form.Check type="checkbox" label="Notify on employer activity" />
            <Form.Check type="checkbox" label="Notify on profile views" />
          </Col>
          <Col xs={12} sm={6}>
            <Form.Check type="checkbox" label="Notify on new job matches" />
            <Form.Check type="checkbox" label="Notify on job alerts" />
          </Col>
        </Row>

        <hr className="my-4" />

        <h5>Job Alerts</h5>
        <Row>
          <Col xs={12} sm={6}>
            <Form.Label>Role</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaBriefcase /></InputGroup.Text>
              <Form.Control type="text" style={{paddingLeft: '40px'}} className='register1' placeholder="Your job roles" />
            </InputGroup>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Label>Location</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaMapMarkerAlt /></InputGroup.Text>
              <Form.Control type="text" style={{paddingLeft: '40px'}} className='register1' placeholder="City, state, country name" />
            </InputGroup>
          </Col>
        </Row>

        <hr className="my-4" />

        <h5>Profile Privacy</h5>
        <Row className="mb-4">
          <Col xs={6} className="d-flex align-items-center">
            <Form.Check
              type="switch"
              id="profile-privacy"
              checked={profilePrivacy}
              onChange={() => setProfilePrivacy(!profilePrivacy)}
              label={profilePrivacy ? "YES" : "NO"}
            />
            <span className="ms-2">Your profile is {profilePrivacy ? "public" : "private"} now</span>
          </Col>
          <Col xs={6} className="d-flex align-items-center">
            <Form.Check
              type="switch"
              id="resume-privacy"
              checked={resumePrivacy}
              onChange={() => setResumePrivacy(!resumePrivacy)}
              label={resumePrivacy ? "YES" : "NO"}
            />
            <span className="ms-2">Your resume is {resumePrivacy ? "public" : "private"} now</span>
          </Col>
        </Row>

        <hr className="my-4" />

        <h5>Delete Account</h5>
        <p className="text-muted">
          If you delete your JobSync account, you will no longer be able to get information about matched jobs,
          following employers, and job alerts. You will be removed from all services of JobSync.com.
        </p>
        <Row>
          <Col className="d-grid">
            <Button type="button" className="btn btn-danger" style={{ width: '200px', backgroundColor: '#D9534F', height: '48px' , border: 'none' }}>Delete Account</Button>
          </Col>
        </Row>
      </Form>
      <style>{`
        .padds {
          padding: 20px !important
        }
      `}</style>
    </Container>
  );
};

export default AccountSettings;
