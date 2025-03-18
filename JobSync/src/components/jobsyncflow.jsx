import React, { useEffect, useState } from 'react';
import createAccount from '../assets/pic1.png';
import uploadCV from '../assets/pic2.png'; 
import findJob from '../assets/pic3.png';
import applyJob from '../assets/pic4.png';
import videoCall from '../assets/pic5.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const JobSyncFlow = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,      
      once: false,          
      offset: 200,         
      delay: 100,          
    });

    // Check if mobile on load
    checkIfMobile();
    
    // Add resize event listener
    window.addEventListener('resize', checkIfMobile);
    window.addEventListener('scroll', AOS.refresh);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('scroll', AOS.refresh);
    };
  }, []);

  // Function to check if screen is mobile size
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // Image credit style
  const creditStyle = {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    marginTop: '8px',
    fontStyle: 'italic',
  };

  return (
    <>
    <div className="container my-5" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    }}>
      <div className="text-center mb-4">
        <h2 style={{ fontSize: isMobile ? '30px' : '40px', fontWeight: 'bold' }}>How JobSync Works?</h2>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <hr style={{width: '50%'}}/>
        </div>
      </div>

      {/* Create Account Section */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'center', 
          justifyContent: 'flex-start',
          marginTop: '50px',
          marginBottom: '50px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: isMobile ? '80%' : '50%' }} data-aos={isMobile ? "fade-up" : "fade-left"}>
            <img
              src={createAccount}
              alt="Create account"
              style={{
                width: '100%',
                height: 'auto',
                marginRight: isMobile ? '0' : '20px',
                marginBottom: '8px',
              }}
              
            />
            <p style={creditStyle}>Image by: <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>Freepik</a></p>
          </div>
          <div style={{
            maxWidth: isMobile ? '100%' : '600px',
            textAlign: isMobile ? 'center' : 'left',
            paddingLeft: isMobile ? '0' : '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobile ? 'flex-start' : 'center',  
            height: isMobile ? 'auto' : '100%',
          }} data-aos={isMobile ? "fade-up" : "fade-right"}>
            <h3 style={{ 
              fontSize: isMobile ? '28px' : '35px', 
              fontWeight: 'bold', 
              marginBottom: '18px',
            }}>Create Account</h3>
            <p style={{ fontSize: isMobile ? '18px' : '20px', lineHeight: '1.6' }}>
              Sign up to JobSync by creating a new account to access the best
              features. It only takes a few steps to get started.
            </p>
          </div>
        </div>
      </div>

      {/* Upload CV/Resume Section */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'center',  
          justifyContent: 'flex-start',
          marginTop: '50px',
          marginBottom: '50px',
        }}>
          {isMobile ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%' }} data-aos="fade-up">
                <img
                  src={uploadCV}
                  alt="Upload CV/Resume"
                  style={{
                    width: '100%',
                    height: 'auto',
                    marginBottom: '8px',
                  }}
                  
                />
                <p style={creditStyle}>Image: <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>Freepik</a></p>
              </div>
              <div style={{
                maxWidth: '100%',
                textAlign: 'center',
              }} data-aos="fade-up">
                <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '18px' }}>Upload CV/Resume</h3>
                <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
                  Upload your CV or resume to make your profile complete and ready
                  for job applications. This is your key to landing great opportunities.
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{
                maxWidth: '600px',
                textAlign: 'left',
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', 
                height: '100%',
              }} data-aos="fade-right">
                <h3 style={{ fontSize: '35px', fontWeight: 'bold', marginBottom: '18px' }}>Upload CV/Resume</h3>
                <p style={{ fontSize: '20px', lineHeight: '1.6' }}>
                  Upload your CV or resume to make your profile complete and ready
                  for job applications. This is your key to landing great opportunities.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }} data-aos="fade-left">
                <img
                  src={uploadCV}
                  alt="Upload CV/Resume"
                  style={{
                    width: '100%',
                    height: 'auto',
                    marginLeft: '20px', 
                  }}
                  
                />
                <p style={{...creditStyle, marginLeft: '20px'}}>Image by: <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>Freepik</a></p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Find Suitable Job Section */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'center', 
          justifyContent: 'flex-start',
          marginTop: '50px',
          marginBottom: '50px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: isMobile ? '80%' : '50%' }} data-aos={isMobile ? "fade-up" : "fade-left"}>
            <img
              src={findJob}
              alt="Find Suitable Job"
              style={{
                width: '100%',
                height: 'auto',
                marginRight: isMobile ? '0' : '20px',
                marginBottom: '8px',
              }}
            
            />
            <p style={creditStyle}>Image by: <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>Freepik</a></p>
          </div>
          <div style={{
            maxWidth: isMobile ? '100%' : '600px',
            textAlign: isMobile ? 'center' : 'left',
            paddingLeft: isMobile ? '0' : '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobile ? 'flex-start' : 'center', 
            height: isMobile ? 'auto' : '100%',
          }} data-aos={isMobile ? "fade-up" : "fade-right"}>
            <h3 style={{ 
              fontSize: isMobile ? '28px' : '35px', 
              fontWeight: 'bold', 
              marginBottom: '18px',
            }}>Find Suitable Job</h3>
            <p style={{ fontSize: isMobile ? '18px' : '20px', lineHeight: '1.6' }}>
              Browse through a wide variety of job listings tailored to your
              skills and experience. Find the best fit for your career.
            </p>
          </div>
        </div>
      </div>

      {/* Apply Job Section */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'center',  
          justifyContent: 'flex-start',
          marginTop: '50px',
          marginBottom: '50px',
        }}>
          {isMobile ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%' }} data-aos="fade-up">
                <img
                  src={applyJob}
                  alt="Apply Job"
                  style={{
                    width: '100%',
                    height: 'auto',
                    marginBottom: '8px',
                  }}
                  
                />
                <p style={creditStyle}>Image by: <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>Freepik</a></p>
              </div>
              <div style={{
                maxWidth: '100%',
                textAlign: 'center',
              }} data-aos="fade-up">
                <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '18px' }}>Apply for Jobs</h3>
                <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
                  Easily apply for jobs that match your profile with just a click
                  of a button. Let your next job be closer than ever!
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{
                maxWidth: '600px',
                textAlign: 'left',
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',  
                height: '100%',
              }} data-aos="fade-right">
                <h3 style={{ fontSize: '35px', fontWeight: 'bold', marginBottom: '18px' }}>Apply for Jobs</h3>
                <p style={{ fontSize: '20px', lineHeight: '1.6' }}>
                  Easily apply for jobs that match your profile with just a click
                  of a button. Let your next job be closer than ever!
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%' }} data-aos="fade-left">
                <img
                  src={applyJob}
                  alt="Apply Job"
                  style={{
                    width: '100%',
                    height: 'auto',
                    marginLeft: '20px', 
                  }}
                />
                <p style={{...creditStyle, marginLeft: '20px'}}>Image by: <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>Freepik</a></p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Interview Through Video Call Section */}
      <div style={{ marginBottom: '60px' }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'center', 
          justifyContent: 'flex-start',
          marginTop: '50px',
          marginBottom: '50px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: isMobile ? '80%' : '50%' }} data-aos={isMobile ? "fade-up" : "fade-left"}>
            <img
              src={videoCall}
              alt="Interview Through Video Call"
              style={{
                width: '100%',
                height: 'auto',
                marginRight: isMobile ? '0' : '20px',
                marginBottom: '8px',
              }}
             
            />
            <p style={creditStyle}>Image by: <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'none' }}>Freepik</a></p>
          </div>
          <div style={{
            maxWidth: isMobile ? '100%' : '600px',
            textAlign: isMobile ? 'center' : 'left',
            paddingLeft: isMobile ? '0' : '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobile ? 'flex-start' : 'center', 
            height: isMobile ? 'auto' : '100%',
          }} data-aos={isMobile ? "fade-up" : "fade-right"}>
            <h3 style={{ 
              fontSize: isMobile ? '28px' : '35px', 
              fontWeight: 'bold', 
              marginBottom: '18px',
            }}>Interview Through Video Call</h3>
            <p style={{ fontSize: isMobile ? '18px' : '20px', lineHeight: '1.6' }}>
              Prepare for and attend job interviews through video calls from
              the comfort of your home. Connect with potential employers
              virtually!
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default JobSyncFlow;