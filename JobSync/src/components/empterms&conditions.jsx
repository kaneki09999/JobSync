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
        <h5>Effective Date: [Insert Date]</h5>
        <p style={{ textAlign: 'justify' }}>
          Welcome to JobSync: Advanced Recruitment Platform with Integrated Video Interviewing and Face ID
          Verification ("JobSync"). By registering as an employer and using our platform, you agree to comply with and be
          bound by these Terms and Conditions. Please read them carefully.
        </p>

        <h6>1. Acceptance of Terms</h6>
        <p style={{ textAlign: 'justify' }} >
          By creating an employer account and posting job opportunities on JobSync, you acknowledge that you have read, understood, and agreed to
          these Terms and Conditions. If you do not agree, please do not use our services.
        </p>

        <h6>2. Information You Provide</h6>
        <p style={{ textAlign: 'justify' }}>
          As an employer using JobSync, you are required to provide the following information:
        </p>
        <ul>
          <li>Company Details: Business name, industry, location, and company profile</li>
          <li>Contact Information: Name, email address, phone number, and job role of the recruiter</li>
          <li>Job Postings: Job titles, descriptions, qualifications, salary range, and employment type</li>
          <li>Company Logo and Branding: To be displayed in job postings</li>
          <li>Verification Documents: Business registration, tax identification, or other proof of legitimacy</li>
        </ul>

        <h6>3. How We Use Your Information</h6>
        <p style={{ textAlign: 'justify' }}>
          By providing your information, you consent to JobSync using it for the following purposes:
        </p>
        <ul>
          <li>Displaying job postings to potential applicants</li>
          <li>Facilitating communication between employers and job seekers</li>
          <li>Verifying employer authenticity and preventing fraudulent job offers</li>
          <li>Sending notifications about job applications and platform updates</li>
          <li>Complying with legal and regulatory requirements</li>
        </ul>

        <h6>4. Information Sharing</h6>
        <p style={{ textAlign: 'justify' }}>
          We may share your information with:
        </p>
        <ul>
          <li>Job Seekers: To display job postings and enable applications</li>
          <li>Third-Party Services: For business verification, email notifications, or background checks</li>
          <li>Legal Authorities: If required by law, court orders, or regulatory obligations</li>
        </ul>
        <p style={{ textAlign: 'justify' }}>We do not sell your business or personal information to third parties.</p>

        <h6>5. Employer Responsibilities</h6>
        <p style={{ textAlign: 'justify' }}>As an employer on JobSync, you agree to:</p>
        <ul>
          <li>Provide accurate and truthful company and job details</li>
          <li>Ensure job postings comply with labor laws and ethical recruitment practices</li>
          <li>Respect applicant privacy and use their information only for hiring purposes</li>
          <li>Not engage in fraudulent, misleading, or exploitative recruitment practices</li>
          <li>Use the platform professionally and refrain from inappropriate conduct</li>
        </ul>

        <h6>6. Prohibited Activities</h6>
        <p style={{ textAlign: 'justify' }}>
          Employers are strictly prohibited from:
        </p>
        <ul>
          <li>Posting fake, deceptive, or misleading job offers</li>
          <li>Collecting job seekers' personal data for non-recruitment purposes</li>
          <li>Charging applicants any fees for job applications or employment consideration</li>
          <li>Engaging in discrimination based on gender, race, religion, or other protected characteristics</li>
        </ul>

        <h6>7. Data Security</h6>
        <p style={{ textAlign: 'justify' }}>
          We implement security measures to protect employer and job seeker data. However, we cannot guarantee absolute security. Employers acknowledge and accept potential risks associated with sharing information online.
        </p>

        <h6>8. Account Suspension and Termination</h6>
        <p style={{ textAlign: 'justify' }}>
          JobSync reserves the right to suspend or terminate employer accounts if they:
        </p>
        <ul>
          <li>Violate these Terms and Conditions</li>
          <li>Post misleading, fraudulent, or illegal job advertisements</li>
          <li>Engage in unethical or exploitative hiring practices</li>
          <li>Fail to comply with labor laws and platform policies</li>
        </ul>

        <h6>9. Updates to Terms</h6>
        <p style={{ textAlign: 'justify' }}>
          JobSync may update these Terms and Conditions at any time. Continued use of the platform after updates constitutes acceptance of the new terms.
        </p>

        <h6>10. Contact Us</h6>
        <p style={{ textAlign: 'justify' }}>
          For inquiries or concerns regarding these Terms and Conditions, contact us at [Insert Contact Email].
        </p>
        <p style={{ textAlign: 'justify', textIndent: '30px'  }}>
          For inquiries or concerns regarding these Terms and Conditions, contact us at me.jobsync@gmail.com.
        </p>

        
        <p ref={lastParagraphRef} style={{ textAlign: 'justify' }}>
          By using JobSync, you confirm that you have read and agreed to these Terms and Conditions.
        </p>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'center' }}>
        <Button
          variant="primary"
          onClick={() => {
            onAgree();  
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
