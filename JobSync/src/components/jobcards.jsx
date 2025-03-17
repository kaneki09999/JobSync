import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { getFromEndpoint, postToEndpoint } from '../components/apiService';
import { motion, AnimatePresence } from 'framer-motion'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { Card, Col, Row } from 'react-bootstrap';
import { FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

const JobCards = ({ jobs, applicantId }) => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedJob, setSelectedJob] = useState(null); // Track the selected job
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      try {
        const response = await getFromEndpoint('/getFavoriteJobs.php', {
          applicant_id: applicantId,
        });
        if (response.data.success) {
          setBookmarkedJobs(response.data.bookmarkedJobs);
        }
      } catch (error) {
        console.error('Error fetching bookmarked jobs:', error);
      }
    };
    if (applicantId) {
      fetchBookmarkedJobs();
    }
  }, [applicantId]);

  const handleBookmarkClick = async (jobId) => {
    if (!applicantId) {
      navigate('/candidate_login');
      return;
    }
    try {
      const isBookmarked = bookmarkedJobs.includes(jobId);
      const endpoint = isBookmarked
        ? '/deleteFavoriteJob.php'
        : '/saveFavoriteJob.php';

      const response = await postToEndpoint(endpoint, {
        applicant_id: applicantId,
        job_id: jobId,
      });

      if (response.data.success) {
        setBookmarkedJobs((prev) =>
          isBookmarked
            ? prev.filter((id) => id !== jobId)
            : [...prev, jobId]
        );
      } else {
        alert(response.data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error adding/removing job from favorites:', error);
      alert('An error occurred while updating the job favorites.');
    }
  };

  // Handle click on a card in desktop mode
  const handleCardClick = (job) => {
    if (isMobile) {
        navigate(`/jobdetails/${job.job_id}`);
        return;
    }

  if (typeof job.selectedBenefits === 'string') {
    job.selectedBenefits = job.selectedBenefits
      .split(',')
      .map((b) => b.trim());
  }
  setSelectedJob(job);
};

  if (!jobs || jobs.length === 0) {
    return (
      <div
        className="my-5 container no-posted"
        style={{ width: '1190px', height: '27vh' }}
      >
        <h5
          style={{
            marginTop: '135px',
            fontWeight: '400',
            color: '#4d4d4d',
          }}
        >
          This employer has not posted any job openings at this time.
        </h5>
      </div>
    );
  }


  return (
    <>
      <div className={`jobs-container ${jobs.length <= 3 ? 'fixed-width' : ''}`}>
        {/* Flex container: left column (cards) + right column (details) */}
        <div className="d-flex" style={{ width: '100%' }}>
          {/* LEFT COLUMN: Job Cards */}
          <div
            className="jobs-list d-flex flex-column"
            style={{
              width: isMobile ? '100%' : '50%', // Occupy full width on mobile
              paddingRight: isMobile ? '0' : '3rem',
            }}
          >
<AnimatePresence>
  {jobs.map((job) => {
    // Calculate "days ago"
    const jobDate = new Date(job.job_created_at);
    const today = new Date();
    const timeDiff = Math.abs(today - jobDate);
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return (
      <motion.div
        key={job.job_id}
        style={{ width: '100%' }}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="border p-4 position-relative job-container mb-3"
          style={{
            border: '1px solid #e6e6e6',
            borderRadius: '10px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            background:
              'linear-gradient(90deg, rgba(239,246,255,1) 1%, rgba(255,255,255,1) 100%)',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          onClick={() =>
            isMobile
              ? navigate(`/jobdetails/${job.job_id}`)
              : handleCardClick(job)
          }
          onMouseEnter={(e) => {
            if (isMobile) return;
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            if (isMobile) return;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {/* Top Content */}
          <div>
            {/* Title */}
            <h5 className="mb-2 font-weight-bold text-start text-dark">
              {job.jobTitle}
            </h5>

            {/* Job Role */}
            <p className="mb-3 text-start text-muted" style={{ fontSize: '14px' }}>
              {job.jobRole}
            </p>

            {/* Job Type & Salary */}
            <p className="text-start mb-3">
              <span
                style={{
                  color: '#0c912a',
                  fontWeight: '500',
                  backgroundColor: '#bef1c6',
                  borderRadius: '5px',
                  padding: '5px 8px',
                  fontSize: 'small',
                  textTransform: 'uppercase',
                }}
              >
                {job.jobType}
              </span>
              <span
                className="ml-2 text-muted ms-1"
                style={{ fontSize: '14px' }}
              >
                Salary: ₱{job.minSalary} - ₱{job.maxSalary}
              </span>
            </p>

            {/* Company Info */}
            <div className="d-flex align-items-center mb-3">
              <img
                src={job.logo}
                alt="Logo"
                style={{
                  width: '50px',
                  height: '50px',
                  marginRight: '15px',
                  borderRadius: '8px',
                }}
              />
              <div>
                <p className="mb-1 text-start font-weight-bold">
                  {job.company_name}
                </p>
                <div className="d-flex align-items-center text-muted">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ marginRight: '5px' }}
                  />
                  <p className="mb-0">{job.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="d-flex justify-content-between align-items-center">
            {/* Days Ago */}
            <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>
              {daysAgo === 0 ? 'Today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`}
            </p>

            {/* Bookmark Icon */}
            <FontAwesomeIcon
              icon={
                bookmarkedJobs.includes(job.job_id)
                  ? solidBookmark
                  : regularBookmark
              }
              className="position-absolute"
              style={{
                right: '15px',
                top: '15px',
                fontSize: '20px',
                cursor: 'pointer',
                color: bookmarkedJobs.includes(job.job_id)
                  ? '#007bff'
                  : '#bbbbbb',
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                handleBookmarkClick(job.job_id);
              }}
            />
          </div>
        </div>
      </motion.div>
    );
  })}
</AnimatePresence>

          </div>

          {/* RIGHT COLUMN: Detail Panel - Hidden on Mobile */}
          {!isMobile && (
            <div
              style={{
                width: '80%',
                minHeight: '600px',
                backgroundColor: '#f8f9fa',
                padding: '1rem 1rem 0 2rem',
                borderLeft: '1px solid #ddd',
                textAlign: 'left',
                marginBottom: '1rem',
                borderRadius: '20px'
              }}
            >
           {/* If no job is selected, show a default message */}
            {!selectedJob ? (
              <>
           <div style={{ color: '#333', padding: '1rem', animation: 'fadeIn 0.5s ease-in-out' }}>
            <h4>Select a job to view details</h4>
            <p>Please click on a job card from the list on the left to see more information here.</p>
          </div>
         
         <style>{`
           @keyframes fadeIn {
             from { opacity: 0; transform: translateY(5px); }
             to { opacity: 1; transform: translateY(0); }
           }`}
         </style>
         </>
            ) : (
            <div style={{    color: '#333',
            position: 'sticky',
            top: '0',
            alignSelf: 'flex-start', // Important for sticky inside flex
            maxHeight: '100vh',
            overflowY: 'auto',
            paddingRight: '1rem'}}>
                {/* BACK BUTTON (desktop only) */}
                {/* <button
                onClick={() => setSelectedJob(null)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0d6efd',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                }}
                >
                <i className="fas fa-arrow-left" style={{ marginRight: '5px' }}></i>
                </button> */}

                {/* JOB HEADER */}
                <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '1rem',
                }}
                >
                    {/* LOGO */}
                    {selectedJob.logo && (
                        <img
                            src={selectedJob.logo || '/fallback-logo.png'}
                            alt={selectedJob.jobTitle}
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                            }}
                        />
                    )}
                        
                    {/* TITLE & COMPANY */}
                    <div>
                        <span className="no-margin text-start job-title" style={{
                            fontSize: '1.5rem',
                            fontWeight: '500',
                        }}>{selectedJob.jobTitle}</span>
                            <p style={{ margin: 0, color: '#666' }}>{selectedJob.company_name}</p>
                    </div>
                </div>

                {/* See more */}
                <Link to={`/jobdetails/${selectedJob.job_id}`} 
                    className="btn btn-primary mt-4" style={{ padding: '10px 20px' }}
                >
                    See more
                </Link>

                <Card className="salary-location mt-4" style={{ width: '100%', padding: '15px' }}>
                    <Card.Body>
                        <Row className="text-center">
                            <Col xs={6} className="d-flex flex-column align-items-center border-end">
                                <FaMoneyBillWave style={{ color: '#0a60bb', width: '30px', height: '30px' }} />
                                <strong className="mt-2">Salary</strong>
                                <div style={{ color: '#0BA02C' }}>₱{selectedJob.minSalary} - ₱{selectedJob.maxSalary}</div>
                                <div style={{ color: '#868686', fontSize: '14px' }}>{selectedJob.salaryType} Salary</div>
                            </Col>
                            <Col xs={6} className="d-flex flex-column align-items-center">
                                <FaMapMarkerAlt style={{ color: '#0a60bb', width: '30px', height: '30px' }} />
                                <strong className="mt-2">Location</strong>
                                <div style={{ color: '#868686' }}>{selectedJob.city}</div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className="salary-location mt-4" style={{ width: '100%', padding: '15px' }}>
                    <Card.Body>
                {selectedJob.selectedBenefits?.length > 0 && (
                    <div>
                      <h4>Job Benefits</h4>
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        {selectedJob.selectedBenefits.map((benefit, index) => (
                          <span
                            key={index}
                            className="badge"
                            style={{
                              padding: '10px',
                              borderRadius: '5px',
                              fontSize: '14px',
                              color: '#1978db',
                              background: '#d3eeff',
                            }}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                                      </Card.Body>
                </Card>
               
                {/* JOB DESCRIPTION */}
                <h4 style={{ marginTop: '1.5rem' }}>Job Description</h4>
                {selectedJob.jobDescription ? (
                <div
                    dangerouslySetInnerHTML={{ __html: selectedJob.jobDescription }}
                    style={{ marginTop: '1rem', lineHeight: '1.6' }}
                />
                ) : (
                <p style={{ marginTop: '1rem' }}>
                    No detailed description provided for this job.
                </p>
                )}      

            </div>
            )}
            </div>
          )}
        </div>
      </div>
      <style>{`
      ::-webkit-scrollbar {
        width: 10px;
        border-radius: 20px
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 25px;
        background: -webkit-gradient(linear, left top, left bottom, from(#9c9999), to(#9c9999));
        box-shadow: none;
      }
             
      ::-webkit-scrollbar-track {
        background: none;
        border-radius: 20px
      }
      `}</style>
    </>
  );
};



export default JobCards;
