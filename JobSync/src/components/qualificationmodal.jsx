import React from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { FaClipboardCheck } from "react-icons/fa";

const QualificationModal = ({
  showModal,
  handleCloseModal,
  handleSaveModal,
  modalContent,
  modalData,
  handleInputChange, 
  handleDoesNotExpireChange,
  doesNotExpire,
}) => {
  // Check if it's edit mode (modalData.id exists)
  const isEditMode = modalData?.id !== undefined;

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalContent?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Render fields dynamically based on modal content */}
          {modalContent?.fields.map((field, index) => {
            if (field.isExpirationDate) {
              // Special case for expiration date (Licenses section)
              return (
                <div key={index}>
                  <Form.Group className="mb-3">
                    <Form.Label>Expiration Date</Form.Label>
                    {!doesNotExpire && (
                      <Row>
                        <Col md={6}>
                          <Form.Control
                            as="select"
                            name="expirationMonth"
                            value={modalData.expirationMonth || ""}
                            onChange={handleInputChange}
                          >
                            {[
                              "January",
                              "February",
                              "March",
                              "April",
                              "May",
                              "June",
                              "July",
                              "August",
                              "September",
                              "October",
                              "November",
                              "December",
                            ].map((month, index) => (
                              <option key={index} value={month}>
                                {month}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>

                        <Col md={6}>
                          <Form.Control
                            as="select"
                            name="expirationYear"
                            value={modalData.expirationYear || ""}
                            onChange={handleInputChange}
                          >
                            {["2023", "2024", "2025", "2026", "2027"].map(
                              (year, index) => (
                                <option key={index} value={year}>
                                  {year}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    )}
                    <Form.Check
                      type="checkbox"
                      label="No expiry"
                      checked={doesNotExpire}
                      onChange={handleDoesNotExpireChange}
                      style={{ marginTop: "10px" }}
                    />
                  </Form.Group>
                </div>
              );
            }

            // Default rendering for other fields
            return (
              <Form.Group className="mb-3" controlId={`formInput${index}`} key={index}>
                <Form.Label>{field.label}</Form.Label>
                {field.type === "text" ? (
                  <Form.Control
                    type="text"
                    name={field.name}
                    value={modalData[field.name] || ""}
                    onChange={handleInputChange}
                    placeholder={`Enter ${field.label}`}
                  />
                ) : field.type === "dropdown" ? (
                  <Form.Control
                    as="select"
                    name={field.name}
                    value={modalData[field.name] || ""}
                    onChange={handleInputChange}
                  >
                    {field.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Control>
                ) : null}
              </Form.Group>
            );
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveModal}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QualificationModal;
