import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaBirthdayCake, FaFontAwesomeFlag, FaUser, FaVenusMars, FaBriefcase, FaGraduationCap, FaGlobe, FaMapMarkerAlt, FaPhone, FaEnvelope, FaDownload, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaRegBookmark } from 'react-icons/fa';
import { postToEndpoint } from './apiService';
const ViewProfileModal = ({ show, handleClose, applicant }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const iconStyle = { color: '#007bff', fontSize: '1.2em' };
  const [applicants, setApplicants] = useState([]);
  const [cover, setCover] = useState([]);
  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

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

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton style={{fontSize: '16px'}}>
        <Modal.Title className='ps-4'>Applicant Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: '30px' }}>
        <div className="d-flex">
          {/* Left Section */}
          <div className="border-end pe-5 ps-4" style={{ width: '772px' }}>
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
                  marginRight: '15px',
                }}
              >
                <img
                  src={applicants[0]?.profile_picture_url || '/assets/profes.jpg'}
                  alt="Applicant"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Name and Job Title */}
              <div>
                <h5 className="mb-2">{applicants[0]?.firstname || 'John'} {applicants[0]?.middlename || ''} {applicants[0]?.lastname || 'Doe'}</h5>
                <p className="text-muted mb-0">{applicants[0]?.headline || 'Graphic Designer'}</p>
              </div>
            </div>

            {/* Biography */}
            <h6>Biography</h6>
            <p style={{ textAlign: 'justify' }}>
                  {applicants[0]?.biography.replace(/<[^>]*>?/gm, '')}
            </p>
                {cover[0]?.coverLetter && (
                  <>
                    <h6 className="mt-4">Cover Letter</h6>
                    <p style={{ textAlign: 'justify' }}>
                      {cover[0]?.coverLetter.replace(/<[^>]*>?/gm, '')}
                    </p>
                  </>
                )}
            {/* Social Media */}
            <hr />
            <h6 className="mt-4">Follow Me on Social Media</h6>
            <div className="d-flex gap-3 mt-2">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                <Icon key={index} style={{ color: '#007bff', fontSize: '1.8em', cursor: 'pointer' }} />
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-grow-1 ms-5">
            {/* Bookmark and Send Email Buttons */}
            <div className="d-flex justify-content-end mb-3" style={{ gap: '10px' }}>
              <Button
                variant="outline-primary"
                style={{
                  width: '50px',
                  height: '45px',
                  fontSize: '15px',
                  padding: '0',
                  color: isBookmarked ? '#fff' : '#9c9c9c',
                  border: isBookmarked ? '1px solid #007bff' : '1px solid #ddf2ff',
                  backgroundColor: isBookmarked ? '#007bff' : '#ddf2ff',
                }}
                onClick={handleBookmarkClick}
              >
                <FaRegBookmark style={{ width: '20px', height: '20px', color: isBookmarked ? '#fff' : '#9c9c9c' }} />
              </Button>
              <Button
                variant="outline-primary"
                style={{
                  width: '200px',
                  height: '45px',
                  fontSize: '15px',
                  padding: '0',
                  color: 'white',
                  backgroundColor: '#0A65CC',
                }}
              >
                <FaEnvelope style={{ color: 'white', marginRight: '5px' }} /> Send Email
              </Button>
            </div>

            {/* Personal Information */}
            <div className="p-4 border mb-4" style={{ borderRadius: '8px', width: '300px', marginLeft: '-40px' }}>
              <h6 className='mb-3'>Personal Information</h6>
              <div className="d-flex w-100 justify-content-between" style={{ gap: '20px' }}>
                {/* Left-Aligned Items (Date of Birth, Marital Status, and Experience) */}
                <div className="d-flex flex-column gap-3" style={{ flex: '1' }}>
                  {[ 
                    { icon: <FaBirthdayCake />, label: 'Date of Birth', value: applicants[0]?.birthday },
                    { icon: <FaUser />, label: 'Marital Status', value: applicants[0]?.status },
                    { icon: <FaBriefcase />, label: 'Experience', value: applicants[0]?.experience },
                  ].map((info, index) => (
                    <div key={index} className="d-flex flex-column align-items-start gap-2">
                      {React.cloneElement(info.icon, { style: { fontSize: '22px', color: '#0A65CC' } })}
                      <div>
                        <h6 className="mb-1" style={{fontSize: '15px'}}>{info.label}</h6>
                        <p className="mb-0" style={{fontSize: '14px'}}>{info.label === 'Date of Birth' && info.value ? new Date(info.value).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right-Aligned Items (Nationality, Gender, and Education) */}
                <div className="d-flex flex-column gap-3" style={{ flex: '1' }}>
                  {[ 
                    { icon: <FaFontAwesomeFlag />, label: 'Nationality', value: applicants[0]?.nationality},
                    { icon: <FaVenusMars />, label: 'Gender', value: applicants[0]?.gender },
                    { icon: <FaGraduationCap />, label: 'Education', value: applicants[0]?.attainment },
                  ].map((info, index) => (
                    <div key={index} className="d-flex flex-column align-items-start gap-2">
                      {React.cloneElement(info.icon, { style: { fontSize: '22px', color: '#0A65CC' } })}
                      <div>
                        <h6 className="mb-1" style={{fontSize: '15px'}}>{info.label}</h6>
                        <p className="mb-0" style={{fontSize: '14px'}}>{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Download Resume */}
            <div className="p-4 border mb-4" style={{ borderRadius: '8px', width: '300px', marginLeft: '-40px' }}>
              <h6>Download Resume</h6>
              <Button variant="outline-primary" className="mt-2 d-flex align-items-center gap-2">
                <FaDownload style={iconStyle} />
                Download Resume
              </Button>
            </div>

            {/* Contact Information */}
            <div className="p-4 border" style={{ borderRadius: '8px', width: '300px', marginLeft: '-40px' }}>
              <h6>Contact Information</h6>
              {[
                { icon: <FaGlobe />, label: 'Address', value: applicants[0]?.address || 'N/A' },
                { icon: <FaMapMarkerAlt />, label: 'Location', value: applicants[0]?.city || 'N/A' },
                { icon: <FaPhone />, label: 'Phone', value: applicants[0]?.contact ? `+63 ${applicants[0]?.contact}` : 'N/A' },
                { icon: <FaEnvelope />, label: 'Email', value: applicants[0]?.email || 'N/A' },
              ].map((contact, index) => (
                <div key={index} className="d-flex align-items-center gap-2 mt-3">
                  {React.cloneElement(contact.icon, { style: iconStyle })}
                  <div style={{ minWidth: '0', flex: '1' }}>
                    <h6 className="mb-0 ms-2">{contact.label}</h6>
                    <p
                      className="mb-0 ms-2"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
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
