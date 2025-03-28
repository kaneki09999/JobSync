import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Row, Col, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileLines, faDownload, faEllipsisV, faTrashAlt, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { FaArrowLeft } from 'react-icons/fa';
import { postToEndpoint, getFromEndpoint } from '../../../components/apiService';
import { useAuth } from '../../../AuthContext';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Personal() {
  const [profileImage, setProfileImage] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const fileInputRef = useRef(null);
  const cvInputRef = useRef(null);
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [birthday, setBirthday] = useState('');
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [lastname, setLastname] = useState('');
  const [suffix, setSuffix] = useState('');
  const [contact, setContact] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [headline, setHeadline] = useState('');
  const [nationality, setNationality] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const [resume, setResume] = useState([]); 
  const [cvName, setCvName] = useState(''); 
  const [isFileUploaded, setIsFileUploaded] = useState(false); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [profilePictureChanged, setProfilePictureChanged] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleRouteChange = () => {
      setShowDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    setCvFile(file);
    setIsFileUploaded(true);
  };

  const triggerFileInput = () => {
    if (cvInputRef.current) {
      cvInputRef.current.click();
    }
  };

  const handleCvNameChange = (e) => {
    setCvName(e.target.value);
  };

  const handleModalSubmit = () => {
    if (cvName && isFileUploaded) {
      setShowModal(false); 
    }
  };
  useEffect(() => {
    const fetchResumeBuild = async () => {
      try {
        const response = await postToEndpoint("/getResumeBuild.php", { applicant_id: user?.id });
        if (response.data.applicant) {
          setResume(response.data.applicant);
        } else {
          setResume(null); 
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };
    if (user?.id) {
      fetchResumeBuild();
    }
  }, [user?.id]);
  
  useEffect(() => {
    const fetchApplicantInfo = async () => {
      if (user?.id) {
        try {
          const response = await postToEndpoint('/getApplicantinfo.php', { applicant_id: user.id });
          if (response.data) {
            const { profile, firstname, middlename, lastname, suffix, experience, education, gender, marital_status, contact, birthplace, headline, birthday, nationality } = response.data;
  
            setProfile(profile || null);
            setFirstname(firstname || '');
            setMiddlename(middlename || '');
            setLastname(lastname || '');
            setSuffix(suffix || '');
            setExperience(experience || '');
            setEducation(education || '');
            setGender(gender || '');
            setMaritalStatus(marital_status || '');
            setContact(contact || '');
            setBirthplace(birthplace || '');
            setHeadline(headline || '');
            setBirthday(birthday || '');
            setNationality(nationality || '');
            setInitialValues({
              firstname,
              middlename,
              lastname,
              suffix,
              experience,
              education,
              gender,
              maritalStatus: marital_status,
              contact,
              birthplace,
              headline,
              birthday,
              nationality
            });
          }
        } catch (error) {
          console.error('Error fetching applicant info:', error);
        }
      }
    };
    fetchApplicantInfo();
    const intervalId = setInterval(fetchApplicantInfo, 500000);
    return () => clearInterval(intervalId);
  }, [user]);
  

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfilePictureChanged(true);
    }
  };

  const isFormChanged = () => {
    return (
      initialValues.firstname !== firstname ||
      initialValues.middlename !== middlename ||
      initialValues.lastname !== lastname ||
      initialValues.suffix !== suffix ||
      initialValues.experience !== experience ||
      initialValues.education !== education ||
      initialValues.gender !== gender ||
      initialValues.maritalStatus !== maritalStatus ||
      initialValues.contact !== contact ||
      initialValues.birthplace !== birthplace ||
      initialValues.headline !== headline ||
      initialValues.birthday !== birthday ||
      initialValues.nationality !== nationality ||
      profilePictureChanged 
    );
  };

  const handleButtonClick = () => fileInputRef.current.click();
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let newErrors = {};
  
    if (!String(firstname).trim()) newErrors.firstname = "First name is required.";
    if (!String(lastname).trim()) newErrors.lastname = "Last name is required.";
    if (!String(contact).trim()) newErrors.contact = "Contact number is required.";
    if (!String(experience).trim()) newErrors.experience = "Experience is required.";
    if (!String(education).trim()) newErrors.education = "Education is required.";
    if (!String(gender).trim()) newErrors.gender = "Gender is required.";
    if (!String(maritalStatus).trim()) newErrors.maritalStatus = "Marital status is required.";
    if (!String(birthday).trim()) newErrors.birthday = "Date of birth is required.";
    if (!String(birthplace).trim()) newErrors.birthplace = "Place of birth is required.";
    if (!String(nationality).trim()) newErrors.nationality = "Nationality is required.";
    if (!String(headline).trim()) newErrors.headline = "Headline is required.";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  

  const handleSaveChanges = async () => {
    if (validateForm()) {
        if (!user?.id) return;
      
        let profilePictureBase64 = null;
      
        if (profileImage) {
          if (profileImage instanceof File) {
            const reader = new FileReader();
            reader.onload = () => {
              profilePictureBase64 = reader.result.split(',')[1];
              sendPayload(profilePictureBase64); 
            };
            reader.readAsDataURL(profileImage);
            return; 
          } else {
            profilePictureBase64 = profileImage.split(',')[1]; 
          }
        } else if (profileUrl) {
          profilePictureBase64 = null; 
        }
      
        sendPayload(profilePictureBase64);
    }
  };
  const handleInputChange = (e, setter, fieldName) => {
    setter(e.target.value);
    
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (String(e.target.value).trim()) {
        delete newErrors[fieldName];
      }
      return newErrors;
    });
  };
  
  
  
  const sendPayload = async (profilePictureBase64) => {
    const payload = {
      applicant_id: user.id,
      firstname,
      middlename,
      lastname,
      suffix,
      gender,
      contact,
      headline,
      birthday,
      birthplace,
      marital_status: maritalStatus,
      experience,
      education,
      nationality,
      profile_picture: profilePictureBase64,
    };
  
    try {
      const response = await postToEndpoint('/updateApplicantInfo.php', payload);
      if (response?.data?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data?.message || 'Something went wrong.',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred',
        text: 'An error occurred while saving changes.',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    }
  };

  const handleModalSubmitmodal = async () => {
    if (!cvName || !cvFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Please provide a CV name and select a file to upload.',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('applicant_id', user.id);
    formData.append('cv_name', cvName);
    formData.append('file', cvFile);
  
    try {
      const response = await postToEndpoint('/InsertResume.php', formData, {
        'Content-Type': 'multipart/form-data',
      });
  
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        handleModalClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: response.data.message,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'An error occurred while uploading the CV.',
        confirmButtonText: 'OK',
      });
    }
  };

  const [cvDetails, setCvDetails] = useState(null);
  
  useEffect(() => {
    let intervalId;
    const fetchResume = async () => {
      try {
        if (user && user.id) {
          const response = await getFromEndpoint(`/FetchResume.php?applicant_id=${user.id}`);
    
          if (response.data.success) {
            setCvDetails(response.data.data);
          } else {
            console.log('No resumes found for this applicant.');
          }
        } else {
          console.log('User ID is missing.');
        }
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };
    if (user && user.id) {
      fetchResume();
      intervalId = setInterval(fetchResume, 20000); 
    }
    return () => {
      clearInterval(intervalId); 
    };
  }, [user]);


  const handleSetPrimary = async (resume_id) => {
    try {
      const response = await postToEndpoint('/setPrimaryCv.php', {
        resume_id,
      });
      if (response.data.success) {
        console.log('Primary CV updated successfully!');
      } else {
        console.log('Failed to update Primary CV.');
      }
    } catch (error) {
      console.error('Error updating Primary CV:', error);
      console.log('An error occurred while updating Primary CV.');
    }
  };

  const profileUrl = profileImage ? (typeof profileImage === 'string' ? profileImage : URL.createObjectURL(profileImage)) : profile;

  return (
    <Container fluid="md" className="pb-5" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
  <Form>
    <h4 style={{ marginBottom: '50px', fontSize: '28px', textAlign: 'left' }}>Basic Information</h4>

    {/* Profile Picture and Basic Info Fields */}
    <Row className="gy-3 profile-container mb-4">
  <Col xs={12} md={3} className="text-center">
    <div
      className="p-3 rounded"
      style={{ border: '1px solid #ccc', width: '245px', margin: '0 auto 15px auto' }}
    >
      <div className="mb-2">Profile Picture</div>
      <div
        className="profile-image-container"
        style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
          marginLeft: '16px',
        }}
      >
        {profileUrl ? (
          <img
            src={profileUrl}
            alt="Profile Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span>No Image Uploaded</span>
        )}
      </div>
      <Button variant="outline-primary" className="mt-2" style={{ marginLeft: '5px' }} onClick={handleButtonClick}>
        Browse photo
      </Button>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
    </div>
  </Col>
  
  <Col xs={12} md={9}>
    <Row style={{ marginBottom: '16px' }}>
      <Col xs={12} md={6}>
        <Form.Label style={{ display: 'block', textAlign: 'left', fontWeight: '500' }}>Title/Headline</Form.Label>
        <Form.Control
          className="register1"
          placeholder="Ex. Web Developer..."
          value={headline}
          onChange={(e) => handleInputChange(e, setHeadline, "headline")}
          isInvalid={!!errors.headline}
        />
        <Form.Control.Feedback type="invalid">{errors.headline}</Form.Control.Feedback>
      </Col>
    </Row>
    <hr />
    <Row className="gy-3">
      {/* Align fields in 2 or 3 columns depending on screen size */}
      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>First Name</Form.Label>
        <Form.Control
          className="register1"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => handleInputChange(e, setFirstname, "firstname")}
          isInvalid={!!errors.firstname}
        />
        <Form.Control.Feedback type="invalid">{errors.firstname}</Form.Control.Feedback>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>Middle Name <span className='text-muted'>(Optional)</span></Form.Label>
        <Form.Control
          className="register1"
          placeholder="Middle Name"
          value={middlename}
          onChange={(e) => setMiddlename(e.target.value)}
        />
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>Last Name</Form.Label>
        <Form.Control
          className="register1"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => handleInputChange(e, setLastname, "lastname")}
          isInvalid={!!errors.lastname}
        />
        <Form.Control.Feedback type="invalid">{errors.lastname}</Form.Control.Feedback>
      </Col>
      <Col xs={12} sm={6} md={4}>
  <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>
    Suffix <span className='text-muted'>(Optional)</span>
  </Form.Label>
  <Form.Select
    className="register1"
    value={suffix}
    onChange={(e) => setSuffix(e.target.value)}
  >
    <option value="">Select Suffix</option>
    <option value="Jr.">Jr.</option>
    <option value="Sr.">Sr.</option>
    <option value="II">II</option>
    <option value="III">III</option>
    <option value="IV">IV</option>
    <option value="PhD">PhD</option>
    <option value="MD">MD</option>
    {/* Add more options as needed */}
  </Form.Select>
