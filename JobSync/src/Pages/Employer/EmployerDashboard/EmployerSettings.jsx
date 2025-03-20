import React, { useState } from 'react';
import { Tabs, Tab, Row, Col, Container, Offcanvas, Button } from 'react-bootstrap';
import { FaBuilding, FaCalendar, FaLink, FaCogs } from 'react-icons/fa';
import CompanySettings from '../../../pages/employer/employerdashboard/employersettings/companysettings';
import FoundingInfo from '../../../pages/employer/employerdashboard/employersettings/foundingsettings';
import SocialMediaInfo from '../../../pages/employer/employerdashboard/employersettings/socmedsettings';
import AccountSettings from '../../../pages/employer/employerdashboard/employersettings/accountsettings';
import EmployerSidebar from '../../../components/employersidebar';
import { FaBars } from "react-icons/fa";

export default function EmployerSettings() {
  const [activeKey, setActiveKey] = useState('companysettings');

  const tabStyles = (isActive) => ({
    color: isActive ? '#0A65CC' : '#757575',
  });
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
     <style>{`
      #root {
        width: 100% !important;
      }
  `}</style>
    <Container style={{marginTop: '3rem'}}> 
      <Row className="m-0">
      {/* Sidebar */}
      <Col lg={3} className="applicant-sidebar vh-100 p-3 d-none d-lg-block" style={{background: '#e6f3ff'}}>
                          <EmployerSidebar />
                      </Col>
                      {/* Sidebar Toggle Button (Small Screens) */}
                      <Col xs={12} className="d-lg-none" style={{display: 'flex'}}>
                          <Button
                              variant="link"
                              onClick={() => setShowSidebar(true)}
                              style={{
                                  position: "relative",
                                  left: "0",
                                  color: "#333", // Dark color
                                  fontSize: "24px", // Bigger icon
                                  padding: "5px"
                              }}
                          >
                              <FaBars />
                          </Button>
                      </Col>
                      {/* Offcanvas Sidebar (Small Screens) */}
                      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
                          <Offcanvas.Header closeButton>
                              <Offcanvas.Title>Employer Dashboard</Offcanvas.Title>
                          </Offcanvas.Header>
                          <Offcanvas.Body>
                              <EmployerSidebar />
                          </Offcanvas.Body>
                      </Offcanvas>
      {/* Main Content */}
      <Col lg={9} className="p-4">
        <h3 className="ms-4">Employer Settings</h3>

        <Tabs
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k)}
          id="employer-tabs"
          className="px-4 mt-4"
        >
          <Tab
            eventKey="companysettings"
            title={
              <span>
                <FaBuilding className="me-2" style={tabStyles(activeKey === "companysettings")} />
                <span style={tabStyles(activeKey === "companysettings")}>Company Settings</span>
              </span>
            }
          >
            <CompanySettings />
          </Tab>

          <Tab
            eventKey="foundingInfo"
            title={
              <span>
                <FaCalendar className="me-2" style={tabStyles(activeKey === "foundingInfo")} />
                <span style={tabStyles(activeKey === "foundingInfo")}>Founding Info</span>
              </span>
            }
          >
            <FoundingInfo />
          </Tab>

          <Tab
            eventKey="socialMediaInfo"
            title={
              <span>
                <FaLink className="me-2" style={tabStyles(activeKey === "socialMediaInfo")} />
                <span style={tabStyles(activeKey === "socialMediaInfo")}>Social Media Info</span>
              </span>
            }
          >
            <SocialMediaInfo />
          </Tab>

          <Tab
            eventKey="accountSettings"
            title={
              <span>
                <FaCogs className="me-2" style={tabStyles(activeKey === "accountSettings")} />
                <span style={tabStyles(activeKey === "accountSettings")}>Account Settings</span>
              </span>
            }
          >
            <AccountSettings />
          </Tab>
        </Tabs>
      </Col>
      </Row>
  </Container>
 
  </>
  );
}
