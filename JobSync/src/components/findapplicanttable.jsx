import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBookmark, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { postToEndpoint } from './apiService';
import ViewProfileModal from '../components/viewprofilemodal';
import Pagination from '../components/Pagination';

const ApplicantRow = ({ applicant, handleShowModal }) => (
    <tr key={applicant.applicant_id} className="border-bottom">
        <td style={{ textAlign: 'left' }}>
            <div className="d-flex align-items-center" style={{height: '90px'}}>
                <img src={applicant.profile_picture_url} alt={applicant.firstname} className="rounded-circle me-2" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                <div className='ms-0'>  
                    <h6 className="mb-1 ms-1">{applicant.firstname} {applicant.middlename || ''} {applicant.lastname}</h6>
                    <small className="text-muted ms-1">{applicant.headline}</small>
                    <div className="d-flex align-items-center mt-1">
                        <FaMapMarkerAlt className="me-2" style={{ color: '#6c757d' }} />
                        <small className="text-muted">{applicant.city}, {applicant.nationality}</small>
                    </div>
                </div>
            </div>
        </td>
        <td style={{ textAlign: 'right' }}>
            <div className="d-flex align-items-center justify-content-end" style={{marginTop: '8px'}}>
                <FaBookmark className="me-2" 
                style={{
                    width: '17px',
                    height: '17px',
                    marginTop: '18px'
                }}
                />
                <button
                    className="btn btn-sm btn-light text-primary"
                    style={{marginTop: '17px', padding: '10px', width: '156px', background: '#ddf2ff', fontWeight: '500', marginLeft: '12px', height: '52px', border: 'none'}}
                    onClick={() => handleShowModal(applicant.applicant_id)}
                >
                    View Profile <FaArrowRight className="ms-1" />
                </button>
            </div>
        </td>
    </tr>
);

const ApplicantsTable = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const modalRef = useRef();

    const [applicants, setApplicants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    useEffect(() => {
      const fetchApplicants = async () => {
          try {
              const response = await postToEndpoint('/findApplicant.php');
              if (response.data.applicants) {
                  setApplicants(response.data.applicants);
              } else {
                  console.error('No jobs found or an error occurred:', response.data.error);
              }
          } catch (error) {
              console.error('Error fetching jobs:', error);
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
        <div className="container" style={{padding: '16px', marginTop: '-50px'}}>
            <div className="table-responsive">
                <table className="table" style={{ width: '100%', tableLayout: 'auto' }}>
                    <tbody>
                        {currentApplicants.map((applicant) => (
                            <ApplicantRow key={applicant.applicant_id} applicant={applicant} handleShowModal={handleShowModal} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={applicants.length}
                paginate={paginate}
            />

            {/* View Profile Modal */}
            <ViewProfileModal
                show={showModal}
                handleClose={handleCloseModal}
                applicant={selectedApplicant}
            />
        </div>
    );
};

export default ApplicantsTable;
