import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { postToEndpoint, getFromEndpoint } from '../components/apiService';
import Swal from 'sweetalert2';

const ModalComponent = ({ show, handleClose, selectedApplicants, job_id, jobTitle, application_id }) => {
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAssessment = (type) => {
    let initialText = ``;
    if (type === "Aptitude Tests" || type === "Situational Judgment Tests") {
      initialText = `Enter ${type} question here... \nA) \nB) \nC) \nD) `;
    }

    setSelectedAssessments((prev) => {
      const existingType = prev.find((item) => item.type === type);
      if (existingType) {
        const nextId = existingType.assessments.length
          ? Math.max(...existingType.assessments.map((a) => a.id)) + 1
          : 1;

        return prev.map((item) =>
          item.type === type
            ? {
                ...item,
                assessments: [
                  ...item.assessments,
                  {
                    id: nextId,
                    instructions: initialText,
                    correctAnswer: "",
                    showAnswerInput: false,
                    showImageInput: false,
                    showFileInput: false,
                    imagePreview: null,
                    filePreview: null,
                    fileEmbed: null, 
                  },
                ],
              }
            : item
        );
      }

      return [
        ...prev,
        {
          type,
          assessments: [
            {
              id: 1,
              instructions: initialText,
              correctAnswer: "",
              showAnswerInput: false,
              showImageInput: false,
              showFileInput: false,
              imagePreview: null,
              filePreview: null,
              fileEmbed: null,
            },
          ],
        },
      ];
    });
  };

  const handleRemoveAssessment = (type, id) => {
    setSelectedAssessments((prev) =>
      prev
        .map((item) =>
          item.type === type
            ? {
                ...item,
                assessments: item.assessments
                  .filter((a) => a.id !== id) 
                  .map((a, index) => ({
                    ...a,
                    id: index + 1,
                  })),
              }
            : item
        )
        .filter((item) => item.assessments.length > 0)
    );
  };
  

  const handleTextChange = (type, id, value) => {
    setSelectedAssessments((prev) =>
      prev.map((item) =>
        item.type === type
          ? {
              ...item,
              assessments: item.assessments.map((a) =>
                a.id === id ? { ...a, instructions: value } : a
              ),
            }
          : item
      )
    );
  };

  const handleAnswerChange = (type, id, value) => {
    setSelectedAssessments((prev) =>
      prev.map((item) =>
        item.type === type
          ? {
              ...item,
              assessments: item.assessments.map((a) =>
                a.id === id ? { ...a, correctAnswer: value } : a
              ),
            }
          : item
      )
    );
  };

  const toggleAnswerInput = (type, id) => {
    setSelectedAssessments((prev) =>
      prev.map((item) =>
        item.type === type
          ? {
              ...item,
              assessments: item.assessments.map((a) =>
                a.id === id
                  ? { ...a, showAnswerInput: !a.showAnswerInput }
                  : a
              ),
            }
          : item
      )
    );
  };
  
  const handleSaveToDatabase = async () => {
    try {
      setIsSubmitting(true);
      const dataToSave = application_id
        ? selectedAssessments.flatMap(({ type, assessments }) =>
            assessments.map(({ instructions, correctAnswer, imageFile, fileData }) => ({
              type,
              instructions,
              correctAnswer,
              application_id: application_id, 
              job_id,
              image: imageFile,
              file: fileData,
              jobTitle,
            }))
          )
        : selectedApplicants.flatMap((appId) =>
            selectedAssessments.flatMap(({ type, assessments }) =>
              assessments.map(({ instructions, correctAnswer, imageFile, fileData }) => ({
                type,
                instructions,
                correctAnswer,
                application_id: appId, 
                job_id,
                image: imageFile,
                file: fileData,
                jobTitle,
              }))
            )
          );
  
      const response = await postToEndpoint("/assessment.php",
        dataToSave
      );
  
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "The assessments have been successfully assigned to the applicants.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Failed",
          text: "Failed to set the assessments for the applicants. Please try again.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("Error saving assessments:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while saving assessments. Please check your network or contact support.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  
  const renderInputFields = () => {
    const groupedAssessments = selectedAssessments.reduce((acc, { type, assessments }) => {
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(...assessments);
      return acc;
    }, {});
  
    return Object.keys(groupedAssessments).map((type) => (
      <div key={type} className="mb-4">
        <h5 className="ms-4 text-primary">{type}</h5>
        <div className="border-top pt-3">
          {groupedAssessments[type].map((item) => (
            <div key={`${type}-${item.id}`} className="p-3 bg-light rounded shadow-sm mb-3">
              {/* Render the form fields */}
              <Form.Group>
                <Form.Label className="fw-bold text-secondary">
                  {type} Instructions
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={item.instructions}
                  onChange={(e) => handleTextChange(type, item.id, e.target.value)}
                  placeholder={`Enter ${type} details here...`}
                  className="border-secondary"
                />
              </Form.Group>
              <div className="d-flex flex-wrap mt-3">
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2 mb-2"
                  onClick={() => handleRemoveAssessment(type, item.id)}
                >
                  Remove
                </Button>
                {/* Only show the Add Answer button for Aptitude Tests */}
                {type === "Aptitude Tests" && (
                  <Button
                    variant={item.showAnswerInput ? "danger" : "outline-secondary"}
                    size="sm"
                    className="me-2 mb-2"
                    onClick={() => toggleAnswerInput(type, item.id)}
                  >
                    {item.showAnswerInput ? "Remove Answer" : "Add Answer"}
                  </Button>
                )}
              </div>

  
              {item.showAnswerInput && (
                <div className="mt-3">
                  <Form.Group>
                    <Form.Label className="fw-bold text-secondary">
                      Correct Answer (Optional)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      value={item.correctAnswer}
                      onChange={(e) => handleAnswerChange(type, item.id, e.target.value)}
                      placeholder="Enter the correct answer"
                      className="border-secondary"
                    />
                  </Form.Group>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    ));
  };

  const types = [
    { type: "Skill Tests", description: "Evaluate technical or hard skills." },
    { type: "Aptitude Tests", description: "Measure problem-solving or logic skills." },
    { type: "Personality Assessments", description: "Understand behavioral traits." },
    { type: "Situational Judgment Tests", description: "Assess decision-making in scenarios." },
    { type: "Portfolio or Work Samples", description: "Request past work examples." },
    { type: "Practical Exercises", description: "Simulate real job tasks or activities." },
    { type: "Technical Interviews", description: "Test in-depth technical knowledge." },
    { type: "Behavioral Interviews", description: "Understand past work behaviors." },
    { type: "Communication Skills", description: "Evaluate communication effectiveness." },
    { type: "Team Collaboration Tasks", description: "Test teamwork skills." },
    { type: "Leadership Assessments", description: "Assess decision-making and leadership." },
    { type: "Cultural Fit Questions", description: "Check alignment with company values." },
  ];

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Add Assessment</Modal.Title>
      </Modal.Header>
      <Modal.Body>

    <>
        {renderInputFields()}
        <div
          className="d-flex flex-wrap gap-2 mb-3"
          style={{ justifyContent: "space-around" }}
        >
          {types.map(({ type, description }) => (
            <Card
              key={type}
              className="p-2 bg-light text-center"
              style={{
                cursor: "pointer",
                width: "23%",
                minHeight: "110px",
                borderRadius: "50px",
                background:
                  "linear-gradient(49deg, rgb(230, 241, 255) 0%, rgb(255, 255, 255) 52%, rgb(223, 240, 255) 100%)",
              }}
              onClick={() => handleAddAssessment(type)}
            >
              <Card.Body>
                <Card.Title style={{ fontSize: "13px" }}>{type}</Card.Title>
                <Card.Text style={{ fontSize: "13px", color: "#3e3f40" }}>
                  {description}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
        <div
          className="mt-4"
          style={{
            padding: "10px 15px 13px",
            backgroundColor: "#ebebeb",
            borderRadius: "5px",
            display: "flex",
          }}
        >
          <strong>Note:</strong>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "0",
              marginLeft: "10px",
              marginTop: "2px",
              color: "#3e3f40",
            }}
          >
            Kindly ensure that all sections of each assessment are fully
            completed. If an assessment contains multiple response options,
            please include all relevant answers before confirming.
          </p>
        </div>
    </>


      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveToDatabase}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Assessments"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
