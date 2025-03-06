import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/adminsidebar';
import { FaUser, FaBriefcase, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';  // Add appropriate icons

const PreviewPage = () => {
  const location = useLocation();
  const { employer } = location.state || {};  // Destructuring with fallback

  if (!employer) {
    return <div>Employer details are unavailable. Please go back.</div>;
  }

  const documents = [
    { name: 'Resume.pdf', type: 'pdf', url: 'path/to/resume.pdf' },
    { name: 'ProfilePic.jpg', type: 'image', url: 'path/to/profilePic.jpg' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', position: 'relative' }}>
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
          flex: 1,
          marginLeft: '240px',  // Adjust space for sidebar
          padding: '30px',
          borderRadius: '8px',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
          textAlign: 'left',
          minHeight: 'auto',
          maxWidth: '1100px',  // Adjust max width for the content container
          margin: '0 auto',  // Center the content horizontally
          overflowY: 'auto',  // Enables vertical scrolling when content overflows
          maxHeight: 'calc(100vh - 60px)', // Ensure the container doesn't overflow the viewport height
        }}
        initial={{ y: 50, opacity: 0 }}  
        animate={{ y: 0, opacity: 1 }}    
        transition={{ duration: 0.8 }}
      >
        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '40px' }}>Employer Details</h2>

        {/* Employer Details Section */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns layout
            gap: '30px',  // Increased gap between elements
            marginBottom: '40px', // Increased space between sections
          }}
        >
          {/* Employer Details */}
          <div 
            style={{
              padding: '25px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              fontSize: '18px', // Increased text size for employer details
            }}
          >
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '20px' }}>
              <FaUser style={{ marginRight: '15px' }} /> <strong>Name:</strong> {employer.name}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '20px' }}>
              <FaBriefcase style={{ marginRight: '15px' }} /> <strong>Designation:</strong> {employer.position}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '20px' }}>
              <FaPhoneAlt style={{ marginRight: '15px' }} /> <strong>Contact Number:</strong> {employer.contact}
            </p>
            <p style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', fontSize: '20px' }}>
              <FaEnvelope style={{ marginRight: '15px' }} /> <strong>Email:</strong> {employer.email}
            </p>
          </div>
        </div>

        {/* ID Preview Section */}
        <div 
          style={{
            padding: '25px',
            marginBottom: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            fontSize: '20px',
          }}
        >
          <h4 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '30px', marginTop: '20px' }}>Uploaded ID Preview</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
            {/* Front ID */}
            <div 
              style={{
                width: '48%', 
                height: '280px',  // Increased height for better view
                border: '2px dashed #007bff', 
                borderRadius: '8px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                position: 'relative',
                backgroundColor: '#f5f5f5',
                minHeight: '280px',
              }}
            >
              <span style={{
                fontSize: '20px', 
                color: '#888', 
                fontWeight: 'bold',
                position: 'absolute'
              }}>
                Front ID
              </span>
              <img 
                src={employer.idFront} 
                alt="ID Front" 
                style={{
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  opacity: employer.idFront ? 1 : 0,
                }} 
              />
            </div>
            
            {/* Back ID */}
            <div 
              style={{
                width: '48%', 
                height: '280px',  // Increased height for better view
                border: '2px dashed #007bff', 
                borderRadius: '8px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                position: 'relative',
                backgroundColor: '#f5f5f5',
                minHeight: '280px',
              }}
            >
              <span style={{
                fontSize: '20px', 
                color: '#888', 
                fontWeight: 'bold',
                position: 'absolute'
              }}>
                Back ID
              </span>
              <img 
                src={employer.idBack} 
                alt="ID Back" 
                style={{
                  width: '100%', 
                  height: '100%',  
                  objectFit: 'cover',
                  borderRadius: '8px',
                  opacity: employer.idBack ? 1 : 0,
                }} 
              />
            </div>
          </div>
        </div>

        {/* Document Attached Section */}
        <div
          style={{
            padding: '25px',
            marginBottom: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
            backgroundColor: '#f9f9f9'
          }}
        >
          <h4 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '30px', marginTop: '30px' }}>Documents Attached</h4>
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '30px',
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
                  marginBottom: '25px'  // Increased space between document items
                }}
              >
                {/* Display Icon based on file type */}
                <div style={{ marginRight: '20px' }}>
                  {doc.type === 'pdf' ? (
                    <img 
                      src="/src/assets/pdf.png" 
                      alt="PDF Icon" 
                      style={{ width: '50px', height: 'auto' }} 
                    />
                  ) : (
                    <img 
                      src="/src/assets/image.png" 
                      alt="Image Icon" 
                      style={{ width: '50px', height: 'auto' }} 
                    />
                  )}
                </div>
                
                {/* File Name and Type */}
                <div>
                  <p style={{ margin: 0, fontSize: '20px' }}>
                    <strong>{doc.name}</strong> 
                    <span style={{ color: '#888', marginLeft: '10px', fontSize: '18px' }}>( 
                      {doc.type === 'pdf' ? 'PDF' : 'Image' }
                    )</span>
                  </p>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', fontSize: '18px' }}>
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

export default PreviewPage;
