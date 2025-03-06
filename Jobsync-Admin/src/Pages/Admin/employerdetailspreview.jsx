import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/adminsidebar';
import { FaUser, FaBriefcase, FaPhoneAlt, FaEnvelope, FaSearchPlus } from 'react-icons/fa';
import Topbar from '../../components/Navigation';
import Breadcrumbs from '../../components/BreadCumbs';
import { postToEndpoint } from '../../components/apiService';
import Swal from 'sweetalert2';

const PreviewPage = () => {
  const location = useLocation();
  const { employer } = location.state || {};   

  if (!employer) {
    return <div>Employer details are unavailable. Please go back.</div>;
  }
  const [employers, setEmployer] = useState([]);
  useEffect(() => {
    const fetchEmployer = async () => {
        try {
            const response = await postToEndpoint('/employerDetailed.php', { employer_id: employer.employer_id });
            if (response?.data?.employers) {
                setEmployer(response.data.employers);
            } else {
                console.error('No employers found or an error occurred:', response.data?.error);
            }
        } catch (error) {
            console.error('Error fetching employers:', error);
        }
    };
    fetchEmployer();
    const intervalId = setInterval(fetchEmployer, 1000);
    return () => clearInterval(intervalId);
}, [employer.employer_id]);  

  const handleApprove = async (employerId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to approve this registration?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3e9953',
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we approve the employer.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await postToEndpoint('/UpdateAccountStatus.php', {
          employer_id: employerId,
          status: "Approved",
          email: employers[0]?.email,
          firstname: employers[0]?.firstname,
          lastname: employers[0]?.lastname,
        });

        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Approved!',
            text: 'Employer approved successfully!',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        } else {
          Swal.fire('Error', response.data.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'An error occurred while updating the employer status.', 'error');
        console.error('Error approving employer:', error);
      }
    }
  };

  const handleResubmit = async (employerId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Would you like to resubmit their document for registration?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ffc107',
      confirmButtonText: 'Resubmit',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we reject the employer.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await postToEndpoint('/UpdateAccountStatus.php', {
          employer_id: employerId,
          status: "Resubmit",
          email: employers[0]?.email,
          firstname: employers[0]?.firstname,
          lastname: employers[0]?.lastname,
        });

        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Resubmit!',
            text: 'Submitted successfully!',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        } else {
          Swal.fire('Error', response.data.message, 'error');
        }
      } catch (error) {
        console.error("Error rejecting employer:", error);
        Swal.fire('Error', 'An error occurred while updating the employer status.', 'error');
      }
    }
  };

  const handleReject = async (employerId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Reject this registration?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we reject the employer.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await postToEndpoint('/UpdateAccountStatus.php', {
          employer_id: employerId,
          status: "Rejected",
          email: employers[0]?.email,
          firstname: employers[0]?.firstname,
          lastname: employers[0]?.lastname,
        });

        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Rejected!',
            text: 'Employer rejected successfully!',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        } else {
          Swal.fire('Please try again later');
        }
      } catch (error) {
        console.error("Error rejecting employer:", error);
        Swal.fire('Error', 'An error occurred while updating the employer status.', 'error');
      }
    }
  };


  
  return (
    <>
      <div id="wrapper" style={{ padding: 0 }}>
      {/* Sidebar */}
      <AdminSidebar />
      <div id="content-wrapper" className="d-flex flex-column">
      <div id="content" style={{ width: "100%", margin: "0" }}>
      <Topbar />
      {/* Main Content */}
      <motion.div
        style={{
          margin: '15px',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          overflowY: 'auto',
        }}
        initial={{ y: 50, opacity: 0 }}  
        animate={{ y: 0, opacity: 1 }}    
        transition={{ duration: 0.8 }}
      >
      <Breadcrumbs
        title="Authorized Representative"
        links={[
          { label: "Dashboard", href: "/admindashboard" },
          { label: "Authorized Representative", href: "/adminemployers" },
          { label: "Representative Details", active: true }
        ]}
      />
        {/* Employer Info */}
        <div className='mt-5' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <p style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
            <FaUser style={{ marginRight: '12px', color: '#007bff' }} /> <strong className='me-1'>Name:</strong>{employers[0]?.firstname} {employers[0]?.middlename} {employers[0]?.lastname} 
            <span style={{ padding: '9px', textTransform: 'uppercase', borderRadius: '3px', fontSize: '10px', backgroundColor: employers[0]?.account_status === "Pending" 
              ? "#ffc107"  
              : employers[0]?.account_status === "Approved" 
              ? "#119d5c"  
              : employers[0]?.account_status === "Rejected" 
              ? "#dc3545" 
              : employers[0]?.account_status === "Resubmit" 
              ? "#ffc107"  
              : "#6c757d", color: '#ffff', marginLeft: '5px', fontWeight: '600' }}>{employers[0]?.account_status}</span>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
            <FaBriefcase style={{ marginRight: '12px', color: '#007bff' }} /> <strong className='me-1'>Designation:</strong>{employers[0]?.position}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
            <FaPhoneAlt style={{ marginRight: '12px', color: '#007bff' }} /> <strong className='me-1'>Contact:</strong>+63{employers[0]?.contact}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
            <FaEnvelope style={{ marginRight: '12px', color: '#007bff' }} /> <strong className='me-1'>Email:</strong>{employers[0]?.email}
          </p>
        </div>

        {/* ID Preview */}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '25px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '20px', textAlign: 'left' }}>
            Uploaded ID Preview
          </h3>
          {employers[0]?.decision === 'accept' && (
            <p 
              style={{ 
                backgroundColor: '#3bab44', 
                color: '#fff', 
                padding: '10px 15px', 
                borderRadius: '26px', 
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '500'
              }}
            >
              Identification Verified
            </p>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* ID Card Front */}
            <div 
              style={{
                width: '32%',
                height: '350px',
                border: '2px dashed #007bff',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                backgroundColor: '#f5f5f5',
              }}
            >
              {employers[0]?.document_path ? (
                <img 
                  src={employers[0]?.document_path} 
                  alt="ID Front" 
                  style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'contain' }} 
                />
              ) : (
                <span style={{ fontSize: '20px', color: '#888', fontWeight: 'bold' }}>Front ID</span>
              )}
            </div>

            {/* ID Card Back */}
            <div 
              style={{
                width: '32%',
                height: '350px',
                border: '2px dashed #007bff',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                backgroundColor: '#f5f5f5',
              }}
            >
              {employers[0]?.back_side_path ? (
                <img 
                  src={employers[0]?.back_side_path} 
                  alt="ID Back" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} 
                />
              ) : (
                <span style={{ fontSize: '20px', color: '#888', fontWeight: 'bold' }}>Back ID</span>
              )}
            </div>
            {/* Selfie */}
            <div 
              style={{
                width: '32%',
                height: '350px',
                border: '2px dashed #007bff',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                backgroundColor: '#f5f5f5',
              }}
            >
              {employers[0]?.face_path ? (
                <img 
                  src={employers[0]?.face_path} 
                  alt="Selfie" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} 
                />
              ) : (
                <span style={{ fontSize: '20px', color: '#888', fontWeight: 'bold' }}>Selfie</span>
              )}
            </div>
          </div>
        </div>

        {/* Attached Documents */}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '24px', color: '#333', textAlign: 'left', margin: 0 }}>
              Documents Attached
            </h3>
            
            {/* Approve & Reject Buttons */}
            {employers[0]?.account_status === 'Pending' && (
              <>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button 
                onClick={() => handleApprove(employers[0]?.employer_id)}
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#fff',
                  height: "40px",
                  backgroundColor: '#3e9953',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: '0.3s ease',
                }}
              >
                Approve
              </button>
              <button 
                onClick={() => handleResubmit(employers[0]?.employer_id)}
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#fff',
                  height: "40px",
                  backgroundColor: '#ffc107',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: '0.3s ease',
                }}
              >
                Resubmit
              </button>
              <button 
                onClick={() => handleReject(employers[0]?.employer_id)}
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#fff',
                  height: "40px",
                  backgroundColor: '#dc3545',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: '0.3s ease',
                }}
              >
                Reject
              </button>
            </div>
            </>
            )}
             <a 
              href="https://bnrs.dti.gov.ph/search" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                backgroundColor: '#006adc', 
                color: '#fff', 
                padding: '10px 15px', 
                borderRadius: '3px', 
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Check DTI Registration
              <FaSearchPlus style={{fontSize: '20px', marginLeft: '6px'}} />
            </a>
          </div>

          {/* Grid Layout for Documents */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '35px' }}>
            {/* DTI Document */}
            {employers[0]?.dti_document && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ margin: 0, fontSize: '20px' }}>
                  <strong>DTI Registration</strong> 
                  <span style={{ color: '#888', marginLeft: '10px', fontSize: '16px' }}>
                    ({employers[0]?.dti_document.endsWith('.pdf') ? 'PDF' : 'Image'})
                  </span>
                </p>
                <a href={employers[0]?.dti_document} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontSize: '16px', width: '75px' }}>
                  View File
                </a>
                {employers[0]?.dti_document.endsWith('.pdf') ? (
                  <iframe
                    src={employers[0]?.dti_document}
                    width="100%"
                    height="500px"
                    style={{ border: '1px solid #ccc', borderRadius: '5px'}}
                  ></iframe>
                ) : (
                  <img
                    src={employers[0]?.dti_document}
                    alt="DTI Registration"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '5px' }}
                  />
                )}
              </div>
            )}

            {/* BIR Document */}
            {employers[0]?.bir_document && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ margin: 0, fontSize: '20px' }}>
                  <strong>BIR Registration</strong> 
                  <span style={{ color: '#888', marginLeft: '10px', fontSize: '16px' }}>
                    ({employers[0]?.bir_document.endsWith('.pdf') ? 'PDF' : 'Image'})
                  </span>
                </p>
                <a href={employers[0]?.bir_document} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontSize: '16px', width: '75px' }}>
                  View File
                </a>
                {employers[0]?.bir_document.endsWith('.pdf') ? (
                  <iframe
                    src={employers[0]?.bir_document}
                    width="100%"
                    height="500px"
                    style={{ border: '1px solid #ccc', borderRadius: '5px' }}
                  ></iframe>
                ) : (
                  <img
                    src={employers[0]?.bir_document}
                    alt="BIR Registration"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '5px' }}
                  />
                )}
              </div>
            )}
            {/* Business Permit */}
            {employers[0]?.business_permit && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ margin: 0, fontSize: '20px' }}>
                  <strong>Business Permit</strong> 
                  <span style={{ color: '#888', marginLeft: '10px', fontSize: '16px' }}>
                    ({employers[0]?.business_permit.endsWith('.pdf') ? 'PDF' : 'Image'})
                  </span>
                </p>
                <a href={employers[0]?.business_permit} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontSize: '16px', width: '75px' }}>
                  View File
                </a>
                {employers[0]?.business_permit.endsWith('.pdf') ? (
                  <iframe
                    src={employers[0]?.business_permit}
                    width="100%"
                    height="500px"
                    style={{ border: '1px solid #ccc', borderRadius: '5px' }}
                  ></iframe>
                ) : (
                  <img
                    src={employers[0]?.business_permit}
                    alt="Business Permit"
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '5px' }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      </div>
    </div>
    </div>
    <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
          }
          #page-top {
            min-width: 100%;
            position: fixed;
            top: 0;
            left: 0;
          }
          #root {
            position: fixed;
            right: 0;
            margin: 0;
            left: -32px;
            min-width: 100%;
          }
          
          #wrapper {
            display: flex;
            height: 100vh;
            width: 100vw;
          }
          #content-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
          }

          /* Custom Scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          ::-webkit-scrollbar-thumb {
            background: #007bff;
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #0056b3;
          }
        `}
      </style>
    </>
  );
};

export default PreviewPage;
