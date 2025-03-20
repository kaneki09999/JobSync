import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import { FaBuilding, FaCalendar, FaLink, FaGraduationCap } from 'react-icons/fa';
import AddressInfo from '../../Pages/Applicants/ApplicantProfile/address';
import Socmedlinks from '../../pages/applicants/applicantprofile/socmedlinks';
import Qualifications from '../../Pages/Applicants/ApplicantProfile/qualifications';
import Personal from './ApplicantProfile/personal';

export default function ApplicantProfile() {
  const [activeKey, setActiveKey] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const tabStyles = (isActive) => ({
    color: isActive ? '#0A65CC' : '#757575',
  });

  if (isLoading) {
    return (
      <div id="preloader" className="d-flex justify-content-center align-items-center">
        {/* Add preloader content or spinner here */}
      </div>
    );
  }

  return (
    <>
    <Container style={{ marginTop: '8rem' }}>
      {/* Tab Bar Container */}
      <div className="border-bottom mb-4">
        <Tabs
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k)}
          id="applicant-tabs"
          className="px-4"
          style={{ width: '100%' }}
        >
          <Tab
            eventKey="personal"
            style={{
              background: 'linear-gradient(49deg, rgba(232,242,255,1) 0%, rgba(255,255,255,1) 45%)',
              borderRadius: '8px',
              boxShadow: '0px 4px 11px rgba(0, 0, 0, 0.2)',
              
            }}
            title={
              <div style={{ width: '160px', textAlign: 'left' }}>
                <FaBuilding style={{ marginRight: '10px', ...tabStyles(activeKey === 'personal') }} />
                <span style={tabStyles(activeKey === 'personal')}>Personal</span>
              </div>
            }
            className="p-3"
          >
            <Personal />
          </Tab>

          <Tab
            eventKey="address"
            style={{
              background: 'linear-gradient(49deg, rgba(232,242,255,1) 0%, rgba(255,255,255,1) 45%)',
              borderRadius: '8px',
              boxShadow: '0px 4px 11px rgba(0, 0, 0, 0.2)'
            }}
            title={
              <div style={{ width: '160px', textAlign: 'left' }}>
                <FaCalendar style={{ marginRight: '10px', ...tabStyles(activeKey === 'address') }} />
                <span style={tabStyles(activeKey === 'address')}>Address</span>
              </div>
            }
            className="p-3"
          >
            <AddressInfo />
          </Tab>

          <Tab
            eventKey="socmedlinks"
            style={{
              background: 'linear-gradient(49deg, rgba(232,242,255,1) 0%, rgba(255,255,255,1) 45%)',
              borderRadius: '8px',
              boxShadow: '0px 4px 11px rgba(0, 0, 0, 0.2)'
            }}
            title={
              <div style={{ width: '200px', textAlign: 'left' }}>
                <FaLink style={{ marginRight: '10px', ...tabStyles(activeKey === 'socmedlinks') }} />
                <span style={tabStyles(activeKey === 'socmedlinks')}>Social Media Links</span>
              </div>
            }
            className="p-3"
          >
            <Socmedlinks />
          </Tab>

          <Tab
            eventKey="qualifications"
            style={{
              background: 'linear-gradient(49deg, rgba(232,242,255,1) 0%, rgba(255,255,255,1) 45%)',
              borderRadius: '8px',
              boxShadow: '0px 4px 11px rgba(0, 0, 0, 0.2)'
            }}
            title={
              <div style={{ width: '200px', textAlign: 'left' }}>
                <FaGraduationCap style={{ marginRight: '10px', ...tabStyles(activeKey === 'qualifications') }} />
                <span style={tabStyles(activeKey === 'qualifications')}>Qualifications</span>
              </div>
            }
            className="p-3"
          >
            <Qualifications />
          </Tab>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className="mt-4">
        {/* Tab content will render here */}
      </div>
    </Container>
    <style>{`
    #root {
      width: 100% !important;
    }
    `}</style>
</>
  );
}
