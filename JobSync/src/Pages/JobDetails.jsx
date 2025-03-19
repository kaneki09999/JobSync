import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import { FaCalendarAlt, FaBriefcase, FaGraduationCap, FaMoneyBillWave, FaMapMarkerAlt, FaRegBookmark, FaArrowRight, FaBusinessTime, FaSuitcase, FaBookmark, FaUserTie, FaArrowLeft, FaUserClock  } from 'react-icons/fa';
import { FaLink, FaLinkedin, FaFacebook, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getFromEndpoint, postToEndpoint } from '../components/apiService';
import DOMPurify from 'dompurify'; 
import { useAuth } from '../AuthContext'; 
import 'react-quill/dist/quill.snow.css';
import '../css/loader.css';
import Swal from 'sweetalert2';
import ApplyModal from '../components/applynowmodal';
import MapComponent from './Applicants/Mapp';

const JobPosting = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { job_id } = useParams();
    const [job, setJob] = useState(null);
    const [modalShow, setModalShow] = useState(false);  
    const [applied, setApplied] = useState([]);

    useEffect(() => {
        const fetchAppliedJob = async () => {
            try {
                const response = await getFromEndpoint('/getApplied.php', { applicant_id: user?.id, job_id});
                console.log(response.data.apply)
                if (response.data.success) {
                    setApplied(response.data.apply);
                }
            } catch (error) {
                console.error('Error fetching bookmark status:', error);
            }
        };

        fetchAppliedJob();
    }, [user?.id, job_id]);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await getFromEndpoint(`/get_jobs.php?job_id=${job_id}`);
                if (response.data && response.data.length > 0) {
                    const jobData = response.data[0];

                    if (jobData.selectedBenefits && jobData.selectedBenefits.trim() !== '') {
                        jobData.selectedBenefits = jobData.selectedBenefits.split(',')
                            .map(item => item.trim())
                            .filter(item => item && item !== ' ');

                    } else {
                        jobData.selectedBenefits = null;
                    }
                    setJob(jobData);
                } else {
                    console.error("No job data found");
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        };
        fetchJobDetails();
    }, [job_id]);
    
    const [isBookmarked, setIsBookmarked] = useState(false);
    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            try {
                const response = await getFromEndpoint('/getFavoriteJobs.php', { applicant_id: user?.id });

                if (response.data.success) {
                    setIsBookmarked(response.data.bookmarkedJobs.includes(parseInt(job_id)));
                }
            } catch (error) {
                console.error('Error fetching bookmark status:', error);
            }
        };

        fetchBookmarkStatus();
    }, [user?.id, job_id]);

    const handleBookmarkClick = async () => {
        if (!user) {
            navigate('/candidate_login', { state: { from: `/jobdetails/${job_id}` } });
            return;
        }
    
        const endpoint = isBookmarked
            ? 'deleteFavoriteJob.php'
            : 'saveFavoriteJob.php';
    
        const requestData = {
            applicant_id: user?.id,
            job_id,
        };
    
        try {
            const response = await postToEndpoint(endpoint, requestData);
    
            if (response.data.success) {
                setIsBookmarked(!isBookmarked); 
            } else {
                console.log(response.data.message || 'Failed to update bookmark status.');
            }
        } catch (error) {
            console.error('Error updating bookmark status:', error);
            console.log('An error occurred while updating the bookmark status.');
        }
    };
    
    const handleShowModal = async () => {
        if (!user) {
            navigate('/candidate_login', { state: { from: `/jobdetails/${job_id}` } });
            return;
        }
        try {
            const response = await postToEndpoint('/checkApplicantProfile.php', { applicant_id: user?.id });
            
            console.log("Backend response:", response.data); 
            
            if (response.data.success) {
                const { isCompleteSocialMedia, message } = response.data; 
                if (isCompleteSocialMedia === true) {
                    console.log("Profile is complete. Showing modal.");
                    setModalShow(true);
                } else {
                    Swal.fire({
                        title: 'Profile Incomplete',
                        html: message || "Please complete your profile before applying.",
                        icon: 'warning',
                        confirmButtonText: 'Go to Profile',
                        preConfirm: () => {
                            navigate('/applicantprofile');
                        }
                    });
                }
            } else {
                console.error('Failed to check profile completeness:', response.data.message);
            }
        } catch (error) {
            console.error('Error checking applicant profile:', error);
        }
    };
    
    
    
    const handleCloseModal = () => {
        setModalShow(false); 
    };

    if (!job) return (
        <div id="preloader"></div>
    );

    const sanitizedDescription = DOMPurify.sanitize(job.jobDescription);

    const JobBenefits = ({ selectedBenefits }) => {
        if (!selectedBenefits || selectedBenefits.length === 0) {
            return <p>No benefits listed for this job.</p>;
        }
        return (
            <div className="d-flex flex-wrap gap-2 mt-3">
                {selectedBenefits.map((benefit, index) => (
                    <span
                        key={index}
                        className="badge"
                        style={{ padding: '10px', borderRadius: '5px', fontSize: '14px', color: '#1978db', background: '#d3eeff' }}
                    >
                        {benefit}
                    </span>
                ))}
            </div>
        );
    };

      const formatDate = (dateString) => {
          const date = new Date(dateString);
          const options = { year: 'numeric', month: 'short', day: 'numeric' };
          return date.toLocaleDateString('en-US', options);
      };

      const copyLink = () => {
          navigator.clipboard.writeText(window.location.href); 
          alert("Link copied to clipboard!");
      };


      return (
          <>
            <Container className="job-posting" style={{paddingTop: '8rem'}}>
                <Button
                    className="mt-3 no-hover-bg"
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

                <Row className="mb-4">
                    {/* Job Details Section */}
                    <Col xs={12} lg={7}>
                        <Container style={{ padding: '16px', width: '100%', paddingTop: '0' }}>
                            <div className="text-start">
                                <Row className="align-items-center no-margin m-0">
                                    {/* Logo Section */}
                                    <Col xs={4} md={3} className="no-padding text-center">
                                        <img
                                            src={job.logo || './src/assets/default-logo.png'}
                                            alt={job.jobTitle}
                                            className="img-fluid"
                                            style={{
                                                width: '100%', maxWidth: '100px', height: 'auto', marginTop: '10px',
                                            }}
                                        />
                                    </Col>

                                    {/* Job Title & Company Name */}
                                    <Col xs={8} md={9} className="no-padding">
                                        <h1 className="no-margin text-start job-title">{job.jobTitle}</h1>
                                        <span className="company-name" style={{ fontSize: '18px', fontWeight: '500' }}>
                                            at {job.company_name}
                                        </span>
                                        <span className="badge ms-2 no-margin job-badge">
                                            {job.jobType}
                                        </span>
                                    </Col>
                                </Row>

                                {/* Job Description */}
                                <h4 className="mt-4 job-description-title">Job Description</h4>
                                <p className="job-description mt-4 sanitized-content"
                                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                            </div>
                        </Container>
                    </Col>


                    {/* Job Overview Section */}
                    <Col xs={12} lg={5}>
                        <FavoritesAndApplyButton
                            handleShowModal={handleShowModal}
                            isBookmarked={isBookmarked}
                            handleBookmarkClick={handleBookmarkClick}
                            applied={applied[0]?.applied_status}
                        />

                        {/* Salary & Location */}
                        <Card className="salary-location mt-4" style={{ width: '100%', padding: '15px' }}>
                            <Card.Body>
                                <Row className="text-center">
                                    <Col xs={6} className="d-flex flex-column align-items-center border-end">
                                        <FaMoneyBillWave style={{ color: '#0a60bb', width: '30px', height: '30px' }} />
                                        <strong className="mt-2">Salary</strong>
                                        <div style={{ color: '#0BA02C' }}>₱{job.minSalary} - ₱{job.maxSalary}</div>
                                        <div style={{ color: '#868686', fontSize: '14px' }}>{job.salaryType} Salary</div>
                                    </Col>
                                    <Col xs={6} className="d-flex flex-column align-items-center">
                                        <FaMapMarkerAlt style={{ color: '#0a60bb', width: '30px', height: '30px' }} />
                                        <strong className="mt-2">Location</strong>
                                        <div style={{ color: '#868686' }}>{job.city}</div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Job Benefits */}
                        <Card className="job-benefits mt-4" style={{ width: '100%', padding: '20px' }}>
                            <Card.Body>
                                <h4 className="text-start">Job Benefits</h4>
                                <JobBenefits selectedBenefits={job.selectedBenefits} />
                            </Card.Body>
                        </Card>

                        {/* Job Overview */}
                        <Card className="job-overview mt-4" style={{ width: '100%', padding: '20px' }}>
                            <Card.Body>
                                <h4 className="text-start" style={{ fontSize: '22px', color: '#4d4d4d' }}>Job Overview</h4>

                                <Row className="text-start mt-3" style={{ fontWeight: '500' }}>
                                <Col xs={6} md={3} className="mb-3">
                                    <FaCalendarAlt className="me-2" style={{ color: '#0a60bb', width: '25px', height: '25px' }} />
                                    <div style={{ color: '#767F8C', marginTop: '5px' }}>Job Posted</div>
                                    <div style={{ color: '#4d4d4d' }}>{formatDate(job.job_created_at)}</div>
                                </Col>
                                <Col xs={6} md={3} className="mb-3">
                                    <FaBusinessTime className="me-2" style={{ color: '#0a60bb', width: '25px', height: '25px' }} />
                                    <div style={{ color: '#767F8C', marginTop: '5px' }}>Job Expires</div>
                                    <div style={{ color: '#4d4d4d' }}>{formatDate(job.expirationDate)}</div>
                                </Col>
                                <Col xs={6} md={3} className="mb-3">
                                    <FaSuitcase className="me-2" style={{ color: '#0a60bb', width: '25px', height: '25px' }} />
                                    <div style={{ color: '#767F8C', marginTop: '5px' }}>Job Level</div>
                                    <div style={{ color: '#4d4d4d' }}>{job.jobLevel}</div>
                                </Col>
                               
                                <Col xs={6} md={3} className="mb-3">
                                    <FaBriefcase className="me-2" style={{ color: '#0a60bb', width: '25px', height: '25px' }} />
                                    <div style={{ color: '#767F8C', marginTop: '5px' }}>Job Type</div>
                                    <div style={{ color: '#4d4d4d' }}>{job.jobType}</div>
                                </Col>
                                </Row>

                                <Row className="text-start mt-3" style={{ fontWeight: '500' }}>
                                <Col xs={6} md={3} className="mb-3">
                                    <FaUserClock className="me-2" style={{ color: '#0a60bb', width: '25px', height: '25px' }} />
                                    <div style={{ color: '#767F8C', marginTop: '5px' }}>Experience</div>
                                    <div style={{ color: '#4d4d4d' }}>{job.experience}</div>
                                </Col>
                                <Col xs={6} md={3} className="mb-3">
                                    <FaUserTie className="me-2" style={{ color: '#0a60bb', width: '25px', height: '25px' }} />
                                    <div style={{ color: '#767F8C', marginTop: '5px' }}>Job Role</div>
                                    <div style={{ color: '#4d4d4d' }}>{job.jobRole}</div>
                                </Col>

                                <Col xs={6} md={3} className="mb-3">
                                    <FaGraduationCap className="me-2" style={{ color: '#0a60bb', width: '25px', height: '25px' }} />
                                    <div style={{ color: '#767F8C', marginTop: '5px' }}>Education</div>
                                    <div style={{ color: '#4d4d4d' }}>{job.education}</div>
                                </Col>
                                </Row>

                            </Card.Body>
                            </Card>

                        <Card className="share-address-card mt-4 mx-auto" style={{ padding: '20px' }}>
                            <Card.Body>
                                {/* Share Job Section */}
                                <h4 className="text-start" style={{ fontSize: '22px', color: '#4d4d4d' }}>Share this Job</h4>
                                <div className="d-flex justify-content-start align-items-center" style={{ marginTop: '10px' }}>
                                <Button 
                                    variant="primary" 
                                    onClick={copyLink} 
                                    style={{ padding: '5px 15px', marginRight: '10px', backgroundColor: '#ddf2ff', color: '#0a60bb' , border: 'none' }}
                                >
                                    <FaLink className="me-2" style={{ width: '20px', height: '20px' }} />
                                    Copy Link
                                </Button>
                                <Button variant="link" aria-label="Share on Facebook" style={{ padding: '0', maxWidth: '50px', marginRight: '10px' }}>
                                    <FaFacebook style={{ color: '#0a60bb', width: '20px', height: '20px' }} />
                                </Button>
                                <Button variant="link" aria-label="Share on Twitter" style={{ padding: '0', maxWidth: '50px', marginRight: '10px' }}>
                                    <FaTwitter style={{ color: '#0a60bb', width: '20px', height: '20px' }} />
                                </Button>
                                <Button variant="link" aria-label="Share via Email" style={{ padding: '0', maxWidth: '50px' }}>
                                    <FaEnvelope style={{ color: '#0a60bb', width: '20px', height: '20px' }} />
                                </Button>
                                </div>

                                <hr className='text-muted' style={{ marginTop: '20px' }}/>

                                {/* Address Section */}
                                <h4 className="text-start" style={{ fontSize: '22px', color:'#4d4d4d' }}>Job Location</h4>
                                <div className="d-flex justify-content-center align-items-center" style={{ textAlign: 'center' }}>
                                <div
                                    style={{
                                    minWidth: '100%',
                                    color: '#5b5b5b',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    paddingLeft: '30px', 
                                    paddingRight: '30px', 
                                    }}
                                >
                                    {job.address}
                                </div>
                                </div>
                            </Card.Body>
                            </Card>


                            {/* Job Location Map */}
                            <div className="mt-4">
                                <MapComponent job_id={job_id} />
                            </div>

                    </Col>
                </Row>
            </Container>


                <ApplyModal 
                    {...(user?.id && { applicant_id: user.id })}
                    job_id={job_id}
                    jobTitle={job.jobTitle}
                    companyName={job.company_name}
                    show={modalShow} 
                    handleClose={handleCloseModal} 
                />
            
        <style>{`
        @media (max-width: 768px) {
            .breadcrumb-item.active {
                font-size: 11px
            }
            .job-title {
                font-size: 22px !important;  /* Smaller font for mobile */
            }
        
            .company-name {
                font-size: 16px !important;
            }
        
            .job-badge {
                padding: 6px 8px !important;
                font-size: 9px !important;
            }
        
            .job-description-title {
                font-size: 18px !important;
                margin-top: 20px !important;
            }
        
            .job-description {
                font-size: 14px !important;
                line-height: 1.5 !important;
            }
        }
        
        `}</style>
            </>
            )
        };




