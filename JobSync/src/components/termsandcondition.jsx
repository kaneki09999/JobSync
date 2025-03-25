import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import logo from '../assets/logo jobsync2.png';

const TermsAndConditions = ({ show, onClose, onAgree }) => {
  const [isTextVisible, setIsTextVisible] = useState(false);
  const lastParagraphRef = useRef(null); // Reference to the last paragraph

  const handleVisibility = (entries) => {
    const entry = entries[0];
    setIsTextVisible(entry.isIntersecting);
  };

  useEffect(() => {
    if (show) { // Only set up observer when modal is shown
      const observer = new IntersectionObserver(handleVisibility, {
        root: null, // observing relative to the viewport
        threshold: 0.8, // 80% of the element is visible
      });

      if (lastParagraphRef.current) {
        observer.observe(lastParagraphRef.current);
      }

      // Clean up observer when modal is hidden or component is unmounted
      return () => {
        if (lastParagraphRef.current) {
          observer.unobserve(lastParagraphRef.current);
        }
      };
    }
  }, [show]); // This effect runs every time 'show' changes

  // Reset the visibility state when the modal closes
  useEffect(() => {
    if (!show) {
      setIsTextVisible(false); // Reset the button state when modal is closed
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header style={{ backgroundColor: '#1863b9' }} closeButton={false}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: '60px', height: '60px', marginRight: '10px' }}
          />
          <Modal.Title style={{ color: 'white' }}>Terms and Conditions</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body
        style={{
          padding: '20px 40px',
          maxHeight: '60vh',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
        }}
      >
        <h5>Effective Date: August 26, 2024</h5>
        <p style={{ textAlign: 'justify' }}>
          Welcome to JobSync: Advanced Recruitment Platform with Integrated Video Interviewing and Face ID
          Verification ("JobSync"). By accessing or using our platform, you agree to comply with and be
          bound by these Terms and Conditions. Please read them carefully.
        </p>

        <h6>1. Acceptance of Terms</h6>
        <p style={{ textAlign: 'justify' }}>
          By registering for and using JobSync, you acknowledge that you have read, understood, and agreed to
          these Terms and Conditions. If you do not agree, please do not use our services.
        </p>

        <h6>2. Information You Provide</h6>
        <p style={{ textAlign: 'justify' }}>
          When using JobSync, you will be required to provide personal and professional information, including
          but not limited to:
        </p>
        <ul>
          <li>Full name, email address, and contact details</li>
          <li>Resume, educational background, and work experience</li>
          <li>Profile picture and identity verification documents (e.g., government-issued ID)</li>
          <li>Any other information necessary for job applications and recruitment processes</li>
        </ul>

        <h6>3. How We Use Your Information</h6>
        <p style={{ textAlign: 'justify' }}>
          By providing your information, you consent to JobSync using it for the following purposes:
        </p>
        <ul>
          <li>Facilitating job applications and employer-applicant interactions</li>
          <li>Verifying user identities and preventing fraudulent activities</li>
          <li>Enhancing user experience and platform functionality</li>
          <li>Communicating with you about job opportunities and updates</li>
          <li>Complying with legal and regulatory requirements</li>
        </ul>

        <h6>4. Information Sharing</h6>
        <p style={{ textAlign: 'justify' }}>We may share your information with:</p>
        <ul>
          <li>Employers and Recruiters: To connect you with job opportunities</li>
          <li>Third-Party Services: For identity verification, email notifications, or background checks</li>
        </ul>
        <p style={{ textAlign: 'justify' }}>We do not sell your personal information to third parties.</p>

        <h6>5. User Responsibilities</h6>
        <p style={{ textAlign: 'justify' }}>By using JobSync, you agree to:</p>
        <ul>
          <li>Provide accurate and up-to-date information</li>
          <li>Keep your login credentials secure</li>
          <li>Not share misleading or false information</li>
          <li>Use the platform solely for job-seeking and recruitment purposes</li>
        </ul>

        <h6>6. Data Security</h6>
        <p style={{ textAlign: 'justify' }}>
          We implement security measures to protect your personal data. However, we cannot guarantee absolute
          security. You acknowledge and accept any potential risks associated with sharing information online.
        </p>

        <h6>7. Account Termination</h6>
        <p style={{ textAlign: 'justify' }}>JobSync reserves the right to suspend or terminate your account if you:</p>
        <ul>
          <li>Violate these Terms and Conditions</li>
          <li>Provide false or misleading information</li>
          <li>Engage in fraudulent or inappropriate activities</li>
        </ul>

        <h6>8. Updates to Terms</h6>
        <p style={{ textAlign: 'justify' }}>
          JobSync may update these Terms and Conditions at any time. Continued use of the platform after updates
          constitutes acceptance of the new terms.
        </p>

        <h6>9. Contact Us</h6>
        <p style={{ textAlign: 'justify' }}>For inquiries or concerns regarding these Terms and Conditions, contact us at me.jobsync@gmail.com.</p>
        
        <p 
          ref={lastParagraphRef} 
          style={{ textAlign: 'justify' }}
        >
          By using JobSync, you confirm that you have read and agreed to these Terms and Conditions.
        </p>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'center' }}>
        <Button
          variant="primary"
          onClick={() => {
            onAgree();  // Trigger the onAgree function passed from the parent component
          }}
          disabled={!isTextVisible}
          style={{
            padding: '8px 30px',
            fontSize: '1.1rem',
            transition: 'opacity 0.3s ease',
          }}
        >
          Agree
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TermsAndConditions;
