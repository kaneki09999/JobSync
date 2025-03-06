import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCopy, FaCheck, FaInfoCircle } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { postToEndpoint } from './apiService';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';


const ModalInterview = ({ show, handleClose, application_id, job_id }) => {
  const { user } = useAuth();
  const [randomString, setRandomString] = useState('');
  const [copied, setCopied] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [message, setMessage] = useState(''); 
  const [companyName, setCompanyName] = useState([]);
  const [applicant, setApplicant] = useState([]);
  const [channelname, setChannelName] = useState([]);
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(false);
  const [loading, setLoading] = useState(false); 

  const isFormValid = 
  randomString && 
  date && 
  time && 
  message.trim();

  const isFormValid1 = 
  randomString && 
  date && 
  time;

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const response = await postToEndpoint('/getCompanyName.php', { job_id });
        if (response.data?.companyname) {
          setCompanyName(response.data.companyname);
          
        } else {
          console.error('No company name found or an error occurred:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching companyName:', error);
      }
    };
  
    fetchCompanyName();
  }, [job_id]);

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const response = await postToEndpoint('/getApplicantAppliedDetails.php',{ application_id, job_id });
        if (response.data?.jobs) {
          setApplicant(response.data.jobs);
          
        } else {
          console.error('No applicant found or an error occurred:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching applicant:', error);
      }
    };
  
    fetchApplicant();
  }, [ application_id, job_id ]);

  const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = companyName.company_name ? `${companyName.company_name}-` : '';
    for (let i = 0; i < 30; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setRandomString(result);
    setCopied(false);
  };
  

  const copyToClipboard = () => {
    navigator.clipboard.writeText(randomString).then(
      () => setCopied(true),
      () => setCopied(false)
    );
  };

  const handleSubmit = async () => {
    const formattedDate = date
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
    : '';
    const data = {
      channel_name: randomString, 
      date: formattedDate, 
      time: displayFormattedTime(time), 
      message: message, 
      application_id: application_id, 
      job_id: job_id,
      employer_id: user.id,
      email: applicant[0]?.email || '',
      company_name: companyName.company_name
    };
  
    try {
      Swal.fire({
        title: 'Processing...',
        text: 'Please hold on while we submit your interview schedule.',
        allowOutsideClick: false, 
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await postToEndpoint('/saveInterviewSchedule.php', data);
      Swal.close();
      if (response.status === 201) {
        console.log('Data saved successfully:', response.data);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your interview has been scheduled successfully.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          handleClose(); 
          window.location.reload(); 
      });
      } else {
        console.error('Error saving data:', response.data);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'There was an issue saving the data. Please try again.',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
        confirmButtonText: 'Close',
      });
    }
  };
  const today = new Date();

  const validateTime = (selectedTime) => {
    if (!date) return true; 
    const currentDate = new Date();
    const selectedDate = new Date(date);

    if (
      selectedDate.toDateString() === currentDate.toDateString() &&
      selectedTime < currentDate.toISOString().slice(11, 16)
    ) {
      return false;
    }
    return true;
  };

const convertTo12HourFormat = (time24hr) => {
  let [hours, minutes] = time24hr.split(':');
  hours = parseInt(hours, 10);

  const modifier = hours >= 12 ? 'PM' : 'AM';
  if (hours > 12) hours -= 12;  
  if (hours === 0) hours = 12;  

  return `${hours}:${minutes} ${modifier}`;
};
const handleTimeChange = (e) => {
  const selectedTime = e.target.value;
  if (validateTime(selectedTime)) {
 
    setTime(selectedTime);
  } else {
    alert('Cannot select a past time for today.');
    setTime('');
  }
};

