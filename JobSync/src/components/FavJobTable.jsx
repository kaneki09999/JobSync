import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import { useAuth } from '../AuthContext'; 
import { getFromEndpoint } from '../components/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPesoSign, faCalendar, faTimesCircle, faBookmark, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, Image, Button, Badge } from 'react-bootstrap';
import jobsynclogo_style_3 from '../assets/logo3.png';

function FavoriteJob() {
  const { user } = useAuth(); 
  const [jobs, setJobs] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
      if (!user || !user.id) {
          console.error('Applicant ID is required');
          return;
      }
  
      const fetchFavoriteJobs = async () => {
          try {
              const response = await getFromEndpoint('/getAllFavoriteJob.php', { applicant_id: user.id });
              const fetchedJobs = Array.isArray(response.data) ? response.data : response.data.favoriteJobs || [];
              setJobs(fetchedJobs); 
          } catch (error) {
              console.error('There was an error fetching the jobs data!', error);
          }
      };
  
      fetchFavoriteJobs(); 
  }, [user]); 

  const calculateDaysLeft = (expirationDate) => {
    if (!expirationDate) return '';
    const today = new Date();
    const timeDifference = new Date(expirationDate) - today;
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysLeft === 1) {
        return '1 Day';
    } else if (daysLeft > 0) {
        return `${daysLeft} Days`;
    } 
    return null;
};

  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = Array.isArray(jobs) ? jobs.slice(indexOfFirstJob, indexOfLastJob) : []; 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
<Container fluid className="p-0">
    {currentJobs.length > 0 ? (
        currentJobs.map((job, index) => (
            <Row key={job.id || index} className="border-bottom py-3 align-items-center" style={{ paddingTop: '1.1rem', paddingBottom: '1.1rem' }}>
                {/* Job Logo */}
                <Col xs={2} md={1} className="text-center">
                    {/* <Image src={job.logo} alt="Job Logo" width="50" height="50" rounded /> */}

                    <img
                        src={job.logo}
                        alt="Job Logo"
                        className="me-2"
                        style={{ width: "50px" }}
                        onError={(e) => {
                        e.target.onerror = null; // Prevents looping if the default image fails too
                        e.target.src = jobsynclogo_style_3; // Path to your default image
                        }}
                    />
                </Col>

                {/* Job Details */}
                <Col xs={7} md={8}>
                    <div className="d-flex align-items-center mb-2">
                        <h6 className="mb-0 text-dark me-2 header6" style={{ fontSize: '16px' }}>{job.jobTitle}</h6>
                        <span
                            className="badge"
                            style={{
                                background: '#cde8ff',
                                padding: '5px 10px',
                                color: '#0076df',
                                fontWeight: '600',
                                borderRadius: '50px',
                                fontSize: '10px'
                            }}
                        >
                            {job.jobType}
                        </span>
                    </div>

                    <small className="d-flex align-items-center mb-1" style={{ color: '#7e7b7b', fontSize: '14px' }}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" style={{ color: '#3c88cc' }} />
                        <span className="me-2">{job.city}</span>

                        <FontAwesomeIcon icon={faPesoSign} className="ms-1 d-none d-md-block" style={{ color: '#9ea0a2' }} />
                        <span className="ms-2 d-none d-md-block">₱{job.minSalary}</span>
                        <span className="ms-1 d-none d-md-block">-</span>
                        <span className="ms-1 d-none d-md-block">₱{job.maxSalary}</span>

                        {calculateDaysLeft(job.expirationDate) ? (
                            <span className="ms-2 d-none d-md-block">
                                <FontAwesomeIcon icon={faCalendar} className="ms-1 me-2" style={{ color: '#7eb5e9', fontSize: '14px' }} />
                                {`${calculateDaysLeft(job.expirationDate)} Remaining`}
                            </span>
                        ) : (
                            <span className="ms-2 d-none d-md-block" style={{ color: '#d70e0e' }}>
                                <FontAwesomeIcon icon={faTimesCircle} className="ms-1 me-2" style={{ fontSize: '16px' }} />
                                Job {job.status}
                            </span>
                        )}
                    </small>
                </Col>

                {/* Actions */}
                <Col xs={3} md={3} className="d-flex justify-content-end align-items-center">
                    <FontAwesomeIcon icon={faBookmark} className="me-2 d-none d-md-block" style={{ cursor: 'pointer' }} />

                    <div className="d-flex align-items-center">
              {calculateDaysLeft(job.expirationDate) ? (
                <>
              <Link to={`/jobdetails/${job.job_id}`}>
                <button className="btn btn-primary btn-sm view-btn"
                style={{
                  width: '150px',
                  height: '46px',
                  fontWeight: '500',
                  marginTop: '5px',
                  background: '#ddf2ff',
                  color: '#0064ff',
                  padding: '10px',
                  borderRadius: '3px',
                  fontSize:'13px',
                  border: 'none'
                }}
                >
                  View Details <FontAwesomeIcon icon={faArrowRight} className='d-none d-md-inline' style={{ marginLeft: '10px' }} />
                  </button>
              </Link>
                  </>
                ) : (
                  <>
                <button className="btn btn-primary btn-sm view-btn"
                style={{
                  width: '150px',
                  height: '46px',
                  fontWeight: '500',
                  marginTop: '5px',
                  background: '#e7ebed',
                  color: '#848484',
                  padding: '10px',
                  borderRadius: '3px',
                  fontSize:'13px',
                  border: 'none'
                }}
                >
                  Deadline Expired
                  </button>
                  </>
                )}
            </div>
                </Col>
            </Row>
        ))
    ) : (
        <p>No favorite jobs found.</p>
    )}

    {/* Pagination */}
    <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={jobs.length} paginate={paginate} />
</Container>

<style>
{`
    @media (max-width: 768px) {
        .badge {
            font-size: 9px !important;
            padding: 4px 8px !important;
        }
    }
    @media (max-width: 470px) {
      .view-btn {
          width: 120px !important;
          font-size: 11px !important;
      }
  }

  @media (max-width: 420px) {
    .header6 {
      font-size: 14px !important
    }
    .view-btn {
        width: 110px !important;
        font-size: 11px !important;
        height: 36px !important;
        margin-top: 35px !important;
    }
}
`}
</style>
</>
  );
}

export default FavoriteJob;
