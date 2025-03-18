import React, { useEffect } from 'react';
import createAccount from '../assets/pic1.png';
import uploadCV from '../assets/pic2.png'; 
import findJob from '../assets/pic3.png';
import applyJob from '../assets/pic4.png';
import videoCall from '../assets/pic5.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const JobSyncFlow = () => {
  useEffect(() => {
    // Initialize AOS with specific options
    AOS.init({
      duration: 1000,      // Animation duration
      once: false,         // Animation will repeat each time the element comes into view
      offset: 200,         // Start the animation 200px before the element comes into the viewport
      delay: 100,          // Delay between animations for better sequential animation
    });

    // To refresh AOS on scroll
    window.addEventListener('scroll', AOS.refresh);
    return () => window.removeEventListener('scroll', AOS.refresh);
  }, []);

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };

  const descriptionStyle = {
    fontSize: '20px',
    lineHeight: '1.6',
  };

  const jobSyncFlowStyle = {
    textAlign: 'center',
  };

  const iconStyle = {
    width: '50%',
    height: '50%',
    marginRight: '20px',
  };

  const imageContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '50px',
    marginBottom: '50px', // Add bottom margin for spacing between sections
  };

  const descriptionContainerStyle = {
    maxWidth: '600px',
    textAlign: 'left',
    paddingLeft: '20px', // Add padding to the left to separate text from the image
  };

  const headerStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '18px',
  };

  const sectionStyle = {
    marginBottom: '60px',  // Increased margin bottom to create space between sections
  };

  return (
    <div className="container my-5" style={containerStyle}>
      <div style={jobSyncFlowStyle} className="text-center mb-4">
        <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>How JobSync Works?</h2>
      </div>

      {/* Create Account Section */}
      <div style={sectionStyle}>
        <div style={imageContainerStyle}>
          <img
            src={createAccount}
            alt="Create account"
            style={iconStyle}
            data-aos="fade-left"
          />
          <div style={descriptionContainerStyle} data-aos="fade-right">
            <h3 style={headerStyle}>Create Account</h3>
            <p style={descriptionStyle}>
              Sign up to JobSync by creating a new account to access the best
              features. It only takes a few steps to get started.
            </p>
          </div>
        </div>
      </div>

      {/* Upload CV/Resume Section */}
      <div style={sectionStyle}>
        <div style={imageContainerStyle}>
          <img
            src={uploadCV}
            alt="Upload CV/Resume"
            style={iconStyle}
            data-aos="fade-left"
          />
          <div style={descriptionContainerStyle} data-aos="fade-right">
            <h3 style={headerStyle}>Upload CV/Resume</h3>
            <p style={descriptionStyle}>
              Upload your CV or resume to make your profile complete and ready
              for job applications. This is your key to landing great opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Find Suitable Job Section */}
      <div style={sectionStyle}>
        <div style={imageContainerStyle}>
          <img
            src={findJob}
            alt="Find Suitable Job"
            style={iconStyle}
            data-aos="fade-left"
          />
          <div style={descriptionContainerStyle} data-aos="fade-right">
            <h3 style={headerStyle}>Find Suitable Job</h3>
            <p style={descriptionStyle}>
              Browse through a wide variety of job listings tailored to your
              skills and experience. Find the best fit for your career.
            </p>
          </div>
        </div>
      </div>

      {/* Apply Job Section */}
      <div style={sectionStyle}>
        <div style={imageContainerStyle}>
          <img
            src={applyJob}
            alt="Apply Job"
            style={iconStyle}
            data-aos="fade-left"
          />
          <div style={descriptionContainerStyle} data-aos="fade-right">
            <h3 style={headerStyle}>Apply for Jobs</h3>
            <p style={descriptionStyle}>
              Easily apply for jobs that match your profile with just a click
              of a button. Let your next job be closer than ever!
            </p>
          </div>
        </div>
      </div>

      {/* Interview Through Video Call Section */}
      <div style={sectionStyle}>
        <div style={imageContainerStyle}>
          <img
            src={videoCall}
            alt="Interview Through Video Call"
            style={iconStyle}
            data-aos="fade-left"
          />
          <div style={descriptionContainerStyle} data-aos="fade-right">
            <h3 style={headerStyle}>Interview Through Video Call</h3>
            <p style={descriptionStyle}>
              Prepare for and attend job interviews through video calls from
              the comfort of your home. Connect with potential employers
              virtually!
            </p>
          </div>
        </div>
      </div>
      

    </div>
  );
};



export default JobSyncFlow;
