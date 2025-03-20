import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Breadcrumb, Button, Form, Table, InputGroup, ButtonGroup, Badge, Offcanvas} from 'react-bootstrap';
import { FaArrowLeft, FaSearch, FaDownload, FaRegCalendarCheck, FaBars } from 'react-icons/fa';
import Pagination from '../../../components/Pagination';
import { postToEndpoint } from '../../../components/apiService';
import ModalComponent from '../../../components/modalAssessment';
import ModalInterview from '../../../components/InterviewScheduleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import EmployerSidebar from '../../../components/employersidebar';

export default function ViewApplications() {
  const { job_id, jobTitle } = useParams();
  const [applications, setApplications] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

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
      .filter((app) => app.applied_status !== "On hold" && app.applied_status !== "Interview" && app.applied_status !== "Qualified" && app.applied_status !== "Rejected" &&  app.applied_status !== "Final Evaluation") 
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
    <Container style={{marginTop: '3rem'}}>
    <Row>
        <Col lg={3} className="applicant-sidebar vh-100 p-3 d-none d-lg-block" style={{background: '#e6f3ff'}}>
                        <EmployerSidebar />
                    </Col>
                    {/* Sidebar Toggle Button (Small Screens) */}
                    <Col xs={12} className="d-lg-none" style={{display: 'flex'}}>
                        <Button
                            variant="link"
                            onClick={() => setShowSidebar(true)}
                            style={{
                                position: "relative",
                                left: "0",
                                color: "#333", // Dark color
                                fontSize: "24px", // Bigger icon
                                padding: "5px"
                            }}
                        >
                            <FaBars />
                        </Button>
                    </Col>
                    {/* Offcanvas Sidebar (Small Screens) */}
                    <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Employer Dashboard</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <EmployerSidebar />
                        </Offcanvas.Body>
                    </Offcanvas>
  

                    <Col lg={9} className="p-4">
        <Container className="mt-5 p-0">
          <Breadcrumb style={{ marginLeft: '20px' }}>
            <Breadcrumb.Item href="/employer/myjobs" style={{ textDecoration: 'none', color: '#757575' }}>
              My Jobs
            </Breadcrumb.Item>
            <Breadcrumb.Item active style={{ color: '#0A65CC', fontWeight: '500' }}>
              Applications
            </Breadcrumb.Item>
          </Breadcrumb>

          <Button
            variant="link"
            onClick={() => navigate('/employer/myjobs')}
            style={{ marginBottom: '25px', color: '#0A65CC', textAlign: 'left', padding: '0', display: 'block', marginLeft: '20px' }}
          >
            <FaArrowLeft />
          </Button>

          <h2 className="mb-4 text-left" style={{ fontSize: '25px', color: 'black', fontWeight: '600', marginLeft: '20px' }}>
            Applications for {jobTitle}
          </h2>

          <InputGroup className="mb-4" style={{ width: '60%', marginLeft: '20px' }}>
            <InputGroup.Text id="search-icon" style={{ borderRadius: '20px', marginRight: '10px', color: '#0A65CC' }}>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by applicant name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: '20px', paddingLeft: '50px' }}
            />
          </InputGroup>

          <div className="d-flex flex-wrap align-items-center mb-2" style={{ padding: '10px', borderRadius: '5px' }}>
            <div className="me-3">
              <p className="mb-0" style={{ fontSize: '16px', fontWeight: '500', marginLeft: '20px' }}>
                Showing <span style={{ fontWeight: '600', color: '#0A65CC' }}>{currentApplications.length}</span> applicant(s)
              </p>
              <p style={{ fontSize: '14px', color: 'gray', margin: '0', marginLeft: '20px' }}>Based on your preferences</p>
            </div>

            <ButtonGroup className="d-flex flex-wrap">
              {["All", "Pending", "On hold", "Qualified", "To Interview", "Rejected"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "dark" : "outline-secondary"}
                  style={{
                    color: filter === status ? '#fff' : '#000',
                    width: '120px',
                    marginBottom: '5px',
                    borderRadius: '20px',
                    backgroundColor: filter === status ? '' : '#dddddd',
                  }}
                  onClick={() => setFilter(status)}
                  className="me-2 btn-sm"
                >
                  {status}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          {/* Set Assessment Section */}
          {(filter === "All" || filter === "Pending") && hasPendingApplicants && (
            <div className="d-flex mb-2" style={{ marginLeft: '20px' }}>
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
{/* Responsive table that collapses into cards on mobile */}
<div className="applicant-table-container">
  {/* Desktop version - visible only on md screens and up */}
  <div className="d-none d-md-block">
    <div className="table-responsive">
      <table className="table table-striped" style={{ width: '100%' }}>
        <thead className="thead-light">
          <tr>
            <th style={{ color: '#fff', background: '#1863b9', width: '50px', fontWeight: '500', fontSize: '14px' }}>
              <input
                className="form-check-input"
                type="checkbox"
                id="selectAllCheckbox"
                checked={selectedApplicants.length === currentApplications.length && currentApplications.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th style={{ color: '#fff', background: '#1863b9', fontWeight: '500', fontSize: '14px' }}>ID</th>
            <th style={{ color: '#fff', background: '#1863b9', fontWeight: '500', fontSize: '14px' }}>Name</th>
            <th style={{ color: '#fff', background: '#1863b9', fontWeight: '500', fontSize: '14px' }}>Date Applied</th>
            <th style={{ color: '#fff', background: '#1863b9', fontWeight: '500', fontSize: '14px' }}>Contact</th>
            <th style={{ color: '#fff', background: '#1863b9', fontWeight: '500', fontSize: '14px' }}>Status</th>
            <th style={{ color: '#fff', background: '#1863b9', fontWeight: '500', fontSize: '14px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentApplications.length > 0 ? (
            currentApplications.map((app, index) => (
              <tr key={app.application_id} style={{ height: '70px' }}>
                <td className="align-middle text-center">
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(app.application_id)}
                    onChange={() => handleSelectApplicant(app.application_id)}
                    disabled={app.applied_status === "On hold" || app.applied_status === "Interview" || app.applied_status === "Rejected" || app.applied_status === "Qualified" || app.applied_status === "To Interview" || app.applied_status === "Final Evaluation"} 
                  />
                </td>
                <td className="align-middle text-center">{index + 1}</td>
                <td className="align-middle">
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
                <td className="align-middle" style={{ fontSize: '15px', color: '#373839' }}>
                  {new Date(app.applied_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
                <td className="align-middle">
                  <div className="d-flex">
                    <button className="btn btn-sm btn-link p-1">
                      <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '20px', color: '#ff5353' }} />
                    </button>
                    <button className="btn btn-sm btn-link p-1">
                      <FontAwesomeIcon icon={faCommentDots} style={{ fontSize: '20px' }} />
                    </button>
                  </div>
                </td>
                <td className="align-middle">
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
                  <td className="align-middle">
                    <button className="btn btn-sm btn-primary" style={{ width: '150px', height: '42px'}} onClick={() => handleClick(app)}>
                      <FaRegCalendarCheck style={{ fontSize: '16px', marginBottom: '4px' }} /> Set interview
                    </button>
                  </td>
                ) : (
                  <td className="align-middle">
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
  </div>

  {/* Mobile version - visible only on sm screens and down */}
  <div className="d-md-none">
    {currentApplications.length > 0 ? (
      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="selectAllCheckboxMobile"
            checked={selectedApplicants.length === currentApplications.length && currentApplications.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="selectAllCheckboxMobile">
            Select All
          </label>
        </div>
        <div>
          <small className="text-muted">{currentApplications.length} Applicant(s)</small>
        </div>
      </div>
    ) : null}
    
    {currentApplications.length > 0 ? (
      currentApplications.map((app, index) => (
        <div key={app.application_id} className="card mb-3 applicant-card">
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0">
                <Link
                  to={`/applicantdetails/${app.application_id}/${app.job_id}/${app.applicant_id}/${app.firstname}/${app.lastname}`}
                  style={{
                    textDecoration: 'none',
                    color: '#007BFF',
                    fontWeight: '500',
                  }}
                >
                  {app.firstname} {app.middlename || ''} {app.lastname}
                </Link>
              </h5>
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectedApplicants.includes(app.application_id)}
                onChange={() => handleSelectApplicant(app.application_id)}
                disabled={app.applied_status === "On hold" || app.applied_status === "Interview" || app.applied_status === "Rejected" || app.applied_status === "Qualified" || app.applied_status === "To Interview" || app.applied_status === "Final Evaluation"} 
              />
            </div>
            
            <div className="row g-2 mb-2">
              <div className="col-6">
                <small className="text-muted d-block" style={{fontWeight: '500'}}>ID</small>
                <span>{index + 1}</span>
              </div>
              <div className="col-6">
                <small className="text-muted d-block" style={{fontWeight: '500'}}>Date Applied</small>
                <span style={{ fontSize: '14px' }}>
                  {new Date(app.applied_at).toLocaleDateString('en-US', {
                    year: '2-digit',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            
            <div className="row g-2 mb-3">
              <div className="col-6">
                <small className="text-muted d-block" style={{fontWeight: '500'}}>Status</small>
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
                  style={{ padding: '5px 10px', borderRadius: '50px', fontSize: '12px' }}
                >
                  {app.applied_status}
                </span>
              </div>
              <div className="col-6">
                <small className="text-muted d-block" style={{fontWeight: '500'}}>Contact</small>
                <div>
                  <button className="btn btn-sm btn-link p-0 me-2">
                    <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '16px', color: '#ff5353' }} />
                  </button>
                  <button className="btn btn-sm btn-link p-0">
                    <FontAwesomeIcon icon={faCommentDots} style={{ fontSize: '16px' }} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="d-grid">
              {app.applied_status === "Qualified" ? (
                <button className="btn btn-sm btn-primary" onClick={() => handleClick(app)}>
                  <FaRegCalendarCheck style={{ fontSize: '14px', marginBottom: '2px' }} /> Set interview
                </button>
              ) : (
                <button className="btn btn-sm btn-outline-secondary" style={{fontWeight: '500'}}>
                  <FaDownload style={{ fontSize: '12px', marginBottom: '2px' }} /> Download CV/Resume
                </button>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="card">
        <div className="card-body text-center py-5">
          <p className="mb-0">No applications found</p>
        </div>
      </div>
    )}
  </div>
</div>

<style>
{`
  #root {
    width: 100%;
  }
  .applicant-card {
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .applicant-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  }
  
  @media (max-width: 767.98px) {
    .form-check-input {
      width: 18px;
      height: 18px;
    }
  }
`}
</style>

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
          </Container>
      </Col>
      </Row>
      </Container>
  );
}
