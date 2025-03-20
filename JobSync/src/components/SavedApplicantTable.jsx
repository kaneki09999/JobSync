import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container } from 'react-bootstrap';
import { FaBookmark, FaArrowRight, FaEllipsisV, FaEnvelope, FaDownload, FaComment } from 'react-icons/fa';
import Pagination from './Pagination';  
import { getFromEndpoint } from './apiService';
import { useAuth } from '../AuthContext';
import ViewProfileModal from './viewprofilemodal';

const ApplicantRow = ({ applicant, handleViewProfile, handleShowOptions }) => (
    <tr style={{borderBottom: '#7c858d'}}>
        <td style={{ textAlign: 'left', padding: '15px' }}>
            <div className="d-flex align-items-center flex-wrap">
                <img 
                    src={applicant.profile_picture} 
                    alt={applicant.firstname} 
                    className="rounded-circle me-2" 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                />
                <div>
                    <h6 className="mb-0">{applicant.firstname} {applicant.middlename} {applicant.lastname}</h6>
                    <small className="text-muted">{applicant.headline}</small>
                </div>
            </div>
        </td>
        <td className="text-md-right">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-end">
                <FaBookmark className="me-md-2 mb-2 mb-md-0" style={{ color: '#096fc8', height: '21px' }} />
                <button 
                    className="btn btn-sm btn-light w-md-auto but" 
                    style={{ fontWeight: '500', background: '#307ef5', padding: '10px', borderRadius: '6px', height: '50px', width: '40%', color: 'white' }}
                    onClick={() => handleViewProfile(applicant.applicant_id)}
                >
                    View Profile <FaArrowRight className="ms-1" />
                </button>
                <button 
                    className="btn btn-sm btn-light text-primary fw-bold ms-md-2 mt-2 mt-md-0 w-md-auto" 
                    onClick={(e) => {
                        e.stopPropagation(); // prevent triggering other events
                        handleShowOptions(applicant, e);
                    }}
                >
                    <FaEllipsisV />
                </button>
            </div>
        </td>
        <style>{`
        @media (max-width: 768px) {
            .but {
                width: 100% !important;
            }
        }
        `}</style>
    </tr>
);

const ApplicantsTable = () => {
    const { user } = useAuth();
    const [applicants, setApplicants] = useState([]);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const optionsRef = useRef();

    useEffect(() => {
        getFromEndpoint('/favorite_applicants.php', { employer_id: user?.id })
            .then(response => {
                if (response.data.error) {
                    console.error('Error fetching applicants:', response.data.error);
                } else {
                    setApplicants(response.data);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }, [user?.id]);

    const handleViewProfile = (applicant) => {
        setSelectedApplicant(applicant);
        setShowProfileModal(true);
    };

    const handleShowOptions = (applicant, event) => {
        const rect = event.target.getBoundingClientRect();
        setOptionsPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        setSelectedApplicant(applicant);
        setShowOptionsModal(true);
    };

    const handleCloseProfileModal = () => {
        setShowProfileModal(false);
    };

    const handleOutsideClick = (event) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            setShowOptionsModal(false);
        }
    };

    useEffect(() => {
        if (showOptionsModal) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [showOptionsModal]);

    const handleOptionClick = (option) => {
        console.log(`${option} for applicant: ${selectedApplicant.firstname} ${selectedApplicant.lastname}`);
        setShowOptionsModal(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentApplicants = applicants.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container>
            <div className="table-responsive">
                <Table style={{ width: '100%', tableLayout: 'fixed' }}>
                    <tbody>
                        {currentApplicants.map((applicant) => (
                            <ApplicantRow
                                key={applicant.id}
                                applicant={applicant}
                                handleViewProfile={handleViewProfile}
                                handleShowOptions={handleShowOptions}
                            />
                        ))}
                    </tbody>
                </Table>
            </div>

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={applicants.length}
                paginate={paginate}
            />

            {showOptionsModal && (
                <div
                    ref={optionsRef}
                    className="modal-content"
                    style={{
                        position: 'absolute',
                        top: `${optionsPosition.top}px`,
                        left: `${optionsPosition.left}px`,
                        zIndex: 950,
                        minWidth: '150px',
                        maxWidth: '200px',
                        padding: '3px',
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
                                    className="btn btn-sm w-100 text-start text-muted"
                                    style={{ padding: '4px 8px' }}
                                    onClick={() => handleOptionClick('Send Email')}
                                >
                                    <FaEnvelope className="me-2" /> Send Email
                                </button>
                            </li>
                            <li className="mb-1">
                                <button
                                    className="btn btn-sm w-100 text-start text-muted"
                                    style={{ padding: '4px 8px' }}
                                    onClick={() => handleOptionClick('Download Resume')}
                                >
                                    <FaDownload className="me-2" /> Download Resume
                                </button>
                            </li>
                            <li className="mb-1">
                                <button
                                    className="btn btn-sm w-100 text-start text-muted"
                                    style={{ padding: '4px 8px' }}
                                    onClick={() => handleOptionClick('Send Message')}
                                >
                                    <FaComment className="me-2" /> Send Message
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {showProfileModal && (
                <ViewProfileModal
                    show={showProfileModal}
                    handleClose={handleCloseProfileModal}
                    applicant={selectedApplicant}
                />
            )}
        </Container>
    );
};

export default ApplicantsTable;
