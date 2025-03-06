import { useState, useRef, useEffect } from "react";
import { Form, Row, Col, Button, Container, Card, Modal, Spinner } from "react-bootstrap";
import { FaPlus, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa'; // Importing the plus icon
import "bootstrap/dist/css/bootstrap.min.css";
import default_user from '../../assets/images_def.jfif';
import { useLocation, Link } from "react-router-dom"; 
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faUser, faGraduationCap, faTools, faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import logo from '../../assets/logo3.png';
import html2canvas from "html2canvas";
import { postToEndpoint } from '../../components/apiService';
import { useAuth } from "../../AuthContext";
import { user } from "react";
import apiClient from "../../components/apiClient";
import Swal from "sweetalert2";

export default function ResumeBuilder() {
  const { user } = useAuth();
  const location = useLocation();
  const { jobTitle, skills, profileSummary, workExperience } = location.state || {};   
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState([]); 
  const [applicant, setApplicants] = useState([]); 
  const [workExperiences, setWorkExperiences] = useState([
    { companyName: "", jobTitle: jobTitle || "", workCity: "", workExperience: workExperience || "" }
  ]);
  const [resume, setResume] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const handleWorkExperienceChange = (index, field, value) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences[index][field] = value;
    setWorkExperiences(updatedExperiences);
  };

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, { companyName: "", jobTitle: "", workCity: "", workExperience: "" }]);
  };

  const deleteWorkExperience = (index) => {
    const updatedExperiences = workExperiences.filter((_, i) => i !== index);
    setWorkExperiences(updatedExperiences);
  };
  
  const [workExperienceVisible, setWorkExperienceVisible] = useState(true);

  const toggleWorkExperience = () => {
    setWorkExperienceVisible(!workExperienceVisible);
  };

  const generateDescription = async (index, jobTitle) => {
    if (!jobTitle) {
      alert("Please enter a job title first.");
      return;
    }
    setLoadingStates((prev) => {
      const updatedLoading = [...prev];
      updatedLoading[index] = true;
      return updatedLoading;
    });
  
    try {
      const response = await postToEndpoint("/generateResumeDescription.php", { jobTitle });
      const generatedText = response.data.description || "No description available.";
  
      const updatedExperiences = [...workExperiences];
      updatedExperiences[index].workExperience = generatedText;
      setWorkExperiences(updatedExperiences);
    } catch (error) {
      console.error("Error generating description:", error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setLoadingStates((prev) => {
        const updatedLoading = [...prev];
        updatedLoading[index] = false;
        return updatedLoading;
      });
    }
  };
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await postToEndpoint("/getapplicantDetails.php", { applicant_id: user?.id });
        if (response.data.applicants) {
          setApplicants(response.data.applicants);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

  const fetchResumeBuild = async () => {
    try {
      const response = await postToEndpoint("/getResumeBuild.php", { applicant_id: user?.id });
      if (response.data.applicant) {
        setResume(response.data.applicant);

        setFormData(prevFormData => ({
          ...prevFormData,
          firstName: response.data.applicant.firstname || "",
          lastName: response.data.applicant.lastname || "",
          phone: response.data.applicant.contact || "",
          email: response.data.applicant.email || "",
          nationality: response.data.applicant.nationality || "",
          dob: response.data.applicant.birthdate || "",
          streetNumber: response.data.applicant.address || "",
          city: response.data.applicant.city || "",
          zipcode: response.data.applicant.postal || "",
          education: response.data.applicant.education || "",
          program: response.data.applicant.program || "",
          profile: response.data.applicant.profileSummary || "",
          country: response.data.applicant.country || "",
          skills: response.data.skills.map(skill => skill.skill_name) || [""]
        }));

        setWorkExperiences(response.data.work_experience.map(exp => ({
          companyName: exp.company_name || "",
          jobTitle: exp.job_title || "",
          workCity: exp.prevcity || "",
          workExperience: exp.description || ""
        })));

        if (response.data.applicant.profile_picture_url) {
          setProfileImage(`${apiClient.defaults.baseURL}/getImage.php?image=${response.data.applicant.profile_picture_url.split("/").pop()}`);
        }
      }
    } catch (error) {
      console.error("Error fetching resume data:", error);
    }
  };

  if (user?.id) {
    Promise.all([fetchApplicants(), fetchResumeBuild()]).then(() => {
      setTimeout(() => {
        setIsLoading(false);  
      }, 2000);
    });
  } else {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }
}, [user?.id]);