const FavoritesAndApplyButton = ({ handleShowModal, isBookmarked, handleBookmarkClick, applied }) => {
    return (
        <div className="d-flex mb-2 mt-5 ms-auto" style={{ width: '238px' }}>
            <Button
                variant="light"
                size="lg"
                className="me-1 d-flex align-items-center justify-content-center"
                style={{
                    height: '55px',
                    borderRadius: '5px',
                    background: isBookmarked ? '#d7ecff' : '#f8f9fa',
                    transition: '0.1s',
                    width: '55px',
                    border: 'none',
                }}
                onClick={handleBookmarkClick}
            >
                {isBookmarked ? (
                    <FaBookmark style={{ color: '#0A65CC' }} />
                ) : (
                    <FaRegBookmark style={{ color: '#6c757d' }} />
                )}
            </Button>
            {applied === 'Pending' || applied === 'On hold' || applied === 'Qualified' || applied === 'To Interview' || applied === 'Final Evaluation'  ? (
            <Button
                variant="primary"
                size="lg"
                className="ms-2 d-flex align-items-center justify-content-center"
                style={{
                    backgroundColor: '#d7ecff',
                    borderRadius: '5px',
                    color: '#0A65CC',
                    width: '171px',
                    height: '55px',
                    fontSize: '16px',
                    marginRight: '-110px',
                    fontWeight: '500',
                    border: 'none'
                }}
            >
                Submitted
            </Button>
            ) : (
                        <Button
                variant="primary"
                size="lg"
                className="ms-2 d-flex align-items-center justify-content-center"
                style={{
                    backgroundColor: '#0A65CC',
                    borderRadius: '5px',
                    color: 'white',
                    width: '171px',
                    height: '55px',
                    fontSize: '15px',
                    marginRight: '-110px',
                    fontWeight: '500',
                }}
                onClick={handleShowModal}
            >
                Apply Now <FaArrowRight style={{ marginLeft: '15px' }} />
            </Button> 
            )}
        </div>
    );
};

  export default JobPosting;