</Col>
      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>Contact Number</Form.Label>
        <Form.Control
          className="register1"
          placeholder="Contact Number"
          value={contact}
          onChange={(e) => handleInputChange(e, setContact, "contact")}
          isInvalid={!!errors.contact}
        />
        <Form.Control.Feedback type="invalid">{errors.contact}</Form.Control.Feedback>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>Experience</Form.Label>
        <Form.Select
          className="register"
          value={experience}
          onChange={(e) => handleInputChange(e, setExperience, "experience")}
          isInvalid={!!errors.experience}
        >
          <option value="" disabled>Experience</option>
          <option value="Intern">Internship</option>
          <option value="Entry level">Entry Level (0-2 years)</option>
          <option value="Mid level">Mid Level (2-5 years)</option>
          <option value="Senior level">Senior Level (5-10 years)</option>
          <option value="Expert level">Expert Level (10+ years)</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.experience}</Form.Control.Feedback>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>Educational Attainment</Form.Label>
        <Form.Select
          className="register"
          value={education}
          onChange={(e) => handleInputChange(e, setEducation, "education")}
          isInvalid={!!errors.education}
        >
          <option value="" disabled>Education</option>
          <option value="High School Diploma">High School Diploma</option>
          <option value="Associate Degree">Associate Degree</option>
          <option value="Bachelor's Degree">Bachelor's Degree</option>
          <option value="Master's Degree">Master's Degree</option>
          <option value="doctorate">Doctorate (PhD, EdD, etc.)</option>
          <option value="professional">Professional Certification</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.education}</Form.Control.Feedback>
      </Col>

      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>Gender</Form.Label>
        <Form.Select
          className="register"
          value={gender}
          onChange={(e) => handleInputChange(e, setGender, "gender")}
          isInvalid={!!errors.gender}
        >
          <option value="" disabled>Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>Marital Status</Form.Label>
        <Form.Select
          className="register"
          value={maritalStatus}
          onChange={(e) => handleInputChange(e, setMaritalStatus, "maritalStatus")}
          isInvalid={!!errors.maritalStatus}
        >
          <option value="" disabled>Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
          <option value="Separated">Separated</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.maritalStatus}</Form.Control.Feedback>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>Date of Birth</Form.Label>
        <div className="d-flex align-items-center">
          <Form.Control
            type="date"
            className="register1"
            value={birthday}
            onChange={(e) => handleInputChange(e, setBirthday, "birthday")}
            isInvalid={!!errors.birthday}
          />
        </div>
        <Form.Control.Feedback type="invalid">{errors.birthday}</Form.Control.Feedback>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>Place of Birth</Form.Label>
        <Form.Control
          className="register1"
          placeholder="Place of Birth"
          value={birthplace}
          onChange={(e) => handleInputChange(e, setBirthplace, "birthplace")}
          isInvalid={!!errors.birthplace}
        />
        <Form.Control.Feedback type="invalid">{errors.birthplace}</Form.Control.Feedback>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Form.Label style={{ display: 'block', textAlign: 'left', marginBottom: '10px' }}>Nationality</Form.Label>
        <Form.Select
          className="register"
          value={nationality}
          onChange={(e) => handleInputChange(e, setNationality, "nationality")}
          isInvalid={!!errors.nationality}
          >
          <option value="" disabled>Select your nationality</option>
              {/* Africa */}
              <optgroup label="Africa">
                <option value="Afghan">Afghan</option>
                <option value="Algerian">Algerian</option>
                <option value="Angolan">Angolan</option>
                <option value="Beninese">Beninese</option>
                <option value="Burundian">Burundian</option>
                <option value="Cameroonian">Cameroonian</option>
                <option value="Congolese">Congolese</option>
                <option value="Egyptian">Egyptian</option>
              </optgroup>
              {/* Asia */}
              <optgroup label="Asia">
                <option value="Afghan">Afghan</option>
                <option value="Armenian">Armenian</option>
                <option value="Azerbaijani">Azerbaijani</option>
                <option value="Bahraini">Bahraini</option>
                <option value="Bangladeshi">Bangladeshi</option>
                <option value="Bhutanese">Bhutanese</option>
                <option value="Bruneian">Bruneian</option>
                <option value="Cambodian">Cambodian</option>
                <option value="Chinese">Chinese</option>
                <option value="Filipino">Filipino</option>
                <option value="Georgian">Georgian</option>
                <option value="Indian">Indian</option>
                <option value="Indonesian">Indonesian</option>
                <option value="Iranian">Iranian</option>
                <option value="Iraqi">Iraqi</option>
                <option value="Israeli">Israeli</option>
                <option value="Japanese">Japanese</option>

              </optgroup>
              {/* Europe */}
              <optgroup label="Europe">
                <option value="Albanian">Albanian</option>
                <option value="Andorran">Andorran</option>
                <option value="Austrian">Austrian</option>
                <option value="Belarusian">Belarusian</option>
                <option value="Belgian">Belgian</option>
                <option value="Bosnian">Bosnian</option>
                <option value="Bulgarian">Bulgarian</option>
                <option value="Croatian">Croatian</option>

              </optgroup>
              {/* Americas */}
              <optgroup label="Americas">
                <option value="American">American</option>
                <option value="Argentine">Argentine</option>
                <option value="Barbadian">Barbadian</option>
                <option value="Belizean">Belizean</option>
              </optgroup>
              {/* Oceania */}
              <optgroup label="Oceania">
                <option value="Australian">Australian</option>
                <option value="Fijian">Fijian</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Marshallese">Marshallese</option>
              </optgroup>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.nationality}</Form.Control.Feedback>
          </Col>
          
        </Row>
      </Col>
    </Row>
          <style>{`
          /* Default styles for larger screens (desktops and tablets) */
          .profile-container {
            margin-bottom: 20px;
          }
          
          .profile-container .text-center {
            text-align: center;
          }
          
          .profile-image-container {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            overflow: hidden;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
          }
          
          /* Form fields */
          .form-label {
            text-align: left;
            font-weight: 500;
          }
          
          .form-control,
          .form-select {
            width: 100%;
          }
          
          @media (max-width: 1200px) {
            .profile-container {
              flex-direction: column;
              align-items: center;
            }
          
            .profile-image-container {
              width: 150px;
              height: 150px;
            }
          
            /* Adjusting columns on large screens */
            .register1 {
              width: 100%;
            }
          
            .gy-3 > .col-md-4 {
              margin-bottom: 16px;
            }
          
            .gy-3 .col-md-6 {
              margin-bottom: 16px;
            }
          }
          
          @media (max-width: 992px) {
            .resumes {
                width: 70% !important;
            }
            .profile-container {
              text-align: center;
            }
            
            .profile-image-container {
              width: 140px;
              height: 140px;
            }
          
            .gy-3 > .col-md-4 {
              margin-bottom: 12px;
              flex-basis: 100%;
            }
          
            .gy-3 > .col-md-6 {
              margin-bottom: 12px;
              flex-basis: 100%;
            }
          
            .form-label {
              font-size: 14px;
            }
          
            .form-control,
            .form-select {
              font-size: 14px;
            }
          }
          
          @media (max-width: 768px) {
            .btn-save {
              width: 100% !important;
            }
            .resumes {
              width: 100% !important;
          }
            .profile-container {
              padding: 0;
              text-align: center;
            }
            .col-md-3 {
              width: 100%;
            }
            .profile-image-container {
              width: 120px;
              height: 120px;
            }
          
            .gy-3 > .col-md-4 {
              margin-bottom: 10px;
              flex-basis: 100%;
            }
          
            .form-label {
              font-size: 12px;
            }
          
            .form-control,
            .form-select {
              font-size: 12px;
            }
          
            /* Adjusting buttons */
            .btn {
              font-size: 14px;
              padding: 8px 12px;
            }
          
            /* Making the image button more accessible on mobile */
            .btn + input[type="file"] {
              display: block;
              margin-top: 10px;
              width: 100%;
            }
          }
          
          @media (max-width: 576px) {
            /* Adjusting layout on small mobile screens */
            .profile-image-container {
              width: 100px;
              height: 100px;
            }
          
            .gy-3 > .col-md-4 {
              margin-bottom: 8px;
              flex-basis: 100%;
            }
          
            .form-control,
            .form-select {
              font-size: 12px;
            }
          
            .form-label {
              font-size: 12px;
            }
          }
          
          `}</style>
        <hr />
     <Row className="gy-3 profile-container">
        {/* CV Uploaded Section */}
        <Form.Label
          style={{
            display: 'block',
            textAlign: 'left',
            marginBottom: '8px',
            fontWeight: '500',
            fontSize: '18px',
          }}
        >
          Your Cv/Resume
        </Form.Label>
        {cvDetails && cvDetails.length > 0 && (
  cvDetails.map((cv, index) => (
<Col 
  md={4} 
  className="d-flex flex-column resumes" 
  key={cv.resume_id || index}
>
  <div
    style={{
      border: '1px solid #ccc',
      padding: '20px',
      borderRadius: '8px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%',
      height: '90px',
      marginBottom: '10px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', flexDirection: 'row', position: 'relative', top: '15px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: '8px',
          position: 'relative',
          width: '40px',
          height: '40px',
          borderRadius: '4px',
          marginTop: '5px',
        }}
      >
        <FontAwesomeIcon icon={faFileLines} size="xl" style={{ color: '#47a0ff', width: '25px', height: '29px' }} />
      </div>
      <span
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 'calc(100% - 100px)',
          cursor: 'default'
        }}
      >
        {cv.resumeName}
      </span>
      {cv.primaryCv === 1 && (
        <FontAwesomeIcon 
            icon={faThumbtack} 
            size="lg" 
            style={{ 
              color: '#0e61cc', 
              position: 'absolute', 
              right: '-24px', 
              top: '-23px', 
              transform: 'rotate(25deg)',
              fontSize: '23px',
              filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.7))'  
            }} 
          />
      )}
    </div>
    <div className="dropdown" style={{ position: "relative", alignSelf: "flex-end", top: "-10px" }}>
    <button
      type="button"
      className="btn btn-light"
      id="dropdownMenuButton"
      onClick={() => setShowDropdown(!showDropdown)}
      style={{
        border: "none",
        background: "transparent",
        padding: "0",
        cursor: "pointer",
      }}
    >
      <FontAwesomeIcon icon={faEllipsisV} size="lg" style={{ color: "gray", width: "20px" }} />
    </button>

    {showDropdown && (
      <div className="dropdown-menu show" style={{ display: "block", minWidth: "150px", position: "absolute", right: "0" }}>
        <ul className="list-unstyled mb-0">
        <li>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center"
            onClick={() => {
              handleSetPrimary(cv.resume_id);
              setShowDropdown(false); 
            }}
            style={{
              fontWeight: '500',
              fontSize: '14px',
              color: '#0955b7'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#cfe7ff';
              e.target.style.color = '#0955b7';
              e.target.style.fontWeight = '500';
              e.target.style.fontSize = '14px';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#212529';
              e.target.style.borderRadius = '0';
            }}
          >
            <FontAwesomeIcon
              style={{ color: '#0955b7' }}
              icon={faFileLines}
              className="me-2"
            />
            Set as Primary
          </button>
        </li>
        <li>
          <button
            className="dropdown-item d-flex align-items-center text-danger"
            onClick={() => {
              handleDeleteResume(cv.resume_id);
              setShowDropdown(false); 
            }}
            style={{
              fontWeight: '500',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#cfe7ff';
              e.target.style.color = '#0955b7';
              e.target.style.fontWeight = '500';
              e.target.style.fontSize = '14px';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#212529';
              e.target.style.borderRadius = '0';
            }}
          >
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="me-2"
            />
            Delete
          </button>
        </li>
        </ul>
      </div>
    )}
  </div>
    <a href={`src/api/${cv.resumePath}`} target="_blank" rel="noopener noreferrer" style={{ position: 'relative', left: '50px', top: '-20px' }}>
      <FontAwesomeIcon icon={faDownload} size="lg" style={{ color: '#0955b7', marginRight: '10px', width: '13px' }} />
      <small style={{ fontWeight: '400', color: '#0955b7' }}>Download Cv/Resume</small>
    </a>
  </div>
