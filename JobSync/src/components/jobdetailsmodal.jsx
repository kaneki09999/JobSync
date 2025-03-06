import React, {useEffect, useState} from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaGraduationCap, FaBriefcase, FaUserTie, FaCalendarAlt, FaMapMarkerAlt, FaRegClock, FaComments, FaTag, FaMoneyBillWave, FaClock, FaUserClock, FaSuitcase } from 'react-icons/fa';
import { getFromEndpoint, postToEndpoint } from '../components/apiService';
import { useAuth } from '../AuthContext'; 
import DOMPurify from 'dompurify'; 
import axios from 'axios';
import Swal from 'sweetalert2';
import apiClient from './apiClient';

const JobDetailsModal = ({ show, handleClose, job_id, application_id }) => {
  const iconStyle = { color: '#0a60bb', fontSize: '1.5em' };
  const [job, setJob] = useState([]);
  const { user } = useAuth();
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
        try {
            const response = await getFromEndpoint(`/getSpecificJob.php?job_id=${job_id}&applicant_id=${user.id}`);
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
                    style={{ padding: '5px 10px', backgroundColor: 'transparent', border: '1px solid #007bff', color: '#007bff', borderRadius: '7px' }}
                >
                    {benefit}
                </span>
            ))}
        </div>
    );
  };

  const handleTakeAssessment = () => {
    setShowAssessmentModal(true); 
  };

  const handleCloseAssessment = () => {
    const hasUnsavedChanges = assessmentTasks.some(
      (task) => answers[task.assessment_id] && answers[task.assessment_id].trim() !== ""
    );
  
    if (hasUnsavedChanges) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You have unsaved changes. All progress will be lost if you close the assessment.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, close it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setAnswers({});
          setShowAssessmentModal(false); 
        }
      });
    } else {
      setShowAssessmentModal(false);
    }
  };
  

  const [assessmentTasks, setAssessmentTasks] = useState([]);

  useEffect(() => {
    const fetchAssessmentTasks = async () => {
      try {
        const response = await axios.get(`${apiClient.defaults.baseURL}/getAssessment.php`, {
          params: { job_id, application_id },
        });
    
        if (response.data?.assessment) {
          setAssessmentTasks(response.data.assessment);
        } else {
          console.error('No assessment found or an error occurred:', response.data?.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching assessment:', error);
      }
    };
  
    if (job_id && application_id) {
      fetchAssessmentTasks();
    }
  }, [job_id, application_id]);

  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (taskId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [taskId]: value,
    }));
  };
  
  const handleSubmitAssessment = async (event) => {
    event.preventDefault();
  
    const assessmentData = Object.entries(answers).map(([taskId, answer]) => ({
      assessment_id: taskId,
      answer,
      applicant_id: user.id,
      application_id,
      job_id,
      jobTitle: job.jobTitle,
    }));
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once submitted, your assessment will be evaluated immediately.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Submitting...',
          text: 'Please wait while your assessment is being evaluated.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
  
        try {
          const response = await postToEndpoint('/saveAssessment.php', {
            assessmentData,
          });
          if (response.data.success && response.data.applied_status) {
            const resultStatus = response.data.applied_status;
            const message = response.data.message || 'Evaluation completed.';
            let additionalNote = '';
            let alertTitle = '';
        
            if (resultStatus === 'Qualified') {
              alertTitle = 'Congratulations!';
              additionalNote = 'Congratulations! You have successfully qualified for the next step. We look forward to your continued success!';
          } else if (resultStatus === 'Rejected') {
              alertTitle = 'Not qualified for this job';
              additionalNote = 'Thank you for application. After careful consideration, we’ve decided to move forward with other candidates. We appreciate your time and wish you success in the future.';
          }
      
          Swal.fire({
              title: alertTitle,
              text: `${additionalNote}`,
              icon: resultStatus === 'Qualified' ? 'success' : 'error',
              confirmButtonText: 'Close',
          }).then(() => {
            setAnswers({});
            handleCloseAssessment 
            window.location.reload(); 
        });
        } else {
            Swal.fire({
                title: 'Submission Failed',
                text: response.data.error || 'An error occurred while submitting your assessment.',
                icon: 'error',
                confirmButtonText: 'Close',
              });
        }
        
        } catch (error) {
          console.error('Error submitting assessment:', error);
  
          Swal.fire({
            title: 'Error',
            text: 'An unexpected error occurred. Please try again later.',
            icon: 'error',
          });
        }
      }
    });
  };
  
  
  const isSubmitEnabled = () => {
    return assessmentTasks.every(
      (task) => answers[task.assessment_id] && answers[task.assessment_id].trim() !== ""
    );
  };
  
  
  return (

    <>
   <Modal show={show && !showAssessmentModal} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Job Details</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{paddingRight: '2rem'}}>
        <div className="d-flex">
          {/* Left Section */}
          <div className="flex-grow-1 me-5 ps-4">
            <div className="d-flex align-items-center mb-3">
              <img
                src={job.logo || './src/assets/default-logo.png'}
                alt="Company Logo"
                className="me-2"
                style={{ width: '100px', height: 'auto' }}
              />
              <div>
                <h5 className="mb-0">{job.jobTitle}</h5>
                <small>{job.city}</small>
              </div>
            </div>

            {/* Job Description */}
            <h6 className="mt-4">Job Description</h6>
            <p className='mb-0' style={{ textAlign: 'justify'}} dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />

            {/* Job Benefits */}
            <h6 className="mt-0">Job Benefits</h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <JobBenefits selectedBenefits={job.selectedBenefits} />
            </div>

            {/* Google Maps Location */}
            <div className="mt-4">
              <iframe
                src="https://www.google.com/maps/embed?..."
                width="100%"
                height="288"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>
          </div>

          {/* Right Section */}
          <div className="border-start ps-3" style={{ minWidth: '330px' }}>
            {/* Apply Buttons */}
            <div className="d-flex mb-3">
            <Button
              variant="outline-primary"
              style={{ width: '200px', height: '45px', fontSize: '15px', padding: '0', backgroundColor: '#0A65CC' , color: 'white', border: 'none' }}
              className={`me-2 ${job.applied_status === "Interview"
                          ? "bg-success"
                          : job.applied_status === "Pending"
                          ? "bg-warning"
                          : job.applied_status === "On hold"
                          ? "bg-secondary"
                          : job.applied_status === "Qualified"
                          ? "bg-primary"
                          : job.applied_status === "Final Evaluation"
                          ? "bg-secondary"
                          : "bg-danger"}`}
            >
            <FaRegClock /> {job.applied_status}
            </Button>
              <Button
                variant="outline-primary"
                style={{ width: '200px', height: '45px', fontSize: '13px', padding: '0' }}
              >
                <FaComments style={iconStyle} /> Chat Employer
              </Button>
            </div>
            <div className="d-flex mb-3 justify-content-center">
            {job.type === 'assessment' && !['Pending', 'To Interview', 'Rejected', 'Qualified', 'Final Evaluation', 'Hired', 'Not Selected'].includes(job.applied_status) && (
              <Button
                style={{
                  width: '200px', height: '45px', fontSize: '13px', padding: '0', background: '#559aff', border: 'none'
                }}
                className="mt-1"
                onClick={handleTakeAssessment}
              >
                Take Assessment
              </Button>
            )}
            </div>

            {/* Job Role and Tags */}
            <div className="mb-3">
              <div className="d-flex justify-content-start align-items-center p-4 border" style={{ border: '2px solid #ccc', borderRadius: '8px' }}>
                <div className="d-flex flex-column align-items-start me-4">
                  <FaUserTie style={iconStyle} className="mb-2" />
                  <h6 className="mb-0" style={{fontSize: '15px'}}>Job Role</h6>
                  <p className="mb-0 mt-1" style={{ fontSize: '14px', padding: '0', margin: '0' }}>{job.jobRole}</p>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <FaTag style={iconStyle} className="mb-2" />
                  <h6 className="mb-0" style={{fontSize: '15px'}}>Tags</h6>
                  <p className="mb-0 mt-1" style={{ fontSize: '14px', padding: '0', margin: '0' }}>{job.jobTags}</p>
                </div>
              </div>
            </div>

            {/* Salary & Type */}
            <div className="d-flex flex-column p-4 border" style={{ border: '2px solid #ccc', borderRadius: '8px' }}>
              <div className="d-flex align-items-center">
                <FaMoneyBillWave style={iconStyle} className="me-3" />
                <div>
                  <h6 className="mb-0 " style={{fontSize: '15px'}}>Salary</h6>
                  <p className="mb-0 mt-1"  style={{fontSize: '14px'}}>₱{job.minSalary} - ₱{job.maxSalary}</p>
                </div>
              </div>

              <div className="d-flex align-items-center mt-3">
                <FaClock style={iconStyle} className="me-3" />
                <div>
                  <h6 className="mb-0" style={{fontSize: '15px'}}>Salary Type</h6>
                  <p className="mb-2 mt-1" style={{fontSize: '14px'}}>{job.salaryType}</p>
                </div>
              </div>

              <hr style={{ margin: '5px 0' }} />

              {/* Advance Information */}
              <div className="mb-0 mt-3">
                <h6 style={{fontSize: '17px'}}>Advance Information</h6>
                <ul className="list-unstyled">
                {[
                    { icon: <FaGraduationCap style={iconStyle} className="me-3" />, title: 'Education', value: job.education },
                    { icon: <FaUserClock style={iconStyle} className="me-3" />, title: 'Experience', value: job.experience },
                    { icon: <FaBriefcase style={iconStyle} className="me-3" />, title: 'Job Type', value: job.jobType },
                    { icon: <FaSuitcase style={iconStyle} className="me-3" />, title: 'Job Level', value: job.jobLevel },
                    { 
                      icon: <FaCalendarAlt style={iconStyle} className="me-3" />, 
                      title: 'Expiration Date', 
                      value: new Date(job.expirationDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) 
                    }
                  ].map((item, index) => (
                    <div key={item.title}>  {/* Use item.title or another unique property */}
                      <li className="d-flex align-items-center mt-3">
                        {item.icon}
                        <div>
                          <h6 className="mb-0" style={{ fontSize: '15px' }}>{item.title}</h6>
                          <p className="mb-2 mt-1" style={{ fontSize: '14px' }}>{item.value}</p>
                        </div>
                      </li>
                      {index !== 4 && <hr style={{ margin: '5px 0' }} />}
                    </div>
                  ))}
                </ul>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <div className='border p-4' style={{ borderRadius: '8px', padding: '10px', marginTop: '10px' }}>
                <h6 style={{fontSize: '17px'}}>Location</h6>
                <ul className="list-unstyled" style={{ margin: '0' }}>
                {[
                    { icon: <FaMapMarkerAlt style={iconStyle} className="me-3" />, title: 'Address', value: job.address },
                    { icon: <FaMapMarkerAlt style={iconStyle} className="me-3" />, title: 'City', value: job.city },
                  ].map((item, index) => (
                    <div key={item.title}>  {/* Use item.title or another unique property */}
                      <li className="d-flex align-items-center mt-3">
                        {item.icon}
                        <div>
                          <h6 className="mb-1" style={{fontSize: '15px'}}>{item.title}</h6>
                          <p className="mb-2 mt-1" style={{fontSize: '14px'}}>{item.value}</p>
                        </div>
                      </li>
                      {index !== 1 && <hr style={{ margin: '5px 0' }} />}
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>

      {/* Assessment Modal */}
      <Modal show={showAssessmentModal} onHide={handleCloseAssessment} size="lg" >
      <Modal.Header closeButton>
        <Modal.Title style={{ display: 'flex', justifyContent: 'center', width: '100%',}}>Assessment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="flex-grow-1 me-4   ps-4">
          <div className="d-flex align-items-center mb-3">
            <img
              src={job.logo || "./src/assets/default-logo.png"}
              alt="Company Logo"
              className="me-2"
              style={{ width: "100px", height: "auto" }}
            />
            <div>
              <h5 className="mb-0">{job.jobTitle}</h5>
              <small>{job.city}</small>
            </div>
          </div>

          <div className="mt-4">
            <h6>Assessment Task</h6>
            <p className="text-muted">
              <strong>Note:</strong> Please adhere to the provided instructions and ensure that your responses are thoughtful, well-reasoned, and accurate.
            </p>
            {Object.entries(
              assessmentTasks.reduce((groups, task) => {
                if (!groups[task.type]) groups[task.type] = [];
                groups[task.type].push(task);
                return groups;
              }, {})
            ).map(([type, tasks]) => (
              <div key={type} className="mb-4">
                <h6 className="text-primary text-capitalize" style={{ fontSize: "18px" }}>
                  {type}
                </h6>
                {type === "Aptitude Tests" && (
                  <p className="text-muted mb-2">
                    <strong>Note:</strong> For aptitude tests, please ensure your answers are in the correct format (e.g., <code>A) Banana </code>).
                  </p>
                )}
                {tasks.map((task, index) => (
                  <div key={task.assessment_id} className="mb-3">
                    <label htmlFor={`task${task.assessment_id}`} className="form-label">
                      {index + 1}.{" "}
                      <span style={{ whiteSpace: "pre-wrap" }}>
                        {task.instructions}
                      </span>
                    </label>
                    <textarea
                      id={`task${task.assessment_id}`}
                      className="form-control"
                      rows={type === "Aptitude Tests" ? 1 : 4 } 
                      placeholder={type === "Aptitude Tests"? "e.g., A) Apple or a) Apple" : "Type your response here..."}
                      value={answers[task.assessment_id] || ""}
                      onChange={(e) => handleAnswerChange(task.assessment_id, e.target.value)}
                      style={{
                        whiteSpace: "pre-wrap",
                        height: type === "Aptitude Tests" ? "auto" : "100px", 
                      }}
                    ></textarea>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer
        style={{
          paddingLeft: "2rem",
          paddingRight: "2rem",
          justifyContent: "space-between",
        }}
      >
        <Button
          style={{
            height: "40px",
            fontSize: "12px",
            borderRadius: "3px",
            width: "75px",
            color: "#156ad7",
            background: "#bce0ff",
            border: "none",
            fontWeight: "700",
          }}
          onClick={handleCloseAssessment}
        >
          Close
        </Button>
        <Button
          type="submit"
          className="btn btn-primary"
          style={{
            width: "150px",
            height: "40px",
            fontSize: "12px",
            borderRadius: "3px",
            background: "#156ad7",
            fontWeight: "500",
          }}
          onClick={handleSubmitAssessment}
          disabled={!isSubmitEnabled()}
        >
          Submit Assessment
        </Button>
      </Modal.Footer>
    </Modal>

      </>
  );
};

export default JobDetailsModal;
