import React, { useState, useEffect, useRef } from 'react';
import { postToEndpoint } from '../components/apiService';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../AuthContext'; 
import { FaUsers, FaEllipsisV, FaBullhorn, FaEye, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelectedJobStore } from '../store/SelectedJobStore';

const JobRow = ({ job, handleShowModal }) => {
    const navigate = useNavigate();
    const statusColor = job.status === 'Active' ? '#5bbc80' : '#dc3545';

    const handleViewApplications = () => {
        navigate(`/viewapplications/${job.job_id}/${job.jobTitle}`);
    };

    return (
<tr className="border-bottom">
    {/* Job details */}
    <td style={{ textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <div>
            <h6 className="mb-0" style={{ padding: '5px', textAlign: 'left', color: '#444444', fontSize: 'clamp(12px, 2vw, 16px)' }}>{job.jobTitle}</h6>
            <small className="text-muted d-block d-md-inline" style={{ marginLeft: '6px' }}>{job.jobType}</small>
            <small className="text-muted d-none d-md-inline" style={{ left: '9px', position: 'relative' }}> • </small>
            <small className='text-muted d-block d-md-inline remaining' style={{ left: '16px', position: 'relative' }}>
                {job.remainingDays > 0
                    ? `${job.remainingDays} days remaining`
                    : `${new Date(job.expirationDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    })}`}
            </small>
        </div>
    </td>

    {/* Status */}
    <td className="text-center">
        <span className="d-inline-block" style={{ color: statusColor, padding: '10px', fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: '700', marginTop: '5px' }}>
            {job.status === 'Active' ? <FaCheck className="me-1" /> : <FaTimes className="me-1" />}
            {job.status}
        </span>
    </td>

    {/* Applications */}
    <td className="text-center">
        <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '15px', color: '#656565', fontWeight: '500', fontSize: 'clamp(12px, 2vw, 14px)' }}>
            <FaUsers className="me-2" style={{ fontSize: 'clamp(14px, 2vw, 17px)' }} />
            <span>{job.applicant_count}</span>
            <span className="ms-1 d-none d-sm-inline">Applications</span>
        </div>
    </td>

    {/* Actions */}
    <td className="text-center">
    <div className="d-flex justify-content-center align-items-center flex-wrap">
        <button
            className="btn btn-sm btn-light text-primary"
            style={{
                width: '100%',
                maxWidth: '120px',
                fontWeight: '500',
                marginTop: '5px',
                background: '#ddf2ff',
                padding: '8px',
                borderRadius: '6px',
                fontSize: 'clamp(12px, 2vw, 14px)'
            }}
            onClick={handleViewApplications}
        >
            {/* Show text on larger screens */}
            <span className="d-none d-md-inline">View</span>
            {/* Show icon on smaller screens */}
            <span className="d-inline d-md-none">
                <FaEye />
            </span>
        </button>
        <button
            className="btn btn-sm btn-light text-primary fw-bold ms-2 mt-2 mt-md-0"
            style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}
            onClick={(e) => handleShowModal(job, e)}
        >
            <FaEllipsisV />
        </button>
    </div>
</td>

</tr>
    );
};

