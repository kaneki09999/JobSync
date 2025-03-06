import React, { useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";  // Import edit icon

const PreviewModal = ({
  showModal,
  handleClosePreviewModal,
  handleConfirmEdit,
  handleAdd,  // Existing function to handle Add button action
  modalContent,
  modalData,  // Current data to display in the table
  setModalData,  // Function to update modalData (new data)
}) => {
  const [showAddModal, setShowAddModal] = useState(false);  // State for the Add modal
  const [newEntry, setNewEntry] = useState({}); // State to store new entry data

  if (!showModal) return null;

  // Create a string with field values separated by commas
  const fieldValues = modalContent?.fields
    .map((field) => modalData[field.name])
    .filter((value) => value && value !== "")
    .join(", ");

  // Handle showing Add modal
  const handleShowAddModal = () => setShowAddModal(true);

  // Handle hiding Add modal
  const handleCloseAddModal = () => setShowAddModal(false);

  // Handle saving new entry
  const handleSaveNewEntry = () => {
    // Save the new entry logic here, for example calling the handleAdd function passed as a prop.
    handleAdd(newEntry);  // Assuming `handleAdd` will update the data in the parent component
    setModalData((prevData) => [...prevData, newEntry]);  // Update modalData with new entry
    setShowAddModal(false);  // Close the modal after saving
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  return (
    <div style={modalStyle}>
      <div>
        <h4>Preview</h4>
        <Table bordered={false} style={tableStyle}>
          <tbody>
            <tr>
              <td style={{ textAlign: "left" }}>
                {fieldValues}
              </td>
              <td style={{ textAlign: "right" }}>
                <Button 
                  variant="outline-primary" 
                  onClick={handleConfirmEdit} 
                  style={{ padding: "5px 10px", fontSize: "16px" }}>
                  <FaEdit />  {/* Icon inside button */}
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
        <div style={buttonContainerStyle}>
          <Button onClick={handleClosePreviewModal} variant="secondary" style={{ marginLeft: "10px" }}>
            Close
          </Button>
          <Button onClick={handleShowAddModal} variant="success" style={{ marginLeft: "10px" }}>
            Add
          </Button>
        </div>
      </div>

      {/* Add Modal for new entry */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {modalContent?.fields.map((field, index) => (
              <Form.Group key={index}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type="text"
                  name={field.name}
                  value={newEntry[field.name] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label}`}
                  style={{ color: "black" }}  // Ensure the text color is black
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNewEntry}>
            Save Entry
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  zIndex: "9999",
  maxWidth: "600px",
  width: "100%",
};

const buttonContainerStyle = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "flex-end",
};

// Styling to remove vertical lines in table
const tableStyle = {
  borderCollapse: "collapse", // Ensures no space between cells
};

export default PreviewModal;
