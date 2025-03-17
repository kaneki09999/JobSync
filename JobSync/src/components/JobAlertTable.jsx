import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from './Pagination';
import { useAuth } from '../AuthContext'; 
import { getFromEndpoint } from '../components/apiService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPesoSign, faCalendar, faTimesCircle, faBookmark, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, Image, Badge, Button } from 'react-bootstrap';
import jobsynclogo_style_3 from '../assets/logo3.png';

function JobAlerts() {
  const { user } = useAuth(); 
  const [jobs, setJobs] = useState([]);  
  const [jobsmatch, setJobsMatch] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
      if (!user || !user.id) {
          console.error('Applicant ID is required');
          return;
      }
  
      const fetchAlertJobs = async () => {
          try {
              const response = await getFromEndpoint('/getAlertJob.php');
              const fetchedJobs = Array.isArray(response.data) ? response.data : response.data.favoriteJobs || [];
              setJobs(fetchedJobs); 
          } catch (error) {
              console.error('There was an error fetching the jobs data!', error);
          }
      };
  
      fetchAlertJobs(); 
  }, [user]); 
  
  useEffect(() => {
      if (!user || !user.id) {
          console.error('Applicant ID is required');
          return;
      }

      const fetchAlertJobsMatch = async () => {
          try {
              const response = await getFromEndpoint('/getAlertJobMatch.php', { applicant_id: user.id });
              const fetchedJobs = Array.isArray(response.data) ? response.data : response.data.favoriteJobs || [];
              setJobsMatch(fetchedJobs); 
          } catch (error) {
              console.error('There was an error fetching the jobs data!', error);
          }
      };

      fetchAlertJobsMatch(); 
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

  const displayJobs = jobsmatch.length > 0 ? jobsmatch : jobs;

  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = Array.isArray(displayJobs) ? displayJobs.slice(indexOfFirstJob, indexOfLastJob) : []; 

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid className="p-0">
      {currentJobs.length > 0 ? (
        currentJobs.map((job, index) => (
          <Row key={job.id || index} className="d-flex align-items-center p-3 border-bottom">
            <Col xs={12} md={8} className="d-flex align-items-start">

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

              <div>
              <div className="d-flex align-items-start mb-2">
                  <h6 className="mb-0 me-3" style={{color: '#373737'}}>{job.jobTitle}</h6>
                  <span
                    className="badge" 
                    style={{
                      background: '#cde8ff',
                      padding: '7px 13px',
                      color: '#0076df',
                      fontWeight: '600',
                      borderRadius: '50px',
                      fontSize: '11px'
                    }}
                  >
                    {job.jobType}
                  </span>

                  {job.freshness === 'New' ? (
                  <span
                    className="badge" 
                    style={{
                      background: '#cde8ff',
                      padding: '7px 13px',
                      color: '#0076df',
                      fontWeight: '600',
                      borderRadius: '50px',
                      fontSize: '11px',
                      marginLeft: '6px'
                    }}
                  >
                    {job.freshness}
                  </span>
                  ) : ('')}
                </div>
                <small className="d-flex flex-wrap align-items-center" style={{ color: '#7e7b7b' }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" style={{ color: '#3c88cc' }} />
                  <span className="me-2">{job.city}</span>
                  <FontAwesomeIcon icon={faPesoSign} className="ms-1" style={{ color: '#9ea0a2' }} />
                  <span className="ms-2">₱{job.minSalary} - ₱{job.maxSalary}</span>
                  {calculateDaysLeft(job.expirationDate) ? (
                    <span className="ms-2 d-flex align-items-center">
                      <FontAwesomeIcon icon={faCalendar} className="ms-1 me-2" style={{ color: '#7eb5e9', fontSize: '15px' }} />
                      {`${calculateDaysLeft(job.expirationDate)} Remaining`}
                    </span>
                  ) : (
                    <span className="ms-2" style={{ color: '#d70e0e' }}>
                      <FontAwesomeIcon icon={faTimesCircle} className="ms-1 me-2" style={{ fontSize: '16px' }} />
                      Job {job.status}
                    </span>
                  )}
                </small>
              </div>
            </Col>
            <Col xs={12} md={4} className="d-flex justify-content-md-end align-items-center mt-3 mt-md-0 btn-view">
              <FontAwesomeIcon icon={faBookmark} className="me-3" style={{ cursor: 'pointer' }} />
              {calculateDaysLeft(job.expirationDate) ? (
               <Link to={`/jobdetails/${job.job_id}`}>
               <button className="btn btn-primary btn-sm"
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
                 View Details <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '10px' }} />
               </button>
             </Link>
           ) : (
             <button className="btn btn-primary btn-sm"
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
              )}
            </Col>
          </Row>
        ))
      ) : (
        <p>No job alerts found.</p>
      )}
      <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={displayJobs.length} paginate={paginate} />

      <style>{`
        @media (max-width: 768px) {
          .btn-view {
            justify-content: center !important;
          }
        }
      `}</style>
    </Container>
  );
}

export default JobAlerts;