useEffect(() => {
  if (applicant.length > 0) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      firstName: resume.firstname || applicant[0]?.firstname || "",
      lastName: resume.lastname || applicant[0]?.lastname || "",
      phone: resume.contact || applicant[0]?.contact || "",
      email: resume.email || applicant[0]?.email || "",
      nationality: resume.nationality || applicant[0]?.nationality || "",
      dob: resume.birthday || applicant[0]?.birthday || "",
      streetNumber: resume.address || applicant[0]?.address || "",
      city: resume.city || applicant[0]?.city || "",
      zipcode: resume.postal || applicant[0]?.postal || "",
      education: resume.attainment || applicant[0]?.attainment || "",
    }));
  }
}, [applicant, resume]);

const handleSave = async () => {
  if (!user?.id) {
    Swal.fire("Error", "User not logged in", "error");
    return;
  }

  const validWorkExperiences = workExperiences.map(work => ({
    company_name: work.companyName || "",
    job_title: work.jobTitle || "",
    prevcity: work.workCity || "",
    description: work.workExperience || ""
  }));

  let profilePictureBase64 = null;

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  if (profileImage instanceof File) {
    try {
      profilePictureBase64 = await convertToBase64(profileImage);
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      Swal.fire("Error", "Failed to process profile picture.", "error");
      return;
    }
  } else if (profileImage?.startsWith("data:image")) {
    profilePictureBase64 = profileImage.split(",")[1];
  } else if (resume.profile_picture_url) {
    profilePictureBase64 = resume.profile_picture_url;
  } else if (applicant[0]?.profile_picture_url) {
    profilePictureBase64 = applicant[0].profile_picture_url;
  }

  const payload = {
    applicant_id: user?.id,
    firstname: formData.firstName,
    lastname: formData.lastName,
    contact: formData.phone,
    email: formData.email,
    address: formData.streetNumber,
    city: formData.city,
    country: formData.country,
    nationality: formData.nationality,
    birthdate: formData.dob,
    postal: formData.zipcode,
    education: formData.education,
    program: formData.program,
    profileSummary: formData.profile,
    skills: formData.skills,
    workExperiences: validWorkExperiences,
    profile_picture: profilePictureBase64
  };

  try {
    const response = await postToEndpoint("/saveResumeBuilder.php", payload);
    if (response.data) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Resume saved successfully!',
        showConfirmButton: false,
        timer: 800,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    } else {
      Swal.fire("Error", "Failed to save resume.", "error");
    }
  } catch (error) {
    console.error("Error saving resume:", error);
    Swal.fire("Error", "An error occurred while saving your resume.", "error");
  }
};

  const handleGenerate = () => {
    if (!formData.jobTitle.trim()) {
      setError("Field desired job title is required.");
      return;
    }
    setError(""); 
    generateProfileSummary();
    setShowModal(false);
  };

  const generateProfileSummary = async () => {  
    setLoading(true);
    try {
      const response = await postToEndpoint("/generateProfileSummary.php", { jobTitle: formData.jobTitle });
  
      console.log("API Response:", response.data); 
      const generatedText = response.data.profileSummary || "No profile summary available.";
  
      setFormData({ ...formData, profile: generatedText });
    } catch (error) {
      console.error("Error generating profile summary:", error);
      alert("Failed to generate profile summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    country: "",
    profile: profileSummary || "",
    companyName: "", 
    workCity: "", 
    dob: "",
    nationality: "",
    streetNumber: "",
    zipcode: "",
    skills: skills || [""],
    education: "",
    program: "",
  });
  

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, ""], 
    });
  };
  const handleRemoveSkill = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = formData.skills.map((skill, i) =>
      i === index ? value : skill
    );
    setFormData({ ...formData, skills: updatedSkills });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "Not Provided"; 
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const pdfRef = useRef();

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pdfElement = pdfRef.current;
  
    if (!pdfElement) return;
  
    const scale = 2;
    const a4Width = 220;
    const a4Height = 309;
    const leftMargin = 3; // Reduced left margin
    const rightMargin = 15;
    const topMargin = 5; // Reduced top margin
    const bottomMargin = 20; // Additional bottom margin
    const contentWidth = a4Width - leftMargin - rightMargin;
    const contentHeight = a4Height - topMargin - bottomMargin;
    const pxToMm = 0.229683;
    const width = Math.floor(contentWidth / pxToMm);
    const height = Math.floor(contentHeight / pxToMm);
  
    html2canvas(pdfElement, {
      scale: scale,
      width: width,
      height: pdfElement.scrollHeight, // Capture full height
      useCORS: true,
      windowWidth: width,
      windowHeight: pdfElement.scrollHeight
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      let imgWidth = contentWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let y = topMargin;
      let currentHeight = 0;
  
      while (currentHeight < imgHeight) {
        let availableHeight = contentHeight - y;
        let clipHeight = Math.min(availableHeight, imgHeight - currentHeight);
        
        if (clipHeight < 20) { // Ensure no content is cut at the bottom margin
          doc.addPage();
          y = topMargin; // Apply top margin to new pages
          availableHeight = contentHeight;
          clipHeight = Math.min(availableHeight, imgHeight - currentHeight);
        }
        
        let croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = canvas.width;
        croppedCanvas.height = (clipHeight * canvas.width) / imgWidth;
        let ctx = croppedCanvas.getContext("2d");
        ctx.drawImage(
          canvas,
          0,
          (currentHeight * canvas.width) / imgWidth,
          canvas.width,
          (clipHeight * canvas.width) / imgWidth,
          0,
          0,
          canvas.width,
          (clipHeight * canvas.width) / imgWidth
        );
  
        let clippedImgData = croppedCanvas.toDataURL("image/png");
        doc.addImage(clippedImgData, "PNG", leftMargin, y, imgWidth, clipHeight, '', "FAST");
        currentHeight += clipHeight;
        y += clipHeight;
  
        if (currentHeight < imgHeight) {
          doc.addPage();
          y = topMargin; // Ensure the top margin is applied on new pages
        }
      }
  
      doc.save("resume.pdf");
    }).catch((err) => console.error("Error generating PDF:", err));
  };
  
  
  
  const [isLoading, setIsLoading] = useState(true);
  const [skillsVisible, setSkillsVisible] = useState(true);
  const toggleSkills = () => {
    setSkillsVisible(!skillsVisible);
  };
  const profilePicture = resume.profile_picture_url
  ? `${apiClient.defaults.baseURL}/getImage.php?image=${resume.profile_picture_url.split("/").pop()}`
  : applicant[0]?.profile_picture_url
  ? `${apiClient.defaults.baseURL}/getImage.php?image=${applicant[0].profile_picture_url.split("/").pop()}`
  : "default-profile.png";
  const [isPrimary, setIsPrimary] = useState(false);

  const handleCheckboxChange = () => {
    if (!isPrimary) {
      const confirmPrimary = window.confirm(
        "Are you sure you want to make this your primary resume?"
      );
      if (confirmPrimary) {
        setIsPrimary(true);
        handleSetPrimary(); // Call function to set as primary
      }
    } else {
      setIsPrimary(false);
    }
  };
  return (
    <>
    {isLoading ? (
        <div id="preloader">
        </div>
      ) : (
        <>
      <header className="p-2" style={{position: 'absolute', top: '0', left: '50px', zIndex: '999'}}>
          <div className="container">
            <Link to="/applicantprofile" style={{ color: '#212529', textAlign: 'left' }}>
              <div className="logo d-flex align-items-center mb-2 mb-md-0">
                <img src={logo} alt="JobSync Logo" width="88" height="76" />
                <span className="ms-2 fw-bold fs-2">JobSync</span>
              </div>
            </Link>
          </div>
        </header>
      <Container fluid className="py-4 mt-3" 
        style={{ background: "#f3f3f3", margin: 0, padding: '0 20px', position: 'absolute', left: '0', top: '80px', display: 'flex', justifyContent: 'center'}}>
        <Row className="d-flex justify-content-between" style={{textAlign: 'left'}}>
          <Col lg={6} className="mr-3"> {/* Adjusted to md={5} lg={5} */}
          
            <Card className="shadow-sm p-4">
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h2 className="mb-3">Personal Information</h2>
                <div className="d-flex align-items-center">
                <Button onClick={downloadPDF} style={{borderRadius: '3px', border: 'none', background: '#0a65cc', height: '32px', fontSize: '13px'}}>
                      <FontAwesomeIcon icon={faDownload} /> Download PDF
                </Button>
                <Button
                  onClick={handleSave}
                  className="ms-2"
                  style={{
                    background: "#28a745",
                    border: "none",
                    borderRadius: "3px",
                    height: "32px",
                    fontSize: "13px",
                  }}
                >
                  Save Resume
                </Button>

                <Form.Check
                  type="checkbox"
                  className="ms-2"
                  checked={isPrimary}
                  onChange={handleCheckboxChange}
                />
                </div>
              </div>
              <div className="d-flex align-items-center mb-3" style={{justifyContent: 'space-around'}}>
            <div className="profile-image-container"
                style={{ 
                  width: "150px", height: "150px", marginRight: "20px", display: "flex", flexShrink: 0, 
                  justifyContent: "center", alignItems: "center", border: "2px solid #ccc", 
                  borderRadius: "50%", overflow: "hidden", position: "relative" 
                }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    style={{ 
                      width: "100%", height: "100%", objectFit: "cover", 
                      borderRadius: "50%", display: "block" 
                    }}
                  />
                ) :(
                  <img
                    src={profilePicture}
                    alt="Profile"
                    style={{ 
                      width: "100%", height: "100%", objectFit: "cover", 
                      borderRadius: "50%", display: "block" 
                    }}
                    crossOrigin="anonymous"
                  />
                  
                )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{ 
                      position: "absolute", top: "50%", left: "50%", 
                      transform: "translate(-50%, -50%)", opacity: 0, cursor: "pointer", width: "100%", height: "100%" 
                    }} 
                    id="uploadButton" 
                  />

                  {/* Plus icon - Hidden by default, appears only on hover */}
                  <label 
                    htmlFor="uploadButton" 
                    style={{ 
                      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                      fontSize: "30px", color: "#fff", cursor: "pointer", 
                      background: "rgba(0, 0, 0, 0.5)", padding: "10px", borderRadius: "50%",
                      display: "none" // Hide by default
                    }} 
                    className="plus-icon"
                  >
                    <FaPlus 
                      style={{ color: "white", border: "2px dashed white", padding: "5px", borderRadius: "4px" }} 
                    />
                  </label>
                </div>
                
                {/* CSS - Show Plus Icon on Hover */}
                <style> {`
                  .profile-image-container:hover .plus-icon {
                    display: flex !important;
                    justify-content: center;
                    align-items: center;
                  }`
                  }
                </style>
                <div style={{width: '75%'}}>
                <Row className="mb-3"><Col md={6}><Form.Label>First Name</Form.Label><Form.Control type="text" className="register2" name="firstName" value={formData.firstName} onChange={handleChange} /></Col>

                <Col md={6}><Form.Label>Last Name</Form.Label><Form.Control className="register2" type="text" name="lastName" value={formData.lastName} onChange={handleChange} /></Col>
                  </Row>

                <Row className="mb-3"><Col md={6}><Form.Label>Phone</Form.Label>
                <Form.Control type="text" name="phone" className="register2" value={formData.phone} onChange={handleChange} /></Col>
                <Col md={6}><Form.Label>Email</Form.Label><Form.Control className="register2" type="email" name="email" value={formData.email} onChange={handleChange} />
                </Col></Row>
                </div>
                </div>

                <Row className="mb-3"><Col md={6}><Form.Label>Date of Birth</Form.Label>
                <Form.Control type="date" name="dob" className="register2" value={formData.dob} onChange={handleChange} /></Col><Col md={6}><Form.Label>Nationality</Form.Label>
                <Form.Control type="text" name="nationality" className="register2" value={formData.nationality} onChange={handleChange} /></Col></Row>
                  <Row className="mb-3"><Col md={6}><Form.Label>Street Number</Form.Label>
                  <Form.Control type="text" name="streetNumber" className="register2" value={formData.streetNumber} onChange={handleChange} /></Col><Col md={6}><Form.Label>City</Form.Label>
                  <Form.Control type="text" name="city" className="register2" value={formData.city} onChange={handleChange} /></Col></Row>

                  <Row className="mb-3"><Col md={6}><Form.Label>Zipcode</Form.Label>
                  <Form.Control type="text" name="zipcode" className="register2" value={formData.zipcode} onChange={handleChange} /></Col>
                  <Col md={6}><Form.Label>Country</Form.Label>
                  <Form.Control type="text" name="country" className="register2" value={formData.country} onChange={handleChange} /></Col></Row>
                  
                  <Form.Group className="mb-3">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Form.Label>Profile Summary</Form.Label>
                      <Button
                        className="mb-1"
                        disabled={loading}
                        onClick={() => setShowModal(true)}
                        style={{ background: "#156ad7", borderRadius: "3px" }}
                      >
                       {loading ? (
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <Spinner animation="border" size="sm" className="me-2" /> Generating...
                          </span>
                        ) : (
                          "Generate with AI"
                        )}
                      </Button>
                    </div>
                    <ReactQuill 
                      theme="snow"
                      value={formData.profile}
                      onChange={(value) => setFormData({ ...formData, profile: value })}
                    />
                  </Form.Group>

                  <hr className="my-1" style={{ borderColor: '#ccc' }} />

                  <h2 className="mb-3">Education</h2>
                  <Row className="mb-3">
                    <Col md={6}>
                        <Form.Control className="register2" type="text" name="education" value={formData.education} onChange={handleChange} placeholder="Enter your highest level of education" />
                    </Col>
                    <Col md={6}>
                        <Form.Control className="register2" type="text" name="program" value={formData.program} onChange={handleChange} placeholder="Bachelor of Science in..." />
                    </Col>
                  </Row>


                  <h2 className="mb-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Work Experience
                    <div>
                      {workExperienceVisible ? (
                        <FaChevronUp style={{ cursor: "pointer" }} onClick={toggleWorkExperience} />
                      ) : (
                        <FaChevronDown style={{ cursor: "pointer" }} onClick={toggleWorkExperience} />
                      )}
                    </div>
                  </h2>

                  {workExperienceVisible && (
                    <>
                      {workExperiences.map((exp, index) => (
                        <div key={index} className="mb-4 p-3 border rounded position-relative">
                          <div>
                            {index > 0 && (
                              <Button
                                variant="outline-danger"
                                className="position-absolute top-0 end-0 mt-1 me-1 border-0"
                                style={{ fontSize: "14px" }}
                                onClick={() => deleteWorkExperience(index)}
                              >
                                <FaTrash />
                              </Button>
                            )}
                          </div>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Label>Company Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={exp.companyName}
                                onChange={(e) => handleWorkExperienceChange(index, "companyName", e.target.value)}
                                placeholder="Enter company name"
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Label>Job Title</Form.Label>
                              <Form.Control
                                type="text"
                                value={exp.jobTitle}
                                onChange={(e) => handleWorkExperienceChange(index, "jobTitle", e.target.value)}
                                placeholder="Enter job title"
                              />
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Label>City</Form.Label>
                              <Form.Control
                                type="text"
                                value={exp.workCity}
                                onChange={(e) => handleWorkExperienceChange(index, "workCity", e.target.value)}
                                placeholder="Enter city"
                              />
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <ReactQuill
                              theme="snow"
                              value={exp.workExperience}
                              onChange={(value) => handleWorkExperienceChange(index, "workExperience", value)}
                            />
                          <Button
                            className="mt-1"
                            disabled={loadingStates[index]}
                            style={{ background: "#156ad7", borderRadius: "3px" }}
                            onClick={() => generateDescription(index, exp.jobTitle)}
                          >
                              {loadingStates[index] ? (
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                  <Spinner animation="border" size="sm" className="me-2" /> Generating...
                                </span>
                              ) : (
                                "Generate with AI"
                              )}
                          </Button>
                          </Form.Group>
                        </div>
                      ))}
                      
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button 
                          variant="outline-primary" 
                          className="mb-2" 
                          onClick={addWorkExperience} 
                          style={{ display: "flex", alignItems: "center", width: "50%", justifyContent: "center" }}
                        >
                          <FaPlus className="me-2" style={{ cursor: "pointer" }} /> Add Work Experience
                        </Button>
                      </div>
                    </>
                  )}
                      <hr className="my-1" style={{ borderColor: '#ccc' }} />
                      <Row className="mb-3 mt-2">
                        <Col md={12}>
                          <h2 className="mb-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            Skills
                            <div>
                              {skillsVisible ? (
                                <FaChevronUp style={{ cursor: "pointer" }} onClick={toggleSkills} />
                              ) : (
                                <FaChevronDown style={{ cursor: "pointer" }} onClick={toggleSkills} />
                              )}
                            </div>
                          </h2>

                          {skillsVisible && (
                            <>
                              <Row>
                                {formData.skills.map((skill, index) => (
                                  <Col md={4} key={index} className="mb-2"> {/* 4 columns = 3 per row */}
                                    <div className="d-flex align-items-center">
                                      <Form.Control
                                        className="register2"
                                        type="text"
                                        placeholder="Enter skill"
                                        value={skill}
                                        onChange={(e) => handleSkillChange(index, e.target.value)}
                                        style={{ width: "calc(100% - 40px)" }} 
                                      />
                                      <FaTrash
                                        style={{ color: "red", cursor: "pointer", marginLeft: "10px" }}
                                        onClick={() => handleRemoveSkill(index)}
                                      />
                                    </div>
                                  </Col>
                                ))}
                              </Row>

                              {formData.skills.length === 0 && (
                                <Row>
                                  <Col md={4}>
                                    <div className="d-flex align-items-center mt-2">
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter skill"
                                        value={formData.skills[0] || ""}
                                        onChange={(e) => handleSkillChange(0, e.target.value)}
                                        style={{ width: "calc(100% - 40px)" }}
                                      />
                                      <FaPlus
                                        style={{ color: "blue", cursor: "pointer", marginLeft: "10px" }}
                                        onClick={handleAddSkill}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              )}

                              <div style={{ display: "flex", justifyContent: "center" }}>
                                <Button
                                  variant="outline-primary"
                                  className="mt-3"
                                  onClick={handleAddSkill}
                                  style={{ display: "flex", alignItems: "center", width: "50%", justifyContent: "center" }}
                                >
                                  <FaPlus className="me-2" style={{ cursor: "pointer" }} /> Add Skill
                                </Button>
                              </div>
                            </>
                          )}
                        </Col>
                      </Row>

                    {/* <Button variant="secondary" className="w-100 mt-3" onClick={() => alert("Add custom field functionality is not implemented yet.")}>Add Custom Field</Button> */}
              </Card>

          </Col>
  {/* Resume Preview Section - Render only if there's input */}
  {(formData.firstName || formData.lastName || formData.phone || formData.email || 
    formData.address || formData.city || formData.country || formData.profile ||
    formData.workExperience || formData.education || formData.skills.some(skill => skill.trim() !== "")
  ) && (
    <>
    <Col lg={6} className="ml-3" ref={pdfRef}>
      <Card className="shadow-sm p-4 pt-5 border-0">
        <div className="d-flex mb-4" style={{ flexWrap: "wrap", paddingLeft: '15px' }}>
          {profileImage ? (
            <div className="profile-image-container" 
              style={{ 
                width: "150px", height: "150px", marginRight: "20px", display: "flex", flexShrink: 0, 
                justifyContent: "center", alignItems: "center", border: "2px solid #ccc", 
                borderRadius: "50%", overflow: "hidden" 
              }}
            >
              <img
                src={profileImage}
                alt="Profile"
                style={{ 
                  width: "100%", height: "100%", objectFit: "cover", 
                  borderRadius: "50%", display: "block"
                }}
              />
            </div>
          ) : (
            <div className="profile-image-container" 
              style={{ 
                width: "150px", height: "150px", marginRight: "20px", display: "flex", flexShrink: 0, 
                justifyContent: "center", alignItems: "center", border: "2px solid #ccc", 
                borderRadius: "50%", overflow: "hidden" 
              }}
            >
                            <img
                    src={profilePicture}
                    alt="Profile"
                    style={{ 
                      width: "100%", height: "100%", objectFit: "cover", 
                      borderRadius: "50%", display: "block" 
                    }}
                    crossOrigin="anonymous"
                  />
            </div>
          )}
          
          <div style={{ maxWidth: "100%", wordWrap: "break-word", overflowWrap: "break-word", flexGrow: 1, textAlign: 'left'}}>
            <h5 className="fw-bold" style={{ fontSize: '40px', textAlign: 'left' }}>
              {formData.firstName} {formData.lastName}
            </h5>
            <div className="d-flex flex-column mt-2">
              {formData.phone && <p className="text-muted mb-1" style={{fontSize: '17px'}}><strong>Phone:</strong> {formData.phone}</p>}
              {formData.email && <p className="text-muted mb-1" style={{fontSize: '17px'}}><strong>Email:</strong> {formData.email}</p>}
              {(formData.streetNumber || formData.city || formData.country) && (
                <p className="text-muted mb-1" style={{fontSize: '17px'}}>
                  <strong>Address:</strong> {formData.streetNumber}, {formData.city}, {formData.zipcode}, {formData.country}
                </p>
              )}
              {formData.dob && <p className="text-muted mb-1" style={{fontSize: '17px'}}><strong>Date of Birth:</strong> {formatDate(formData.dob)}</p>}
              {formData.nationality && <p className="text-muted mb-1" style={{fontSize: '17px'}}><strong>Nationality:</strong> {formData.nationality}</p>}
            </div>
          </div>
        </div>
        
        <div style={{paddingLeft: '50px', paddingRight: '40px'}}>
        {(formData.profile || formData.workExperience || formData.education || formData.skills.some(skill => skill.trim() !== "")) && <hr className="my-4" style={{ borderColor: '#ccc', border: '1px solid' }} />}
        <style> {`
                  .icon-circle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    background-color: #3f3f3f;
                    border-radius: 50%;
                    margin-right: 7px
                  }
                  
                  .icon {
                    color: white; /* Adjust icon color */
                    font-size: 12px;
                  }
                  `}
        </style>
        {formData.profile && (
          <div className="mt-4">
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="icon-circle">
              <FontAwesomeIcon icon={faUser} className="icon" />
            </div>
              <h4 style={{ textAlign: 'left', color: '#5794ef', margin: 0}}>Profile Summary</h4>
            </div>
            <div className="mt-2" style={{ textAlign: 'left', paddingLeft: '30px'}} dangerouslySetInnerHTML={{ __html: formData.profile }} />
          </div>
        )}

  {workExperiences.length > 0 && (
    <div className="mt-4">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="icon-circle">
          <FontAwesomeIcon icon={faBriefcase} className="icon" />
        </div>
        <h4 style={{ textAlign: 'left', color: '#5794ef', margin: 0 }}>Work Experience</h4>
      </div>

      {workExperiences.map((exp, index) => (
        (exp.companyName || exp.jobTitle || exp.workCity || exp.workExperience) && (
          <div key={index} className="mt-3">
            <div style={{ display: 'flex', paddingLeft: '15px' }} className="mt-2">
              {exp.jobTitle && <p style={{ textAlign: 'left', marginBottom: '0', fontSize: '20px' }}>• <strong>{exp.jobTitle}</strong></p>}
              {exp.workCity && <p className="ms-2" style={{ textAlign: 'left', marginBottom: '0', marginTop: '5px'}}> • {exp.workCity}</p>}
            </div>
            {exp.companyName && <p style={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '0', paddingLeft: '30px' }}>{exp.companyName}</p>}
            {exp.workExperience && (
              <div className="mt-2">
                <div style={{ textAlign: 'left', paddingLeft: '30px' }} dangerouslySetInnerHTML={{ __html: exp.workExperience }} />
              </div>
            )}
          </div>
        )
      ))}
    </div>
  )}


        {formData.education && (
          <>
            <hr className="my-4" style={{ borderColor: '#ccc', border: '1px solid'  }} />
            <div className="mt-4">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="icon-circle">
                <FontAwesomeIcon icon={faGraduationCap} className="icon" />
              </div>
                <h4 style={{ textAlign: 'left', color: '#5794ef', margin: 0 }}>Education</h4>
            </div>
              <div className="mt-2" style={{ paddingLeft: '15px' }}>
                {formData.education && <p style={{ textAlign: 'left', marginBottom: '0', fontSize: '20px' }}><strong> • {formData.education}</strong></p>}
                {formData.program && <p style={{ textAlign: 'left', fontWeight: '400', marginBottom: '0', paddingLeft: '30px' }}>{formData.program}</p>}
              </div>
            </div>
          </>
        )}

        {formData.skills.some(skill => skill.trim() !== "") && (
          <>
            <hr className="my-4" style={{ borderColor: '#ccc', border: '1px solid' }} />
            <div className="mt-4">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="icon-circle">
                  <FontAwesomeIcon icon={faTools} className="icon" />
                </div>
                <h4 style={{ textAlign: 'left', color: '#5794ef', margin: 0 }}>Skills</h4>
              </div>
              <div className="mt-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', paddingLeft: '20px', textAlign: 'left' }}>
                {formData.skills.filter(skill => skill.trim() !== "").map((skill, index) => (
                  <div key={index} className="text-muted" style={{ padding: '5px', background: '#f8f9fa', borderRadius: '5px' }}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        </div>
      </Card>
    </Col>
    
    </>
  )}
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>What job are you applying for?</Modal.Title>
          </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
              Complete at least your work experience or education sections. Your profile
              section will be generated based on the information included in the rest of your resume.
          </p>
              <Form.Control 
                type="text" 
                name="jobTitle" 
                className="register2" 
                placeholder="Enter job title" 
                value={formData.jobTitle} 
                onChange={(e) => {
                  handleChange(e);
                  setError(""); 
                }} 
                required
              />
              {error && <p style={{ color: "red", fontSize: "15px", marginBottom: '0', marginLeft: '6px', marginTop: '6px' }}>{error}</p>}
        </Modal.Body>
        <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button style={{
                                    height: "40px",
                                    fontSize: "12px",
                                    borderRadius: "3px",
                                    width: "75px",
                                    color: "#156ad7",
                                    background: "#bce0ff",
                                    border: "none",
                                    fontWeight: "700",
                                    marginLeft: '10px'
                                }} onClick={() => {setShowModal(false), setError(""); }}>
              Cancel
            </Button>
            <Button style={{ background: "#156ad7", borderRadius: "3px" }} onClick={handleGenerate}
              disabled={loading}
            >
            {loading ? "Generating..." : "Generate with AI"}
            </Button>
        </Modal.Footer>
      </Modal>
      </>
    )}

    </>
  );
}