</Col>

  ))
)}

        <Col md={4} className='resumes'>
            <div
              style={{
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '8px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '8px',
                }}

              >
                <div
                  onClick={handleModalShow}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    border: '1px solid #007bff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '5px',
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} size="lg" style={{ color: '#007bff' }} />
                </div>
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#000',
                    marginTop: '-10px',
                    marginLeft: '10px',
                  }}
                >
                  Add Cv/Resume
                </span>
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#6c757d',
                  marginTop: '-18px',
                  marginLeft: '58px',
                }}
              >
                Browse file. Only pdf
              </div>
            </div>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={12} className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
          {/* Save Changes Button */}
          <Button
            variant="primary"
            className="mt-3 mb-3 mb-md-0"
            style={{
              minWidth: '20%',
              height: '55px',
              color: '#0d6efd',
              background: 'transparent',
            }}
            onClick={() => {
              if (resume && Object.keys(resume).length > 0) {
                window.location.href = "/resume-builder";
              } else {
                window.location.href = "/create-resume";
              }
            }}
          >
            <FontAwesomeIcon
              style={{ color: '#0955b7', fontSize: '20px' }}
              icon={faFileLines}
              className="me-2"
            />
            {resume && Object.keys(resume).length > 0 ? "Generated Resume" : "Create Resume"}
          </Button>

          {/* Save Changes Button */}
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            disabled={!isFormChanged() || Object.keys(errors).length > 0}
            className="mt-3 btn-save"
            style={{ width: '185px', height: '55px' }}
          >
            Save Changes
          </Button>
        </Col>
      </Row>
      </Form>
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton style={{paddingLeft: '1.5rem', paddingRight: '1.5rem', fontSize: '10px'}}>
          <Modal.Title>Add Cv/Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{paddingLeft: '1.5rem', paddingRight: '1.5rem'}}>
          <Form.Group controlId="cvName" style={{ marginBottom: '20px' }}>
            <Form.Label>Cv/Resume Name</Form.Label>
            <Form.Control
              className='register1'
              type="text"
              value={cvName}
              onChange={handleCvNameChange}
              placeholder="Enter the name for your resume"
            />
          </Form.Group>
          <Form.Label>Upload Cv/Resume</Form.Label>
          {cvFile ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                border: '1px dashed #007bff',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <FontAwesomeIcon
                icon={faFileLines}
                size="lg"
                style={{ color: '#007bff', marginBottom: '10px' }}
              />
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff' }}>
                {cvFile.name}
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                border: '1px dashed #007bff',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <FontAwesomeIcon
                icon={faPlus}
                size="2x"
                style={{ color: '#007bff', cursor: 'pointer' }}
                onClick={triggerFileInput} 
              />
            </div>
          )}

          <input
            type="file"
            accept=".pdf"
            ref={cvInputRef}
            style={{ display: 'none' }} 
            onChange={handleCvUpload}
          />
        </Modal.Body>
        <Modal.Footer style={{paddingLeft: '1.5rem', paddingRight: '1.5rem', justifyContent: 'space-between'}}>
          <Button onClick={handleModalClose} style={{height: '38px', fontSize: '12px', borderRadius: '3px', width: '75px', color: '#156ad7', background: '#bce0ff', border: 'none', fontWeight: '700'}}>
            Close
          </Button>
          <Button
            onClick={handleModalSubmitmodal} 
            disabled={!cvName || !cvFile} 
            style={{width: '120px', height: '38px', fontSize: '12px', borderRadius: '3px', background: '#156ad7', fontWeight: '500'}}
          >
            Add Cv/Resume
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>

    
  );
}
