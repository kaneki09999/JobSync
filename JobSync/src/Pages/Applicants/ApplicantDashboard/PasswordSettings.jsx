import React, { useState } from 'react';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';

export default function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  return (
    <Container fluid className="mt-4 px-3">
      <Row className="justify-content-start" style={{padding: '15px'}}>
        <Col xs={12} md={8} lg={6}>
          <h4 className="text-start">Change Password</h4>

          <Form className="mt-3">
            <Form.Group controlId="currentPassword" className="mb-3">
              <Form.Label className="text-start w-100">Current Password</Form.Label>
              <Form.Control
                className="register1"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="newPassword" className="mb-3">
              <Form.Label className="text-start w-100">New Password</Form.Label>
              <Form.Control
                className="register1"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="confirmNewPassword" className="mb-4">
              <Form.Label className="text-start w-100">Confirm New Password</Form.Label>
              <Form.Control
                className="register1"
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Form.Group>

            <div className="text-start">
              <Button
                type="submit"
                className="mt-3"
                style={{ width: '100%', maxWidth: '200px', height: '48px', background: '#0a65cc' }}
              >
                Update Password
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
