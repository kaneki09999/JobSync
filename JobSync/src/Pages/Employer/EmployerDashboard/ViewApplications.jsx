import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployerSidebar from '../../../components/EmployerSidebar';
import { FaSearch, FaArrowLeft, FaRegCalendarCheck, FaDownload } from 'react-icons/fa';
import Pagination from '../../../components/Pagination';
import { postToEndpoint } from '../../../components/apiService';
import ModalComponent from '../../../components/modalAssessment';
import ModalInterview from '../../../components/InterviewScheduleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCommentDots } from '@fortawesome/free-regular-svg-icons';

export default function ViewApplications() {
  const { job_id, jobTitle } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplied = async () => {
        try {
            const response = await postToEndpoint('/getApplicantApplied.php', { job_id });
            if (response.data?.jobs) {
                setApplications(response.data.jobs);
            } else {
                console.error('No jobs found or an error occurred:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    fetchApplied();
  }, [job_id]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [assessmentOption, setAssessmentOption] = useState("selectAll");

  const navigate = useNavigate();

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "All" || app.applied_status === filter;
    const matchesSearch = [app.firstname, app.middlename, app.lastname]
      .filter(Boolean)
      .some((name) => name.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const indexOfLastApplication = currentPage * itemsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [showModal, setShowModal] = useState(false);
  const [application_id, setApplicationId] = useState(null);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (appId = null) => {
    if (appId) {
      setApplicationId([appId]); 
    } else {
      setApplicationId(selectedApplicants); 
    }
    setShowModal(true);
  };
  


  const handleSelectApplicant = (appId) => {
    if (selectedApplicants.includes(appId)) {
      setSelectedApplicants(selectedApplicants.filter((id) => id !== appId));
    } else {
      setSelectedApplicants([...selectedApplicants, appId]);
    }
  };
  const handleSetAssessment = () => {
    if (selectedApplicants.length > 0) {
      console.log("Setting assessment for selected applicants:", selectedApplicants);
    } else {
      console.log("No applicants selected for assessment");
    }
    handleShowModal(); 
  };
  
  const hasPendingApplicants = applications.some((app) => app.applied_status === "Pending");
  
  
  
  const handleSelectAll = (isSelected) => {
    const allApplicantIds = currentApplications
      .filter((app) => app.applied_status !== "On hold" && app.applied_status !== "Interview" && app.applied_status !== "Qualified" && app.applied_status !== "Rejected") 
      .map((app) => app.application_id);
  
    if (isSelected) {
      setSelectedApplicants(allApplicantIds);
    } else {
      setSelectedApplicants([]);
    }
  };

  const [showModalInterview, setShowModalInterview] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null); 
  const handleClick = (app) => {
    if (app.applied_status === 'Qualified') {
      setSelectedApplication(app);  
      setShowModalInterview(true); 
    }
  };

  const handleCloseModalInterview = () => setShowModalInterview(false);

  return (
    <div className="d-flex">
      <div className="sidebar" style={{ width: '20%', minWidth: '250px', marginLeft: '-1px' }}>
        <EmployerSidebar />
      </div>

      <div className="col-md-9" style={{ width: '100%' }}>
        <div className="container mt-5" style={{ paddingLeft: '0', paddingRight: '0' }}>

          <nav aria-label="breadcrumb" style={{ marginLeft: '20px' }}>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/employer/myjobs" style={{textDecoration: 'none', color: '#757575' }} >My Jobs</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page" style={{ color: '#0A65CC', fontWeight: '500' }}>Applications</li>
            </ol> 
          </nav>

          <button
            className="btn btn-link"
            onClick={() => navigate('/employer/myjobs')}
            style={{ marginBottom: '25px', color: '#0A65CC', textAlign: 'left', padding: '0', display: 'block', marginLeft: '20px' }}
          >
            <FaArrowLeft />
          </button>

          <h2 className="mb-4 text-left" style={{ fontSize: '25px', color: 'black', fontWeight: '600', marginLeft: '20px' , textAlign: 'left' }}>
              Applications for {jobTitle}
          </h2>
          <div className="input-group mb-4" style={{ width: '60%', marginLeft: '20px' }}>
            <span className="input-group-text" id="search-icon" style={{ borderRadius: '20px', marginRight: '10px', color: '#0A65CC' }}>
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by applicant name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: '20px', paddingLeft: '50px' }}
            />
          </div>

          <div className="d-flex flex-wrap align-items-center mb-4" style={{ padding: '10px', borderRadius: '5px' }}>
            <div className="me-3">
              <p className="mb-0" style={{ fontSize: '16px', fontWeight: '500', marginLeft: '20px' }}>
                Showing <span style={{ fontWeight: '600', color: '#0A65CC' }}>{currentApplications.length}</span> applicant(s)
              </p>
              <p style={{ fontSize: '14px', color: 'gray', margin: '0', marginLeft: '20px' }}>Based on your preferences</p>
            </div>
            <div className="d-flex flex-wrap">
              {["All", "Pending", "On hold", "Qualified", "To Interview", "Rejected"].map((status) => (
                <button
                  key={status}
                  className={`btn btn-sm me-2 ${filter === status ? "btn-dark" : "btn-outline-secondary"}`}
                  style={{
                    color: filter === status ? '#fff' : '#000',
                    width: '120px',
                    marginBottom: '5px',
                    borderRadius: '20px',
                    backgroundColor: filter === status ? '' : '#dddddd',
                  }}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Set Assessment Section */}
          {(filter === "All" || filter === "Pending") && hasPendingApplicants && (
            <div className="d-flex mb-4" style={{ marginLeft: '20px' }}>
              <button
                className="btn"
                onClick={handleSetAssessment}
                style={{
                  marginRight: '15px',
                  fontSize: '14px',
                  background: '#007bff',
                  color: 'white',
                }}
                disabled={selectedApplicants.length === 0}
              >
                Set Assessment
              </button>
              <ModalComponent 
                show={showModal} 
                handleClose={handleCloseModal} 
                selectedApplicants={selectedApplicants} 
                job_id={job_id} 
                jobTitle={jobTitle}
              />
            </div>
          )}
          {/* Applications Table */}
          <div className="table-responsive">
            <table className="table table-striped" style={{ width: '100%', marginLeft: '20px', tableLayout: 'fixed', maxWidth: '970px' }}>
                <thead className="thead-light">
                <tr>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', width: '50px', fontWeight: '500' }}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAllCheckbox"
                    checked={selectedApplicants.length === currentApplications.length && currentApplications.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  </th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', width: '40px', fontWeight: '500' }}>ID</th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', fontWeight: '500' }}>Name</th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', fontWeight: '500' }}>Date Applied</th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', width: '110px', fontWeight: '500' }}>Contact</th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', fontWeight: '500' }}>Status</th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', fontWeight: '500' }}>Actions</th>
                  </tr>
                </thead>
                <tfoot className="tfoot-light">
                <tr>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', width: '50px', fontWeight: '500' }}>
                  </th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', width: '40px', fontWeight: '500' }}>ID</th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', fontWeight: '500' }}>Name</th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', fontWeight: '500' }}>Date Applied</th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', width: '110px', fontWeight: '500' }}>Contact</th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', fontWeight: '500' }}>Status</th>
                  <th style={{ color: '#8a8a8a', background: '#d4e0e9c2', fontWeight: '500' }}>Actions</th>
                  </tr>
                </tfoot>
                <tbody>
                  {currentApplications.length > 0 ? (
                    currentApplications.map((app, index) => (
                      <tr key={app.application_id} style={{ height: '70px' }}>
                        {/* Checkbox Column */}
                        <td style={{ paddingTop: '20px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={selectedApplicants.includes(app.application_id)}
                            onChange={() => handleSelectApplicant(app.application_id)}
                            disabled={app.applied_status === "On hold" || app.applied_status === "Interview" || app.applied_status === "Rejected" || app.applied_status === "Qualified" || app.applied_status === "To Interview"} 
                          />
                        </td>
                        {/* ID Column */}
                        <td style={{ paddingTop: '20px', textAlign: 'center' }}>
                          {index + 1}
                        </td>
                        {/* Name Column */}
                        <td style={{ paddingTop: '20px' }}>
                          <Link
                            to={`/applicantdetails/${app.application_id}/${app.job_id}/${app.applicant_id}/${app.firstname}/${app.lastname}`}
                            style={{
                              textDecoration: 'none',
                              color: '#007BFF',
                              fontWeight: '400',
                              transition: 'color 0.3s',
                            }}
                            onMouseEnter={(e) => (e.target.style.color = '#373839')}
                            onMouseLeave={(e) => (e.target.style.color = '#007BFF')}
                          >
                            {app.firstname} {app.middlename || ''} {app.lastname}
                          </Link>
                        </td>
                        {/* Date Applied Column */}
                        <td style={{ paddingTop: '20px', fontSize: '15px', color: '#373839' }}>
                          {new Date(app.applied_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </td>
                        {/* Contact Column */}
                        <td style={{ paddingTop: '18px' }}>
                        <button className="btn btn-sm btn-link">
                          <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '20px', color: '#ff5353' }} />
                        </button>

                        <button className="btn btn-sm btn-link">
                          <FontAwesomeIcon icon={faCommentDots} style={{ fontSize: '20px', color: '' }} />
                        </button>
                        </td>
                        {/* Status Column */}
                        <td style={{ paddingTop: '18px' }}>
                          <span
                            className={`badge ${
                              app.applied_status === 'Interview'
                                ? 'bg-success'
                                : app.applied_status === 'Pending'
                                ? 'bg-warning'
                                : app.applied_status === 'On hold'
                                ? 'bg-info'
                                : app.applied_status === 'Qualified'
                                ? 'bg-primary'
                                : app.applied_status === 'To Interview'
                                ? 'bg-success'
                                : 'bg-danger'
                            }`}
                            style={{ padding: '8px 38px', borderRadius: '50px' }}
                          >
                            {app.applied_status}
                          </span>
                        </td>
                          {app.applied_status === "Qualified" ? (
                            <td style={{paddingTop: '15px'}}>
                              <button className="btn btn-sm btn-primary" style={{ width: '150px', height: '42px'}} onClick={() => handleClick(app)}>
                                <FaRegCalendarCheck style={{ fontSize: '16px', marginBottom: '4px' }} /> Set interview
                              </button>
                            </td>
                          ) : (
                            <td style={{paddingTop: '19px'}}>
                              <button className="btn btn-link btn-sm" style={{ textDecoration: 'none' }}>
                                <FaDownload style={{ fontSize: '13px', marginBottom: '3px' }} /> Download CV/Resume
                              </button>
                            </td>
                          )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
          </div>

          {selectedApplication && (
            <ModalInterview
              show={showModalInterview}
              handleClose={handleCloseModalInterview}
              application_id={selectedApplication.application_id}
              job_id={selectedApplication.job_id}
            />
          )}

          {/* Pagination Component */}
          <div style={{width: '80%'}}>
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredApplications.length}
              paginate={paginate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
