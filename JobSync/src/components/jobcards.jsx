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

const JobCards = ({ jobs, applicantId }) => {
    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchBookmarkedJobs = async () => {
            try {
                const response = await getFromEndpoint('/getFavoriteJobs.php', { applicant_id: applicantId });

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
                job_id: jobId
            });
    
            if (response.data.success) {
                setBookmarkedJobs((prevBookmarkedJobs) =>
                    isBookmarked
                        ? prevBookmarkedJobs.filter((id) => id !== jobId)  
                        : [...prevBookmarkedJobs, jobId] 
                );
            } else {
                alert(response.data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error adding/removing job from favorites:', error);
            alert('An error occurred while updating the job favorites.');
        }
    };

    if (!jobs || jobs.length === 0) {
        return (
            <>
            <div className='my-5 container no-posted' style={{ width: '1190px', height: '27vh' }}>
                <h5 style={{ marginTop: '135px', fontWeight: '400', color: '#4d4d4d' }}>
                    This employer has not posted any job openings at this time.
                </h5>
            </div>
            <style>{`
            @media (max-width: 768px) {
                .no-posted {
                    width: 100% !important;
                }
            }
            `}</style>
            </>
        );
    }

    return (
    <>
        <div className={`jobs-container ${jobs.length <= 3 ? 'fixed-width' : ''}`}>
                <div className="row justify-content-center">
                    <AnimatePresence>
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.job_id}
                                className="col-12 col-md-6 col-lg-4 mb-4"
                                initial={{ opacity: 0, y: 2 }}  
                                animate={{ opacity: 1, y: 0 }}  
                                exit={{ opacity: 0, y: -5 }}  
                                transition={{ duration: 0.3 }}
                            >
                                <div
                                    className="border p-4 position-relative job-container"
                                    style={{
                                        border: '1px solid #e6e6e6',
                                        borderRadius: '10px',
                                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                                        maxWidth: '100%',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        cursor: 'pointer',
                                        background: 'linear-gradient(90deg, rgba(239,246,255,1) 1%, rgba(255,255,255,1) 100%)'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    <Link to={`/jobdetails/${job.job_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h5 className="mb-3 font-weight-bold text-start text-dark">{job.jobTitle}</h5>
                                        <p className="text-start mb-3">
                                            <span
                                                style={{
                                                    color: '#0c912a',
                                                    fontWeight: '500',
                                                    backgroundColor: '#bef1c6',
                                                    borderRadius: '5px',
                                                    padding: '5px 8px',
                                                    fontSize: 'small',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                {job.jobType}
                                            </span>
                                            <span className="ml-2 text-muted ms-1" style={{ fontSize: '14px' }}>
                                                Salary: ₱{job.minSalary} - ₱{job.maxSalary}
                                            </span>
                                        </p>
                                        <div className="d-flex align-items-center mb-3">
                                            <img
                                                src={job.logo}
                                                alt="Logo"
                                                style={{ width: '50px', height: '50px', marginRight: '15px', borderRadius: '8px' }}
                                            />
                                            <div>
                                                <p className="mb-1 text-start font-weight-bold">{job.company_name}</p>
                                                <div className="d-flex align-items-center text-muted">
                                                    <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '5px' }} />
                                                    <p className="mb-0">{job.city}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <FontAwesomeIcon
                                        icon={bookmarkedJobs.includes(job.job_id) ? solidBookmark : regularBookmark}
                                        className="position-absolute"
                                        style={{
                                            right: '15px',
                                            top: '15px',
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            color: bookmarkedJobs.includes(job.job_id) ? '#007bff' : '#bbbbbb'
                                        }}
                                        onClick={() => handleBookmarkClick(job.job_id)}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
        </div>  
        <style>{`
        .jobs-container {
            width: 1215px;
            margin: auto;
        }
        
        @media (max-width: 1200px) {
            .jobs-container {
                width: 100%;
                padding: 0 15px;
            }
        }
        
        @media (max-width: 768px) {
            .no-posted {
                width: 100% !important;
            }
            .jobs-container {
                width: 100%;
                padding: 0 10px;
            }
        }
        
        `}</style>
    </>
    );
};

export default JobCards;