const PostedJobTable = () => {
    const { user } = useAuth(); 
    const [jobs, setJobs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [showPromoteModal, setShowPromoteModal] = useState(false);
    const [promotionDate, setPromotionDate] = useState(''); 
    const modalRef = useRef();
    const currentPath = window.location.pathname;
    const displayedJobs = currentPath === '/employer/overview' 
    ? jobs.filter(job => job.status !== 'Expired').slice(0, 9)
    : jobs;

    const navigate = useNavigate();

    const { 
        setSelectedJob: setSelectedJobStore,
     } = useSelectedJobStore();

    
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await postToEndpoint('/getPostJobs.php', { employer_id: user.id });
                if (response.data?.jobs) {
                    setJobs(response.data.jobs);
                } else {
                    console.error('No jobs found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
    
        fetchJobs();
    }, [user.id]);


    useEffect(() => {
        const today = new Date();
        today.setDate(today.getDate() + 1); 
        setPromotionDate(today);
    }, []);

    
    const handleShowModal = (job, event) => {
        setSelectedJob(job);
        const buttonRect = event.target.getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.left + window.scrollX,
        });
        setShowModal(true);
    };

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
    };

    const calculateDaysLeft = (date) => {
        if (!date) return '';
        const today = new Date();
        const timeDifference = new Date(date) - today;
        const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
        return daysLeft >= 0 ? daysLeft : 0;
    };

    useEffect(() => {
        if (showPromoteModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showPromoteModal]);

    useEffect(() => {
        if (showModal) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [showModal]);


    const handleOptionClick = async (option) => {
        if (option === 'Promote Job') {
            if (selectedJob?.status === 'Active') {
                alert('This job is already active and cannot be promoted again.');
            } else {
                setShowPromoteModal(true);
            }
        } else if (option === 'Make it Expire' && selectedJob) {
            try {
                const response = await postToEndpoint('/makeJobExpire.php', {
                    employer_id: user.id,
                    job_id: selectedJob.job_id, 
                });
    
                if (response.data?.success) {
                    const expiredDate = new Date();
                    setJobs((prevJobs) => {
                        const updatedJobs = prevJobs.map((job) =>
                            job.job_id === selectedJob.job_id
                                ? {
                                      ...job,
                                      status: 'Expired',
                                      expirationDate: expiredDate,
                                      remainingDays: 0,
                                  }
                                : job
                        );
    
                        const activeJobs = updatedJobs.filter((job) => job.status === 'Active');
                        const expiredJobs = updatedJobs.filter((job) => job.status === 'Expired');
                        return [...activeJobs, ...expiredJobs];
                    });
                    setShowModal(false);
                } else {
                    console.error('Error updating expiration date:', response.data.error);
                }
            } catch (error) {
                console.error('Error in making job expire:', error);
            }
        } else if (option === 'Edit A Job') {
            navigate(`/employer/edit-job-posted/${selectedJob.job_id}`);
            setSelectedJobStore(selectedJob);
        } else {
            console.log(`${option} for job: ${selectedJob?.jobTitle}`);
            setShowModal(false);
        }
    };  
    

    const handlePromoteSubmit = async () => {
        if (!selectedJob || !promotionDate) return;
    
        try {
            const response = await postToEndpoint('/promoteJob.php', {
                job_id: selectedJob.job_id,
                expirationDate: promotionDate.toISOString().split('T')[0],
            });
    
            if (response.data?.status === 'success') {
                setJobs((prevJobs) => {
                    const updatedJobs = prevJobs.map((job) =>
                        job.job_id === selectedJob.job_id
                            ? {
                                  ...job,
                                  expirationDate: promotionDate,
                                  remainingDays: calculateDaysLeft(promotionDate),
                                  status: 'Active',
                              }
                            : job
                    );
    
                    const activeJobs = updatedJobs.filter((job) => job.status === 'Active');
                    const expiredJobs = updatedJobs.filter((job) => job.status === 'Expired');
                    
                    return [...activeJobs, ...expiredJobs];
                });
            } else {
                console.error('Error promoting job:', response.data.message);
            }
        } catch (error) {
            console.error('Error promoting job:', error);
        }
    
        setShowPromoteModal(false);
    };
    
    
    
    
    return (
        <div className="container-fluid px-0">
            <div className="table-responsive" style={{scrollbarWidth: 'thin'}}>
                {jobs.length === 0 ? (
                    <div className="text-center p-5" style={{ width: '100%', minWidth: '1000px' }}>
                        <h5>No job posts available</h5>
                    </div>
                ) : (
                    <table className="table" style={{ maxWidth: '100%'}}>
                        <thead className="thead-light">
                            <tr>
                                <th style={{ color: '#676767', background: '#ebebebc2' }}>Jobs</th>
                                <th style={{ color: '#676767', background: '#ebebebc2' }}>Status</th>
                                <th style={{ color: '#676767', background: '#ebebebc2' }}>Applications</th>
                                <th style={{ color: '#676767', background: '#ebebebc2' }}>Actions</th>
                            </tr>
                        </thead>
                        <tfoot className="tfoot-light">
                            <tr>
                                <th style={{ color: '#676767', background: '#ebebebc2' }}>Jobs</th>
                                <th style={{ color: '#676767', background: '#ebebebc2' }}>Status</th>
                                <th style={{ color: '#676767', background: '#ebebebc2' }}>Applications</th>
                                <th style={{ color: '#676767', background: '#ebebebc2' }}>Actions</th>
                            </tr>
                        </tfoot>
                        <tbody>
                            {displayedJobs.map((job, index) => (
                                <JobRow key={job.job_id || `${job.jobTitle}-${index}`} job={job} handleShowModal={handleShowModal} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


           {/* Main modal */}
{showModal && (
    <div
        ref={modalRef}
        className="modal-content"
        style={{
            position: 'absolute',
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            zIndex: 950,
            minWidth: '120px',
            maxWidth: '160px',
            padding: '5px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
    >
        <div className="modal-body p-0">
            <ul className="list-unstyled mb-0">
                <li className="mb-1">
                    <button
                        className="btn btn-sm w-100 text-start text-muted text-decoration-none"
                        style={{
                            padding: '4px 8px',
                            transition: 'background-color 0.2s',
                            border: 'none',
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#d1ecf1'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        onClick={() => handleOptionClick('Promote Job')}
                        disabled={selectedJob?.status === 'Active'}
                    >
                        <FaBullhorn className="me-2" />
                        Promote Job
                    </button>
                </li>
                <li>
                    <button
                        className="btn btn-sm w-100 text-start text-muted text-decoration-none"
                        style={{
                            padding: '4px 8px',
                            transition: 'background-color 0.2s',
                            border: 'none',
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#d1ecf1')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
                        onClick={() => handleOptionClick('Make it Expire')}
                        disabled={selectedJob?.status === 'Expired'} // Optionally disable "Make it Expire" if already expired
                    >
                        <FaClock className="me-2" />
                        Make it Expire
                    </button>
                </li>
                <li className="mb-1">
                    <button
                        className="btn btn-sm w-100 text-start text-muted text-decoration-none"
                        style={{
                            padding: '4px 8px',
                            transition: 'background-color 0.2s',
                            border: 'none',
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#d1ecf1'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        onClick={() => handleOptionClick('Edit A Job')}
                        // disabled={selectedJob?.status === 'Active'}
                    >
                        <FaBullhorn className="me-2" />
                        Edit Job
                    </button>
                </li>
            </ul>
        </div>
    </div>
)}

{showPromoteModal && (
            <div
                className="modal-overlay"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                }}
            >
                <div
                    className="modal-content"
                    style={{
                        width: '500px',
                        padding: '25px',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                    }}
                >
                    {/* Close Button */}
                    <button
                        className="btn-close"
                        onClick={() => setShowPromoteModal(false)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer',
                            zIndex: 1100,
                        }}
                        aria-label="Close"
                    ></button>

                    <h5 className="mb-3 text-left" style={{ fontSize: '17px' }}>
                        Promote Job: {selectedJob?.jobTitle}
                    </h5>
                    <div
                        className="calendar-container"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <small style={{fontWeight: '400', fontSize: '15px', marginBottom: '10px' }}>
                            Select Expiration Date
                        </small>
                        <DatePicker
                            selected={promotionDate}
                            onChange={(date) => setPromotionDate(date)}
                            className="form-control"
                            dateFormat="MM/dd/yyyy"
                            showPopperArrow={false}
                            open={true}
                            inline
                        />
                        <small style={{fontWeight: '400', fontSize: '15px', marginTop: '15px', marginBottom: '-13px', textAlign: 'left'}}>
                            Days Remaining
                        </small>
                        <input
                            type="text"
                            value={calculateDaysLeft(promotionDate)}
                            readOnly
                            className="form-control mt-3"
                            style={{ textAlign: 'center', width: '60%', fontSize: '15px' }}
                            placeholder="Day remain will appear here"
                        />
                    </div>

                    <div className="d-flex justify-content-center mt-3 w-100">
                    <button
                        className="btn btn-sm btn-primary"
                        style={{ width: '105px', height: '45px', borderRadius: '10px' }}
                        onClick={handlePromoteSubmit}
                        disabled={promotionDate <= new Date()}
                    >
                        Promote
                    </button>
                    </div>
                </div>
            </div>
        )}

        <style>{`
        @media (max-width: 576px) { 
            .remaining {
                left: 0px !important;
            }
        }
        `}</style>

        </div>
    );
    
};

export default PostedJobTable;
