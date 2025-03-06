import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

const SkillsModal = ({ showModal, handleCloseModal, modalData, handleSaveModal, modalContent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(modalData);

  useEffect(() => {
    setData(modalData); // Reset data when modal content changes
  }, [modalData]);

  const handleEdit = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    handleSaveModal(data); 
    setIsEditing(false); 
  };

  const renderFields = () => {
    if (modalContent === "Skills") {
      return (
        <Form.Group>
          <Form.Label>Skill Name</Form.Label>
          <Form.Control
            type="text"
            name="skillName"
            value={data.skillName}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          <Form.Label>Years of Experience</Form.Label>
          <Form.Control
            type="text"
            name="yearsOfExperience"
            value={data.yearsOfExperience}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </Form.Group>
      );
    }
    // You can add more conditions for other qualification types
    return null;
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalContent}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {renderFields()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        {!isEditing ? (
          <Button variant="primary" onClick={handleEdit}>
            <FaEdit style={{ marginRight: "8px" }} /> Edit
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default SkillsModal;
