// DocumentModal.js
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';


const DocumentModal = ({ showModal, closeModal, modalDocument, handlePrint }) => {
  // Sample document data with names and types
  const sampleDocuments = [
    { name: 'Sample Word Document', type: 'word', image: '/src/assets/docx.png', url: '/path/to/word/document' },  
    { name: 'Sample PDF Document', type: 'pdf', image: '/src/assets/pdf.png', url: '/path/to/pdf/document' },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Handle opening the document in a new tab
  const handleOpenDocument = (url) => {
   
    window.open(url, '_blank');
  };

  // Define hover styles without affecting layout or text position
  const getHoverStyle = (index) => {
    if (index === hoveredIndex) {
      return {
        backgroundColor: '#f0f0f0', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        transition: 'all 0.3s ease', 
      };
    }
    return {};
  };

  return (
    <Modal show={showModal} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Document Viewer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h5>Documents:</h5>
          <div className="d-flex flex-column">
            {sampleDocuments.map((document, index) => (
              <div
                key={index}
                className="d-flex align-items-center mb-3"
                onClick={() => handleOpenDocument(document.url)}
                onMouseEnter={() => setHoveredIndex(index)} 
                onMouseLeave={() => setHoveredIndex(null)} 
                style={{
                  cursor: 'pointer', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  ...getHoverStyle(index), 
                }}
              >
                {/* Conditionally render the image based on document type */}
                <div className="me-3">
                  <img
                    src={document.image}  
                    alt={`${document.type} icon`}
                    style={{ width: '30px', height: '30px' }}  
                  />
                </div>
                <div>
                  <h6>{document.name}</h6>
                  <p>{document.type.toUpperCase()} Document</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
     
    </Modal>
  );
};

export default DocumentModal;
