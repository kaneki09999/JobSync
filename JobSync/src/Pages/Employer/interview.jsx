import React, { useState, useEffect } from 'react';
import { FaSearch, FaVideo, FaRegCalendarCheck, FaCheck } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import { postToEndpoint } from '../../components/apiService';
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';
import ModalInterview from '../../components/InterviewScheduleModal';
import Swal from "sweetalert2";

export default function Interview() {
  const [applications, setApplications] = useState([]);
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mapStatus = (status) => {
    if (status === "Confirmed") {
      return "Approved";
    } 
    else if (status === "Reschedule") {
      return "Reschedule";
    }
    else if (status === "Pending") {
      return "Pending";
    }
    else {
      return "Declined";
    }
  };
  useEffect(() => {
    const fetchApplications = async () => {
        try {
            const response = await postToEndpoint('/getAllApplicantInterview.php', { employer_id: user.id });
            if (response.data?.applications) {
                console.log('Applications fetched:', response.data.applications);
                setApplications(response.data.applications);
            } else {
                console.error('No jobs found or an error occurred:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };
    fetchApplications();
    const interval = setInterval(fetchApplications, 30000);
    return () => clearInterval(interval);
}, [user.id]); 

  

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "All" || mapStatus(app.status) === filter;
    const matchesJob = selectedJob === "All" || app.jobTitle === selectedJob;
    const matchesSearch = (app.name || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesJob && matchesSearch;
  });
  
  const [showModalInterview, setShowModalInterview] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null); 
  const handleClick = (app) => {
    if (app.status === 'Reschedule') {
      setSelectedApplication(app);  
      setShowModalInterview(true); 
    }
  };

  console
  const handleCloseModalInterview = () => setShowModalInterview(false);

  const indexOfLastApplication = currentPage * itemsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleMarkAsFinalEvaluation = async (applicationId, jobId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Before proceeding, please note that this will notify the applicant that their application is in the final stage of evaluation.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await postToEndpoint("/finalEvaluation.php", {
            application_id: applicationId,
            job_id: jobId,
            applied_status: "Final Evaluation",
          });
  
          if (response.data?.success) {
            setApplications((prevApplications) =>
              prevApplications.map((app) =>
                app.application_id === applicationId
                  ? { ...app, status: "Final Evaluation" }
                  : app
              )
            );
  
            Swal.fire({
              icon: 'success',
              text: "The application is now in the final stage of evaluation.",
              title: 'Success!',
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: response.data.error || "Failed to update status.",
              icon: "error",
              confirmButtonColor: "#d33",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while updating the status.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
          console.error("Error updating status:", error);
        }
      }
    });
  };
  return (
    <div className="container mt-5" style={{ paddingLeft: '0', paddingRight: '0' }}>

      {/* Job Alerts Header */}
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

      {/* Showing Applicants Section */}
      <div className="d-flex flex-wrap align-items-center mb-4" style={{ padding: '10px', borderRadius: '5px' }}>
        <div className="me-3">
          <p className="mb-0" style={{ fontSize: '16px', fontWeight: '500' }}>
            Showing <span style={{ fontWeight: '600', color: '#0A65CC' }}>{currentApplications.length}</span> applicant(s)
          </p>
          <p style={{ fontSize: '14px', color: 'gray', margin: '0' }}>Based on your preferences</p>
        </div>

        {/* Job Filter Dropdown */}
        <div className="me-3">
          <select
            className="form-select btn-sm align-content-center"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            style={{ width: '200px', borderRadius: '20px', marginBottom: '5px', backgroundColor: '#dddddd' , height: '40px'}}
          >
            <option value="All">All Jobs</option>
            {Array.from(new Set(applications.map((app) => app.jobTitle))).map((jobTitle) => (
                <option key={jobTitle} value={jobTitle}>{jobTitle}</option>
              ))}
          </select>
        </div>

        {/* Filter Buttons */}
        <div className="d-flex flex-wrap">
          {["All", "Approved", "Declined"].map((status) => (
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
              <th style={{ color: 'white', background: '#1863b9' , width: '22%' }}>Full Name</th>
              <th style={{ color: 'white', background: '#1863b9' , width: '15%' }}>Job Type</th>
              <th style={{ color: 'white', background: '#1863b9' }}>Schedule Interview</th> 
              <th style={{ color: 'white', background: '#1863b9', width: '140px' }}>Status</th>
              <th style={{ color: 'white', background: '#1863b9', width: '150px'}}>Join Meeting</th>
              <th style={{ color: 'white', background: '#1863b9', width: '100px'}}>Action</th>
            </tr>
          </thead>
          
          <tbody>
            {currentApplications.length > 0 ? (
              currentApplications.map((app, index) => (
                <tr key={app.application_id} style={{ height: "70px",
                cursor: "pointer" }} className='border-bottom'>
                  <td className="align-content-center">{index + 1}</td>
                  <td className="align-content-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={app.profile_picture}  
                        alt={`${app.firstname}'s profile`}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          marginRight: '10px',
                        }}
                      />
                      <span>{app.firstname} {app.middlename} {app.lastname}</span>
                    </div>
                  </td>
                  <td className="align-content-center">{app.jobTitle}</td>
                  <td style={{display: 'flex', justifyContent: 'center', padding: '23px 0'}}> 
                    <p style={{fontWeight: '500', margin: '0', color: '#332f2f'}}>{app.schedule}</p>, at 
                    <p style={{fontWeight: '500', marginBottom: '0', marginLeft: '5px', color: '#332f2f'}}>{app.time}</p>
                  </td>
                  <td className="align-content-center">
                    <span className={`badge ${mapStatus(app.status) === "Approved" ? "bg-success" : 
                                              mapStatus(app.status) === "Reschedule" ? "bg-warning" :
                                              mapStatus(app.status) === "Pending" ? "bg-warning" : "bg-danger"}`} 
                          style={{ padding:'8px 27px', borderRadius: '50px' }}>
                      {mapStatus(app.status)}
                    </span>
                  </td>
                  <td className="align-content-center">
                    {mapStatus(app.status) === "Reschedule" ? (
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ width: '150px', height: '42px' }}
                        onClick={() => handleClick(app)}
                      >
                        <FaRegCalendarCheck style={{ fontSize: '16px', marginBottom: '4px' }} /> Reschedule
                      </button>
                    ) : (
                      <Link
                        to={`/employer/publisher/${app.application_id}/${app.job_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: 'none',
                          pointerEvents: mapStatus(app.status) === "Declined" ? "none" : "auto",  
                          opacity: mapStatus(app.status) === "Decline" ? 0.5 : 1, 
                        }}
                      >
                        <button
                          className="btn btn-sm btn-link"
                          style={{ padding: '0' }}
                          disabled={mapStatus(app.status) === "Decline"} 
                        >
                          <FaVideo 
                            style={{ 
                                color: mapStatus(app.status) === "Declined" 
                                    ? '#c9c9c9'   
                                    : mapStatus(app.status) === "Pending" 
                                        ? '#c9c9c9'   
                                        : '#0a58ca',  
                                fontSize: '25px' 
                            }} 
                        />
                        </button>
                      </Link>
                    )}
                  </td>
                  <td className="align-content-center">
                  <FaCheck
                    title="Mark as Final Evaluation"
                    style={{
                      color: mapStatus(app.status) === "Declined" ? "#c9c9c9" : "#198754",
                      opacity: mapStatus(app.status) === "Declined" ? 0.5 : 1,
                      cursor: "pointer",
                    }}
                    onClick={() => handleMarkAsFinalEvaluation(app.application_id, app.job_id)}  
                  />
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No applications found</td>
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