const displayFormattedTime = (time24) => {
  return convertTo12HourFormat(time24); 
};

  const generateMessage = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "AI will generate a suggested interview invitation message using the provided information. Please note that writing a new message will overwrite any previously made text or edits.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#156ad7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      const formattedDate = date
        ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
        : '';
  
      const prompt = `
        Include the following details:
        - Applicant Name: ${applicant[0]?.firstname} ${applicant[0]?.lastname}
        - Company Name: ${companyName.company_name}
        - Interview Channel Name: ${randomString}
        - Interview Date: ${formattedDate}
        - Interview Time: ${displayFormattedTime(time)}
        
        The message should be welcoming and clear, providing all the necessary details for the applicant to join the interview.
      `;
  
      setLoading(true);
  
      try {
        const response = await postToEndpoint('/generateMessage.php', { prompt });
  
        if (response.data?.message) {
          setMessage(response.data.message);
        } else {
          console.error('Error generating message:', response.data.error);
  
          Swal.fire('Error', 'There was an issue generating the message.', 'error');
        }
      } catch (error) {
        console.error('Error calling API:', error);
  
        Swal.fire('Error', 'There was an issue calling the API.', 'error');
      } finally {
        setLoading(false);  
      }
    }
  };
  
  
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Interview Details</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{padding: '1.4rem'}}>
        <div className="d-flex align-items-center mb-4" style={{ gap: "10px" }}>
          <img
            src={applicant[0]?.profile_picture_url || "https://via.placeholder.com/50"} 
            alt={`${applicant[0]?.firstname}'s profile`}
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #ddd",
            }}
          />
            <div style={{textAlign: 'left'}}>
              <h5 className="mb-1">{applicant[0]?.firstname} {applicant[0]?.middlename} {applicant[0]?.lastname}</h5>
              <p className="text-muted mb-0">{applicant[0]?.email}</p>
            </div>
        </div>
        <div>
        <Form.Group className="mb-3">
          <Form.Label className="d-flex align-items-center">
            <strong>Channel Name</strong>
            <div 
              className="ms-2"
              style={{ cursor: 'pointer' }}
            >
              <FaInfoCircle title="After saving the Channel name, you won't be able to generate a new one."/>
            </div>
          </Form.Label>
          <div className="d-flex align-items-center position-relative">
            <Form.Control
              type="text"
              readOnly
              value={randomString}
              placeholder="Click the button to generate a channel name"
              className="me-2"
            />
            {(randomString) && (
              <div
                style={{ cursor: 'pointer' }}
                onClick={copyToClipboard}
                title={copied ? 'Copied!' : 'Copy to clipboard'}
              >
                {copied ? (
                  <FaCheck style={{ color: 'green' }} />
                ) : (
                  <FaRegCopy />
                )}
              </div>
            )}
          </div>
          <div
            className="mt-1"
            style={{
              padding: "8px 15px 8px",
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
              The channel name you provided for the applicant will also serve as your access point for joining the video conference in the system.
            </p>
          </div>
          <div className="button" style={{ justifySelf: 'end' }}>
          {randomString ? (
               <Button
               variant="success"
               onClick={generateRandomString}
               className="mb-1 mt-3"
               style={{
                 height: '40px',
                 fontSize: '12px',
                 borderRadius: '3px',
                 width: '80px',
                 color: '#156ad7',
                 background: '#bce0ff',
                 border: 'none',
                 fontWeight: '700',
               }}
               disabled
             >
               Generate
             </Button>
            ) : (
              <Button
              variant="success"
              onClick={generateRandomString}
              className="mb-1 mt-3"
              style={{
                height: '40px',
                fontSize: '12px',
                borderRadius: '3px',
                width: '80px',
                color: '#156ad7',
                background: '#bce0ff',
                border: 'none',
                fontWeight: '700',
              }}
            >
              Generate
            </Button>
            )}
           
          </div>
        </Form.Group>
          <hr />
          <h6><strong>Interview Schedule</strong></h6>
          {/* Inline Date and Time */}
          <div className="d-flex align-items-center mb-3">
            <Form.Group className="me-3" style={{ flex: 1 }}>
              <Form.Label>Date</Form.Label>
              <div className="position-relative">
                <DatePicker
                  selected={date}
                  onChange={(selectedDate) => setDate(selectedDate)}
                  minDate={today}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a date"
                  className="form-control"
                />
              </div>
            </Form.Group>

            <Form.Group style={{ flex: 1 }}>
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={time} 
                onChange={handleTimeChange}
                step="300" 
                placeholder="Select a time"
              />
            </Form.Group>
          </div>


          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            {/* Rich Text Editor */}
            <ReactQuill
              value={message}
              onChange={setMessage}
              theme="snow"
              placeholder="Enter your message here"
              modules={{
                toolbar: [
                  [{ 'header': '3' }, { 'font': [] }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline'],
                  ['link'],
                  [{ 'align': [] }],
                  ['blockquote', 'code-block'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'script': 'sub' }, { 'script': 'super' }],
                ],
              }}
            />
            <Button
              variant="info"
              onClick={generateMessage} 
              className='mt-2'
              disabled={!isFormValid1 || loading} 
              style={{
                height: '40px',
                fontSize: '12px',
                borderRadius: '3px',
                width: '170px',
                background: '#156ad7',
                color: 'white',
                fontWeight: '700',
              }}
            >
              {loading ? 'Generating...' : 'Write message with AI'} {/* Change text when loading */}
            </Button>
          </Form.Group>


        </div>
      </Modal.Body>
      

      <Modal.Footer 
       style={{
        paddingLeft: "1rem",
        paddingRight: "1rem",
        justifyContent: "space-between",
      }}>
        <Button variant="secondary" onClick={handleClose}
        style={{
          height: "40px",
          fontSize: "12px",
          borderRadius: "3px",
          width: "75px",
          color: "#156ad7",
          background: "#bce0ff",
          border: "none",
          fontWeight: "700",
        }}
        >
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}
         disabled={!isFormValid}
        style={{
          width: "150px",
          height: "40px",
          fontSize: "12px",
          borderRadius: "3px",
          background: "#156ad7",
          fontWeight: "500",
        }}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalInterview;
