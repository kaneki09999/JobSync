import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Image } from "react-bootstrap";
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaBirthdayCake, FaFontAwesomeFlag, FaUser, FaVenusMars, FaBriefcase, FaGraduationCap, FaGlobe, FaMapMarkerAlt, FaPhone, FaEnvelope, 
    FaDownload, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTimesCircle , FaChevronLeft, FaChevronRight, FaRegArrowAltCircleRight, FaPauseCircle, FaVideo  } from 'react-icons/fa';
import { postToEndpoint } from '../../../components/apiService';
import ModalComponent from '../../../components/modalAssessment';
import ModalInterview from '../../../components/InterviewScheduleModal';
import { useAuth } from '../../../AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function ProfilePage() {
        const { user } = useAuth(); 
        const [isBookmarked, setIsBookmarked] = useState(false);
        const [screeningAnswer, setScreeningAnswer] = useState([]);
        const [assessmentAnswer, setAssessmentAnswer] = useState([]);
        const iconStyle = { color: '#007bff', fontSize: '1.2rem' };
        const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
        const { application_id, job_id, applicant_id } = useParams();
        const [applications, setApplications] = useState([]);
        const navigate = useNavigate();
        useEffect(() => {
          const fetchApplied = async () => {
              try {
                  const response = await postToEndpoint('/getApplicantAppliedDetails.php', { application_id, job_id });
                  if (response.data.jobs) {
                      setApplications(response.data.jobs);
                  } else {
                      console.error('No jobs found or an error occurred:', response.data.error);
                  }
              } catch (error) {
                  console.error('Error fetching jobs:', error);
              }
          };
      
          fetchApplied();
      }, [application_id, job_id]);

      useEffect(() => {
        const fetchQuestionAnswer = async () => {
            try {
                const response = await postToEndpoint('/getApplicantAnswer.php', { application_id, job_id });
                if (response.data.answer) {
                    setScreeningAnswer(response.data.answer);
                } else {
                    console.error('No jobs found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
    
        fetchQuestionAnswer();

        const fetchAsessmentAnswer = async () => {
          try {
              const response = await postToEndpoint('/getAssessmentAnswers.php', { application_id, job_id });
              if (response.data.answer) {
                setAssessmentAnswer(response.data.answer);
              } else {
                  console.error('No jobs found or an error occurred:', response.data.error);
              }
          } catch (error) {
              console.error('Error fetching jobs:', error);
          }
        }

        fetchAsessmentAnswer();

    }, [application_id, job_id]);
      
    const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
    };

    const handleNextQuestion = () => {
    if (currentQuestionIndex < screeningAnswer.length - 2) {
      setCurrentQuestionIndex(currentQuestionIndex + 2);
    }
    };

    const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 2);
    }
    };

    const [showModal, setShowModal] = useState(false);
    const [showModalInterview, setShowModalInterview] = useState(false);
    const handleClick = () => {
      if (applications[0]?.applied_status === 'Pending') {
        setShowModal(true);
      }
      if (applications[0]?.applied_status === 'Qualified') {
        setShowModalInterview(true); 
      }
    };


    const handleAppStatus = (status) => async () => {

      const job_title = applications[0]?.headline;
      const application_id = applications[0]?.application_id;
      const job_id = applications[0]?.job_id;
      const applicant_id = applications[0]?.applicant_id;

      if(!job_title || !application_id || !job_id) {
          console.error('Missing required data:', job_title, application_id, job_id);
          return;
      }

      try {
          const response = await postToEndpoint('/setApplicantStatus.php', { application_id, job_id, applicant_id, status, job_title });
          if (response.data.success) {
              Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'You Approved the applicant',
                  showConfirmButton: false,
                  timer: 1500
              }).then(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            });
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Oops!',
                  text: 'An error occurred while updating the status',
                  showConfirmButton: false,
                  timer: 1500
              }).then(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            });
          }
      } catch (error) {
          console.error('Error updating status:', error);
          Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: 'An error occurred while updating the status',
              showConfirmButton: false,
              timer: 1500
          }).then((result) => {
            if (result.isConfirmed) {
                navigate('/employer/applications');
              }
          });
      }
    };



    const handleCloseModal = () => setShowModal(false);
    const handleCloseModalInterview = () => setShowModalInterview(false);
    const [interview, setApplication] = useState([]);
    useEffect(() => {
      const fetchApplications = async () => {
          try {
              const response = await postToEndpoint('/getInterviewStatusDetails.php', { employer_id: user.id, application_id: application_id });
              if (response.data?.applications) {
                  console.log('Applications fetched:', response.data.applications);
                  setApplication(response.data.applications);
              } else {
                  console.error('No jobs found or an error occurred:', response.data.error);
              }
          } catch (error) {
              console.error('Error fetching jobs:', error);
          }
      };
      fetchApplications();
      const interval = setInterval(fetchApplications, 30000);
      return () => clearInterval(interval);
  }, [user.id]); 

  console.log (applications);

  return (
    <>
  <Container style={{marginTop: '8rem'}}>
      {/* Back Button */}
      <Button
        variant="link"
        className="text-primary d-flex align-items-center mb-3"
        onClick={() => {
          window.history.back();
          window.scrollTo({ top: 0 });
        }}
        style={{
          position: 'relative',
          top: '0px',
          right: '0',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'transparent',
          border: 'none',
          color: '#0d6efd'
      }}
      >
        <FaArrowLeft /> 
      </Button>

      <Row>
        {/* Left Section */}
        <Col lg={8} className="pr-lg-5">
          {/* Profile Header */}
          <div className="d-flex align-items-center mb-4">
            {/* Profile Picture */}
            <div className="rounded-circle overflow-hidden" style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
              }}>
              <Image src={applications[0]?.profile_picture_url} alt="Applicant" fluid/>
            </div>

            {/* Name and Headline */}
            <div className="ms-3" style={{textAlign: 'left'}}>
              <div style={{display: 'flex'}}>
                <h5 className="mb-1 d-flex align-items-center">
                  {applications[0]?.firstname} {applications[0]?.middlename} {applications[0]?.lastname}
                  {applications[0]?.account_status === 'verified' && (
                    <FontAwesomeIcon icon={faCircleCheck} className="ms-1 mt-1 text-primary" size="sm" title='Verified' />
                  )}
                </h5>
              </div>
              <p className="text-muted mb-0">{applications[0]?.headline}</p>
            </div>
          </div>

          {/* Biography */}
          <h6 style={{ textAlign: 'left' }}>Biography</h6>
          <p style={{ textAlign: 'justify'}}>{applications[0]?.biography.replace(/<[^>]*>?/gm, "")}</p>

          {/* Cover Letter */}
          {applications[0]?.coverLetter && (
            <>
              <div style={{textAlign: 'start'}}>
                <h6 className="mt-4" style={{ textAlign: 'left' }}>Cover Letter</h6>
                <a onClick={() => window.open(`/src/api/${applications[0]?.coverLetter}`, "_blank")} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faDownload} size="lg" style={{ color: '#0955b7', marginRight: '10px', width: '13px' }} />
                  <small style={{ fontWeight: '400', color: '#0955b7' }}>Download Cover Letter</small>
                </a>
              </div>
            </>
          )}
          {/* Social Media Links */}
          <h6 className="mt-4" style={{ textAlign: 'left' }}>Follow Me on Social Media</h6>
          <div className="d-flex gap-3 mt-2">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
              <Icon key={index} style={{ color: '#007bff', fontSize: '1.8em', cursor: 'pointer' }} />
            ))}
          </div>

          <hr className="mt-4" />

          {/* Screening Questions */}
          <h6 className="mt-4 mb-3" style={{ textAlign: 'left', fontSize: '18px' , marginBottom: '10px' }}>Screening Question</h6>
          <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded" style={{background: 'linear-gradient(49deg, rgba(230,241,255,1) 0%, rgba(255,255,255,1) 52%, rgba(223,240,255,1) 100%)', borderRadius: '10px'}}>
            <Button variant="link" className="text-primary" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
              <FaChevronLeft />
            </Button>
            {Array.isArray(screeningAnswer) && screeningAnswer.length > 0 ? (
                <div className="d-flex flex-column flex-md-row" style={{ textAlign: 'left', flex: 1 }}>
                  {/* First Question */}
                  {screeningAnswer[currentQuestionIndex] && (
                    <div className="flex-fill px-2">
                      <p>{screeningAnswer[currentQuestionIndex].question}</p>
                      <div className="d-flex justify-content-between flex-wrap">
                        <div>
                          <p className='mb-0'><strong>Answer:</strong> {screeningAnswer[currentQuestionIndex].answer}</p>
                        </div>
                        <div>
                          <p className='mb-0'><strong>Ideal Answer:</strong> {screeningAnswer[currentQuestionIndex].ideal_answer}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vertical Separator (Hidden on small screens) */}
                  <div className="d-none d-md-flex align-items-center">
                    <div style={{ borderLeft: '1px solid #ccc', height: '70px' }}></div>
                  </div>

                  {/* Second Question */}
                  {screeningAnswer[currentQuestionIndex + 1] && (
                    <div className="flex-fill px-2 mt-3 mt-md-0">
                      <p>{screeningAnswer[currentQuestionIndex + 1].question}</p>
                      <div className="d-flex justify-content-between flex-wrap">
                        <div>
                          <p className='mb-0'><strong>Answer:</strong> {screeningAnswer[currentQuestionIndex + 1].answer}</p>
                        </div>
                        <div>
                          <p className='mb-0'><strong>Ideal Answer:</strong> {screeningAnswer[currentQuestionIndex + 1].ideal_answer}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p>No questions available</p>
              )}
            <Button variant="link" className="text-primary" onClick={handleNextQuestion} disabled={currentQuestionIndex + 1 >= screeningAnswer.length}>
              <FaChevronRight />
            </Button>
          </div>
          

          {/* Assessment Questions And Answers  */}
          <h6 className="mt-4 mb-3" style={{ textAlign: "left", fontSize: "18px" }}>Assessment</h6>
          <div className="p-3 bg-light rounded shadow-sm" style={{ background: "white", borderRadius: "10px" }}>
            {Array.isArray(assessmentAnswer) && assessmentAnswer.length > 0 ? (
              <div className="row">
                {assessmentAnswer.map((item, index) => (
                  <div key={index} className="col-12 mb-3">
                    <div className="p-3 border rounded bg-white shadow-sm">
                      <p className="mb-1" style={{ textAlign: 'left' }}>
                        <span style={{ fontWeight: 'bold' }}>Q: </span>
                        {item.Instructions}
                      </p>
                      <div className="d-flex justify-content-between flex-wrap text-muted">
                        <p className="mb-0"><strong>Type:</strong> {item.Type}</p>
                        <p className="mb-0"><strong>Answer:</strong> {item.Answer || "No answer provided"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center">No assessment answers yet</p>
            )}
          </div>

          {/* Create approve or reject button */}
          <div className="d-flex justify-content-end mt-4 gap-2 mb-5">



            {applications[0]?.applied_status === "On hold" && (
             <>
              <Button variant="danger" className="d-flex align-items-center" style={{ width: '150px', justifyContent: 'center', height: '50px' }} onClick={handleAppStatus('Rejected')}>
                Reject
              </Button>
              <Button variant="primary" className="d-flex align-items-center" style={{ width: '150px', justifyContent: 'center', height: '50px' }} onClick={handleAppStatus('Qualified')}> 
                Approved
              </Button>
             </>
            )}

          </div>
        </Col>

        {/* Right Section */}
        <Col lg={4} className='mt-3'>
          {/* Actions */}
          <div className="d-flex justify-content-end mb-3 gap-2">
            <Button variant="outline-primary" className="d-flex align-items-center" >
              <FaEnvelope className="me-0" />
            </Button>

            <Button variant="outline-danger" className="d-flex align-items-center"
            style={{width: '40%', justifyContent: 'center', height: '50px'}} 
            >
              <FaTimesCircle className="me-2" /> Reject
            </Button>

            {applications[0]?.applied_status === "To Interview" ? (
              interview[0]?.status === "Confirmed" ? (
                <Link to={`/employer/publisher/${applications[0]?.application_id}/${applications[0]?.job_id}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" className="d-flex align-items-center"  style={{width: '150px', justifyContent: 'center', height: '50px'}}>
                    <FaVideo className="me-2" /> Join Meet
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" className="d-flex align-items-center" disabled style={{width: '150px', justifyContent: 'center', height: '50px'}}>
                  <FaVideo className="me-2" /> Pending
                </Button>
              )
            ) : (
              <Button variant="primary" className="d-flex align-items-center" style={{width: '180px', justifyContent: 'center', height: '50px'}} onClick={handleClick}>
                {applications[0]?.applied_status === "On hold" ? (
                  <>
                    <FaPauseCircle className="me-2" /> On hold
                  </>
                ) : (
                  <>
                    <FaRegArrowAltCircleRight
                      style={{ color: 'white', marginRight: '5px', fontSize: '20px' }}
                    />
                    Set{' '}
                    {applications[0]?.applied_status === 'to Interview'
                      ? 'bg-success'
                      : applications[0]?.applied_status === 'Pending'
                      ? 'Assessment'
                      : applications[0]?.applied_status === 'Qualified'
                      ? 'Interview'
                      : ''}
                  </>
                )}
              </Button>
            )}
          <ModalInterview show={showModalInterview} handleClose={handleCloseModalInterview} application_id={application_id} job_id={job_id} />
          <ModalComponent show={showModal} handleClose={handleCloseModal} application_id={application_id} job_id={job_id} />
          </div>

          {/* Personal Information */}
          <Card className="p-4 mb-4" style={{ borderRadius: '8px', border: '1px solid #afd0ec', borderColor: '#afd0ec' }}>
            <h6 className="text-start mb-4">Personal Information</h6>
            
            <Row className="g-4" style={{textAlign: 'left'}}>
              {/* Left Column: Date of Birth, Marital Status, Experience */}
              <Col xs={12} md={6}>
                {[
                  { icon: <FaBirthdayCake />, label: 'Date of Birth', value: applications[0]?.birthday },
                  { icon: <FaUser />, label: 'Marital Status', value: applications[0]?.status },
                  { icon: <FaBriefcase />, label: 'Experience', value: applications[0]?.experience },
                ].map((info, index) => (
                  <div key={index} className="d-flex align-items-start gap-3">
                    {React.cloneElement(info.icon, { style: { fontSize: '20px', color: '#0A65CC' } })}
                    <div>
                      <h6 className="mb-0">{info.label}</h6>
                      <p className="mb-0 text-muted" style={{ fontSize: '15px', marginTop: '5px' }}>
                        {info.label === 'Date of Birth' && info.value ? 
                          new Date(info.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 
                          info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </Col>

              {/* Right Column: Nationality, Gender, Education */}
              <Col xs={12} md={6}>
                {[
                  { icon: <FaFontAwesomeFlag />, label: 'Nationality', value: applications[0]?.nationality },
                  { icon: <FaVenusMars />, label: 'Gender', value: applications[0]?.gender },
                  { icon: <FaGraduationCap />, label: 'Education', value: applications[0]?.attainment },
                ].map((info, index) => (
                  <div key={index} className="d-flex align-items-start gap-3">
                    {React.cloneElement(info.icon, { style: { fontSize: '20px', color: '#0A65CC' } })}
                    <div>
                      <h6 className="mb-0">{info.label}</h6>
                      <p className="mb-0 text-muted" style={{ fontSize: '15px', marginTop: '5px' }}>
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </Col>
            </Row>
          </Card>

          {/* Download Resume */}
          <Card className="mb-4" style={{ borderRadius: '8px', border: '1px solid #afd0ec', textAlign:  'left' }}>
            <Card.Body>
              <Card.Title style={{fontSize: '17px'}}>Download Resume</Card.Title>
              {applications[0]?.resumePath ? (
                <Button variant="outline-primary" onClick={() => window.open(`/src/api/${applications[0]?.resumePath}`, "_blank")}>
                  <FaDownload className="me-2" /> Download Resume
                </Button>
              ) : (
                <p>No resume available</p>
              )}
            </Card.Body>
          </Card>
          <Card className="p-4" style={{ borderRadius: '8px', border: '1px solid #afd0ec', textAlign: 'left' }}>
            <h6 className="text-start mb-3">Contact Information</h6>

            <Row className="g-3">
              {[
                { icon: <FaGlobe />, label: 'Address', value: applications[0]?.address },
                { icon: <FaMapMarkerAlt />, label: 'Location', value: applications[0]?.city },
                { icon: <FaPhone />, label: 'Phone', value: applications[0]?.contact ? `+63 ${applications[0]?.contact}` : 'N/A' },
                { icon: <FaEnvelope />, label: 'Email', value: applications[0]?.email },
              ].map((contact, index) => (
                <Col xs={12} md={6} key={index}>
                  <div className="d-flex align-items-center gap-3">
                    {React.cloneElement(contact.icon, { color: '#007bff', fontSize: '1.3rem' })}
                    <div>
                      <h6 className="mb-0">{contact.label}</h6>
                      <p 
                        className="mb-0 text-muted" 
                        style={{ 
                          fontSize: '15px', 
                          marginTop: '5px',
                          wordBreak: 'break-word',  // ✅ Prevents text overflow
                          overflowWrap: 'break-word' // ✅ Ensures wrapping
                        }}
                      >
                        {contact.value}
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>

        </Col>
      </Row>
    </Container>
    </>
  );
}

