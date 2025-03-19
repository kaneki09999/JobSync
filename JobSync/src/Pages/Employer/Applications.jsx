import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaDownload, FaEnvelope, FaCommentDots, FaRegCalendarCheck } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCommentDots, } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../../AuthContext';
import { postToEndpoint } from '../../components/apiService';
import ModalInterview from '../../components/InterviewScheduleModal';
import '../../App.css'

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    const fetchApplications = async () => {
        try {
            const response = await postToEndpoint('/getAllApplicants.php', { employer_id: user.id });
            if (response.data?.applications) {
                setApplications(response.data.applications);
            } else {
                console.error('No jobs found or an error occurred:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    fetchApplications();
  }, [user.id]);
  
  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "All" || app.applied_status === filter;
    const matchesJob = selectedJob === "All" || app.jobTitle === selectedJob;
    const matchesSearch = [app.firstname, app.middlename, app.lastname]
      .filter(Boolean)
      .some((name) => name.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesJob && matchesSearch;
  });

  const indexOfLastApplication = currentPage * itemsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    <div className="container mt-5" style={{ paddingLeft: '0', paddingRight: '0' }}>

      <div className="input-group mb-4" style={{ width: '60%' , marginTop: '100px'}}>
        <span className="input-group-text" id="search-icon" style={{ borderRadius: '20px', marginRight: '10px', color: '#0A65CC', zIndex: '1' }}>
          <FaSearch />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search by applicant name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ borderRadius: '20px', paddingLeft: '50px'}}
        />
      </div>
      <div className="d-flex flex-wrap align-items-center mb-4" style={{ padding: '10px', borderRadius: '5px' }}>
  {/* Showing Applicants Section */}
  <div className="me-3">
    <p className="mb-0" style={{ fontSize: '16px', fontWeight: '500' }}>
      Showing <span style={{ fontWeight: '600', color: '#0A65CC' }}>{currentApplications.length}</span> applicant(s)
    </p>
    <p style={{ fontSize: '14px', color: 'gray', margin: '0' }}>Based on your preferences</p>
  </div>

  {/* Job Filter Dropdown */}
  <div className="me-3">
    <select
      className="form-select btn-sm"
      value={selectedJob}
      onChange={(e) => setSelectedJob(e.target.value)}
      style={{ width: '200px', borderRadius: '20px', marginBottom: '5px', backgroundColor: '#dddddd', height: '40px' }}
    >
      <option value="All">All Jobs</option>
      {Array.from(new Set(applications.map((app) => app.jobTitle))).map((jobTitle) => (
        <option key={jobTitle} value={jobTitle}>{jobTitle}</option>
      ))}
    </select>
  </div>

  {/* Filter Buttons */}
  <div className="d-flex flex-wrap">
    {["All", "Pending", "Qualified", "To Interview", "Final Evaluation","Rejected"].map((status) => (
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

      {/* Applications Table */}
      <div className="table-responsive" style={{ minHeight: '466px', overflow: 'auto' }}>
        <table className="table table-hover" style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead className="thead-light">
            <tr>
              <th style={{ color: 'white', background: '#1863b9', width: '70px' }}>ID</th>
              <th style={{ color: 'white', background: '#1863b9', width: '250px' }}>Name</th>
              <th style={{ color: 'white', background: '#1863b9', width: '215px' }}>Date Applied</th>
              <th style={{ color: 'white', background: '#1863b9', width: '180px' }}>Job</th>
              <th style={{ color: 'white', background: '#1863b9', width: '130px' }}>Contact</th>
              <th style={{ color: 'white', background: '#1863b9', width: '130px' }}>Status</th>
              <th style={{ color: 'white', background: '#1863b9', width: '193px' }}>Actions</th>
            </tr>
          </thead>
          
            <tbody>
              {currentApplications.length > 0 ? (
                currentApplications.map((app, index) => {
                  const applicantLink = `/applicantdetails/${app.application_id}/${app.job_id}/${app.applicant_id}/${app.firstname}/${app.lastname}`;
                  return (
                    <tr
                      key={app.application_id}
                      style={{
                        height: "70px",
                        cursor: "pointer",
                      }}
                      onClick={() => (window.location.href = applicantLink)}
                    >
                      <td className="align-content-center">{index + 1}</td>
                      <td className="align-content-center">
                      <div className="d-flex align-items-center">
                      <img
                        src={app.profile_picture_url}  
                        alt={`${app.firstname}'s profile`}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          marginRight: '10px',
                          objectFit: 'cover'
                        }}
                      />
                      <span>{app.firstname} {app.middlename || ''} {app.lastname}</span>
                    </div>
                      </td>
                      <td className="align-content-center">
                        {new Date(app.applied_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="align-content-center" style={{ fontWeight: "500" }}>
                        {app.jobTitle}
                      </td>
                      <td className="align-content-center">
                        <button className="btn btn-sm btn-link">
                          <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: "20px", color: "#ff5353" }} />
                        </button>
                        <button className="btn btn-sm btn-link">
                          <FontAwesomeIcon icon={faCommentDots} style={{ fontSize: "20px" }} />
                        </button>
                      </td>
                      <td className="align-content-center">
                        <span
                          className={`badge ${
                            app.applied_status === "To Interview"
                              ? "bg-success"
                              : app.applied_status === "Pending"
                              ? "bg-warning"
                              : app.applied_status === "On hold"
                              ? "bg-info"
                              : app.applied_status === "Qualified"
                              ? "bg-primary"
                              : app.applied_status === "Final Evaluation"
                              ? "bg-secondary"
                              : "bg-danger"
                          }`}
                          style={{ padding: "8px 27px", borderRadius: "50px" }}
                        >
                          {app.applied_status}
                        </span>
                      </td>
                      {app.applied_status === "Qualified" ? (
                        <td className="align-content-center">
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ width: "150px", height: "42px" }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click from triggering
                              handleClick(app);
                            }}
                          >
                            <FaRegCalendarCheck style={{ fontSize: "16px", marginBottom: "4px" }} /> Set interview
                          </button>
                        </td>
                      ) : (
                        <td className="align-content-center">
                          <button
                            className="btn btn-link btn-sm"
                            style={{ textDecoration: "none" }}
                            onClick={(e) => e.stopPropagation()}  
                          >
                            <FaDownload style={{ fontSize: "16px" }} /> Download CV/Resume
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center" style={{ fontSize: "17px", padding: "20px" }}>
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>

        </table>
      </div>
      {/* Modal */}
      {selectedApplication && (
        <ModalInterview
          show={showModalInterview}
          handleClose={handleCloseModalInterview}
          application_id={selectedApplication.application_id}
          job_id={selectedApplication.job_id}
        />
      )}

      {/* Pagination */}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredApplications.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}
