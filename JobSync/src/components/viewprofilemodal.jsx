import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaBirthdayCake, FaFontAwesomeFlag, FaUser, FaVenusMars, FaBriefcase, FaGraduationCap, FaGlobe, FaMapMarkerAlt, FaPhone, FaEnvelope, FaDownload, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { postToEndpoint } from './apiService';
import { useAuth } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import defaultProf from '../assets/user_default.png'

const ViewProfileModal = ({ show, handleClose, applicant }) => {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const iconStyle = { color: '#007bff', fontSize: '1.2em' };
  const [applicants, setApplicants] = useState([]);
  const [cover, setCover] = useState([]);

  useEffect(() => {
    const fetchApplied = async () => {
        try {
            const response = await postToEndpoint('/getapplicantDetails.php', { applicant_id: applicant });
            if (response.data.applicants) {
                setApplicants(response.data.applicants);
            } else {
                console.error('No jobs found or an error occurred:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    fetchApplied();
}, [applicant]);

  useEffect(() => {
    const fetchCoverLetter = async () => {
        try {
            const response = await postToEndpoint('/getCoverLetter.php', { applicant_id: applicant });
            if (response.data.cover) {
              setCover(response.data.cover);
            } else {
                console.error('No jobs found or an error occurred:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    fetchCoverLetter();
  }, [applicant]);
  
  const handleBookmarkClick = async () => {
    try {
      const response = await postToEndpoint('/saveFavoriteApplicants.php', {
        applicant_id: applicant,
        employer_id: user.id
      });
  
      if (response.data.success) {
        setIsBookmarked(!isBookmarked);
      } else {
        console.error('Failed to save bookmark:', response.data.message);
      }
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  }

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.id || !applicant) {
        console.error("Employer ID or Applicant ID is missing.");
        return;
      }
  
      try {
        const response = await postToEndpoint("/getFavoritesApplicants.php", {
          applicant_id: applicant,
          employer_id: user.id
        });
  
        if (response.data.success) {
          setIsBookmarked(response.data.bookmarked);
        } else {
          console.error("Failed to fetch bookmark status:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching bookmark status:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookmarks();
  }, [user?.id, applicant]); 
  
  
  return (
    <Modal show={show} onHide={handleClose} fullscreen="lg-down" size="xl" centered>
    <Modal.Header closeButton>
      <Modal.Title className="ps-2 ps-md-4">Applicant Profile</Modal.Title>
    </Modal.Header>

    <Modal.Body className="p-3 p-md-4">
      <div className="row g-4">
        {/* Left Section */}
        <div className="col-12 col-lg-8">
          <div className="pe-0 pe-lg-4 ps-0 ps-md-4">
            {/* Picture, Name, and Job Title */}
            <div className="d-flex align-items-center mb-4">
              {/* Circular Picture Container */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <img
                  src={applicants[0]?.profile_picture_url || defaultProf}
                  alt="Applicant"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Name and Job Title */}
              <div>
                <h5 className="mb-2 ms-3">{applicants[0]?.firstname || 'N/A'} {applicants[0]?.middlename || ''} {applicants[0]?.lastname || ''}
                    {applicants[0]?.account_status === 'verified' && (
                      <FontAwesomeIcon icon={faCircleCheck} className="ms-1 text-primary" size="sm" title='Verified' />
                    )}
                </h5>
                <p className="text-muted mb-0 ms-3">{applicants[0]?.headline || 'N/A'}</p>
              </div>
            </div>

            {/* Biography */}
            <h6>Biography</h6>
            <p style={{ textAlign: 'justify' }}>
              {applicants[0]?.biography?.replace(/<[^>]*>?/gm, '')}
            </p>
            
            {/* Social Media */}
            <hr className="my-4" />
            <h6>Follow Me on Social Media</h6>
            <div className="d-flex gap-3 mt-2 flex-wrap">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                <Icon key={index} style={{ color: '#007bff', fontSize: '1.8em', cursor: 'pointer' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-12 col-lg-4">
          {/* Bookmark and Send Email Buttons */}
          <div className="d-flex justify-content-end mb-3 gap-2">
            <Button
              variant="outline-primary"
              style={{
                width: '50px',
                height: '45px',
                fontSize: '15px',
                padding: '0',
                border: 'none',
                background: isBookmarked ? '#d7ecff' : '#f8f9fa',
              }}
              onClick={handleBookmarkClick}
            >
              {isBookmarked ? (
                <FaBookmark style={{ width: '20px', height: '20px', color: '#0A65CC' }} />
              ) : (
                <FaRegBookmark style={{ width: '20px', height: '20px', color: '#6c757d' }} />
              )}
            </Button>
            <Button
              variant="outline-primary"
              className="d-flex align-items-center justify-content-center gap-2"
              style={{
                height: '45px',
                fontSize: '15px',
                padding: '0 15px',
                color: 'white',
                width: '50%',
                backgroundColor: '#0A65CC',
              }}
            >
              <FaEnvelope style={{ color: 'white' }} /> Send Email
            </Button>
          </div>

          {/* Personal Information */}
          <div className="p-3 p-md-4 border mb-4" style={{ borderRadius: '8px' }}>
            <h6 className="mb-3">Personal Information</h6>
            <div className="row g-3">
              {/* Left-Aligned Items */}
              <div className="col-12 col-sm-6">
                {[ 
                  { icon: <FaBirthdayCake />, label: 'Date of Birth', value: applicants[0]?.birthday },
                  { icon: <FaUser />, label: 'Marital Status', value: applicants[0]?.status },
                  { icon: <FaBriefcase />, label: 'Experience', value: applicants[0]?.experience },
                ].map((info, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex align-items-center gap-2">
                      {React.cloneElement(info.icon, { style: { fontSize: '22px', color: '#0A65CC' } })}
                      <div>
                        <h6 className="mb-1" style={{fontSize: '15px'}}>{info.label}</h6>
                        <p className="mb-0" style={{fontSize: '14px'}}>
                          {info.label === 'Date of Birth' && info.value 
                            ? new Date(info.value).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              }) 
                            : info.value || 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right-Aligned Items */}
              <div className="col-12 col-sm-6">
                {[ 
                  { icon: <FaFontAwesomeFlag />, label: 'Nationality', value: applicants[0]?.nationality },
                  { icon: <FaVenusMars />, label: 'Gender', value: applicants[0]?.gender },
                  { icon: <FaGraduationCap />, label: 'Education', value: applicants[0]?.attainment },
                ].map((info, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex align-items-center gap-2">
                      {React.cloneElement(info.icon, { style: { fontSize: '22px', color: '#0A65CC' } })}
                      <div>
                        <h6 className="mb-1" style={{fontSize: '15px'}}>{info.label}</h6>
                        <p className="mb-0" style={{fontSize: '14px'}}>{info.value || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Download Resume */}
          <div className="p-3 p-md-4 border mb-4" style={{ borderRadius: '8px' }}>
            <h6>Download Resume</h6>
            <Button variant="outline-primary" className="mt-2 d-flex align-items-center gap-2">
              <FaDownload style={iconStyle} />
              Download Resume
            </Button>
          </div>

          {/* Contact Information */}
          <div className="p-3 p-md-4 border" style={{ borderRadius: '8px' }}>
            <h6>Contact Information</h6>
            {[
              { icon: <FaGlobe />, label: 'Address', value: applicants[0]?.address || 'N/A' },
              { icon: <FaMapMarkerAlt />, label: 'Location', value: applicants[0]?.city || 'N/A' },
              { icon: <FaPhone />, label: 'Phone', value: applicants[0]?.contact ? `+63 ${applicants[0]?.contact}` : 'N/A' },
              { icon: <FaEnvelope />, label: 'Email', value: applicants[0]?.email || 'N/A' },
            ].map((contact, index) => (
              <div key={index} className="d-flex align-items-center gap-2 mt-3">
                {React.cloneElement(contact.icon, { style: iconStyle })}
                <div className="overflow-hidden">
                  <h6 className="mb-0 ms-2">{contact.label}</h6>
                  <p
                    className="mb-0 ms-2 text-truncate"
                    title={contact.value}
                  >
                    {contact.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal.Body>
  </Modal>
  );
};

export default ViewProfileModal;
