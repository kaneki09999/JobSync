import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBookmark, FaArrowRight, FaMapMarkerAlt, FaRegBookmark } from 'react-icons/fa';
import { postToEndpoint } from './apiService';
import ViewProfileModal from '../components/viewprofilemodal';
import Pagination from '../components/Pagination';

const ApplicantRow = ({ applicant, handleShowModal }) => (
    <div className="card mb-3 border-0" style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'}}>
        <div className="card-body p-3">
            <div className="row align-items-center">
                <div className="col-12 col-md-8 mb-3 mb-md-0">
                    <div className="d-flex align-items-center">
                        <img 
                            src={applicant.profile_picture_url} 
                            alt={applicant.firstname} 
                            className="rounded-circle me-3" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                        />
                        <div>  
                            <h6 className="mb-1">{applicant.firstname} {applicant.middlename || ''} {applicant.lastname}</h6>
                            <small className="text-muted d-block mb-1">{applicant.headline}</small>
                            <div className="d-flex align-items-center">
                                <FaMapMarkerAlt className="me-1" style={{ color: '#6c757d', fontSize: '0.8rem' }} />
                                <small className="text-muted">{applicant.city}, {applicant.nationality}</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="d-flex justify-content-md-end align-items-center mt-2 mt-md-0">
                        <button 
                            className="btn p-1 me-3 border-0"
                            aria-label="Bookmark"
                            
                        >
                            <FaRegBookmark style={{
                                width: '17px',
                                height: '17px',
                                color: '#6c757d'
                            }} />
                        </button>
                        <button
                            className="btn btn-sm flex-grow-1 flex-md-grow-0"
                            style={{
                                padding: '10px 15px', 
                                background: '#307ef5', 
                                fontWeight: '500', 
                                border: 'none',
                                minWidth: '140px',
                                color: 'white',
                                height: '50px'
                            }}
                            onClick={() => handleShowModal(applicant.applicant_id)}
                        >
                            View Profile <FaArrowRight className="ms-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ApplicantsTable = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const modalRef = useRef();

    const [applicants, setApplicants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            setIsLoading(true);
            try {
                const response = await postToEndpoint('/findApplicant.php');
                if (response.data.applicants) {
                    setApplicants(response.data.applicants);
                } else {
                    console.error('No applicants found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching applicants:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplicants();
    }, []);

    const handleShowModal = (applicant) => {
        setSelectedApplicant(applicant);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false); 
        }
    };

    useEffect(() => {
        if (showModal) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [showModal]);

    const indexOfLastApplicant = currentPage * itemsPerPage;
    const indexOfFirstApplicant = indexOfLastApplicant - itemsPerPage;
    const currentApplicants = applicants.slice(indexOfFirstApplicant, indexOfLastApplicant);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container-fluid px-2 px-md-4">
            {isLoading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : applicants.length === 0 ? (
                <div className="alert alert-info text-center my-5">
                    No applicants found. Try adjusting your search criteria.
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        {currentApplicants.map((applicant) => (
                            <ApplicantRow 
                                key={applicant.applicant_id} 
                                applicant={applicant} 
                                handleShowModal={handleShowModal} 
                            />
                        ))}
                    </div>

                    {/* Pagination Component */}
                    <div className="d-flex justify-content-center">
                        <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={applicants.length}
                            paginate={paginate}
                        />
                    </div>
                </>
            )}

            {/* View Profile Modal */}
            <ViewProfileModal
                show={showModal}
                handleClose={handleCloseModal}
                applicant={selectedApplicant}
                ref={modalRef}
            />
        </div>
    );
};

export default ApplicantsTable;