import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/adminsidebar';
import { FaUser, FaBriefcase, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaFlag, FaGenderless, FaHeart, FaBusinessTime, FaGraduationCap } from 'react-icons/fa';  // Add appropriate icons

const ApplicantPreviewPage = () => {
  const location = useLocation();
  
  // Add fallback in case location.state is null or undefined
  const { applicant } = location.state || {};  

  if (!applicant) {
    return <div>Applicant details are unavailable. Please go back.</div>;
  }

  const documents = [
    { name: applicant.resume, type: 'pdf', url: `path/to/${applicant.resume}` }
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh", flexDirection: "row", position: 'relative' }}>
      {/* Sidebar */}
      <AdminSidebar />

      <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            display: flex;
          }

          #root {
            position: fixed;
            top: 0;
            right: 0;
            margin: 0;
            left: -32px;
            min-width: 100%;
          }
        `}
      </style>

      {/* Main Content */}
      <motion.div
        style={{ 
          flex: '1 1 70%', // Adjusted width to 70% of the available space
          maxWidth: '900px', // Added max width to prevent the card from becoming too wide
          margin: '50px auto', // Centering the content horizontally and adding top margin for spacing
          padding: '30px', 
          borderRadius: '12px', // Rounded corners for the card look
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)', // Added shadow to make it look like a floating card
          textAlign: 'left',
          backgroundColor: '#fff', // White background to match the card style
          minHeight: 'auto', // Allow height to adjust based on content
        }}
        initial={{ y: 50, opacity: 0 }}  
        animate={{ y: 0, opacity: 1 }}    
        transition={{ duration: 0.8 }}     
      >
        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '40px' }}>Applicant Details</h2>

        {/* Applicant Details Section */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns layout
            gap: '30px', // Increased the gap between the two columns
            marginBottom: '40px', // Space between the applicant details and the next section
          }}
        >
          {/* Applicant Details */}
          <div 
            style={{
              padding: '25px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f9f9f9', // Added light background to differentiate sections
            }}
          >
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaUser style={{ marginRight: '10px' }} /> <strong>Name:</strong> {applicant.name}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaBriefcase style={{ marginRight: '10px' }} /> <strong>Applied Position:</strong> {applicant.appliedPosition}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaPhoneAlt style={{ marginRight: '10px' }} /> <strong>Contact Number:</strong> {applicant.contact}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaEnvelope style={{ marginRight: '10px' }} /> <strong>Email:</strong> {applicant.email}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaCalendarAlt style={{ marginRight: '10px' }} /> <strong>Date of Birth:</strong> {applicant.dob}
            </p>
          </div>

          <div 
            style={{
              padding: '25px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f9f9f9', // Added light background to differentiate sections
            }}
          >
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaFlag style={{ marginRight: '10px' }} /> <strong>Nationality:</strong> {applicant.nationality}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaGenderless style={{ marginRight: '10px' }} /> <strong>Gender:</strong> {applicant.gender}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaHeart style={{ marginRight: '10px' }} /> <strong>Marital Status:</strong> {applicant.maritalStatus}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaBusinessTime style={{ marginRight: '10px' }} /> <strong>Experience:</strong> {applicant.experience}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '18px' }}>
              <FaGraduationCap style={{ marginRight: '10px' }} /> <strong>Education:</strong> {applicant.education}
            </p>
          </div>
        </div>

        {/* Document Attached Section */}
        <div
          style={{
            padding: '25px',
            marginBottom: '40px', // Added margin bottom for spacing between sections
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
            backgroundColor: '#f9f9f9'
          }}
        >
          <h4 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>Documents Attached</h4>
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '30px', // Increased the gap between document items
              flexWrap: 'wrap'  
            }}
          >
            {documents.map((doc, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '48%', 
                  marginBottom: '25px' // Added margin to separate document items
                }}
              >
                {/* Display Icon based on file type */}
                <div style={{ marginRight: '20px' }}>
                  {doc.type === 'pdf' ? (
                    <img 
                      src="/src/assets/pdf.png" 
                      alt="PDF Icon" 
                      style={{ width: '40px', height: 'auto' }} 
                    />
                  ) : (
                    <img 
                      src="/src/assets/image.png" 
                      alt="Image Icon" 
                      style={{ width: '40px', height: 'auto' }} 
                    />
                  )}
                </div>
                
                {/* File Name and Type */}
                <div>
                  <p style={{ margin: 0, fontSize: '16px' }}>
                    <strong>{doc.name}</strong> 
                    <span style={{ color: '#888', marginLeft: '5px' }}>(
                      {doc.type === 'pdf' ? 'PDF' : 'Image'}
                    )</span>
                  </p>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontSize: '16px' }}>
                    View File
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ApplicantPreviewPage;
