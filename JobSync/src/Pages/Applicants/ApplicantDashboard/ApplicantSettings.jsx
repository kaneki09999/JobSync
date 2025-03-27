import React, { useState, useRef } from 'react';
import { Tabs, Tab, Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import { FaKey, FaUser, FaIdCard } from 'react-icons/fa'; 
import ApplicantsSidebar from '../../../components/applicantsidebar';
import PasswordSettings from './PasswordSettings';
import AccountSettings from './AccountSettings';
import { FaBars } from 'react-icons/fa';
import IDVerification from './IdVerification';

export default function ApplicantSettings() {
  const [activeKey, setActiveKey] = useState('passwordsettings');
  const fileInputRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const tabStyles = (isActive) => ({
    color: isActive ? '#0A65CC' : '#757575',
  });

  return (
    <>
    <Container style={{marginTop: '3rem'}}>
      <Row>
          <Col lg={3} className="applicant-sidebar vh-100 p-3 d-none d-lg-block" style={{background: '#e6f3ff'}}>
                    <ApplicantsSidebar />
                </Col>
                {/* Sidebar Toggle Button (Small Screens) */}
                <Col xs={12} className="d-lg-none" style={{display: 'flex'}}>
                    <Button
                        variant="link"
                        onClick={() => setShowSidebar(true)}
                        style={{
                            position: "relative",
                            left: "0",
                            color: "#333", 
                            fontSize: "24px", 
                            padding: "5px"
                        }}
                    >
                        <FaBars />
                    </Button>
                </Col>


                {/* Offcanvas Sidebar (Small Screens) */}
                <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Applicant Dashboard</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ApplicantsSidebar />
                    </Offcanvas.Body>
                </Offcanvas>
        
                <Col xs={12} md={9} lg={9} className="px-0" style={{marginTop: '1rem'}}>
                  <Tabs
                    activeKey={activeKey}
                    onSelect={(k) => setActiveKey(k)}
                    id="applicant-tabs"
                    className="px-3 mt-4"
                  >
                    <Tab
                      eventKey="passwordsettings"
                      title={
                        <div style={{ width: '100%', textAlign: 'left' }}>
                          <FaKey style={{ marginRight: '8px', ...tabStyles(activeKey === 'passwordsettings') }} />
                          <span style={tabStyles(activeKey === 'passwordsettings')}>Password Settings</span>
                        </div>
                      }
                    >
                      <PasswordSettings />
                    </Tab>

                    <Tab
                      eventKey="accountsettings"
                      title={
                        <div style={{ width: '100%', textAlign: 'left' }}>
                          <FaUser style={{ marginRight: '8px', ...tabStyles(activeKey === 'accountsettings') }} />
                          <span style={tabStyles(activeKey === 'accountsettings')}>Account Settings</span>
                        </div>
                      }
                    >
                      <AccountSettings />
                    </Tab>

                    <Tab
                      eventKey="idverification"
                      title={
                        <div style={{ width: '100%', textAlign: 'left' }}>
                          <FaIdCard style={{ marginRight: '8px', ...tabStyles(activeKey === 'idverification') }} />
                          <span style={tabStyles(activeKey === 'idverification')}>ID Verification</span>
                        </div>
                      }
                    >
                      <IDVerification />
                    </Tab>
                  </Tabs>
                </Col>
      </Row>
    </Container>
    <style>{`
    #root {
      width: 100%;
    }
    `}</style>
    </>
  );
}
