import React, { useState, useEffect } from 'react';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postToEndpoint } from '../../../components/apiService';
import { useAuth } from '../../../AuthContext';
import Swal from 'sweetalert2';
import { FaArrowLeft } from 'react-icons/fa';

export default function AddressInfo() { 
  const [biography, setBiography] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [barangay, setBarangay] = useState('');
  const [postal, setPostal] = useState('');
  const [initialData, setInitialData] = useState(null);
  const [bioError, setBioError] = useState('');
  const { user } = useAuth();
  const [lastValidBiography, setLastValidBiography] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const MAX_WORDS = 150; // Set your word limit here

  // Function to count words without HTML tags
  const countWords = (html) => {
    if (!html) return 0;
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    // Split by whitespace and filter out empty strings
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  useEffect(() => {
    const fetchApplicantInfo = async () => {
      if (user?.id) {
        try {
          const response = await postToEndpoint('/getApplicantinfo.php', {
            applicant_id: user.id,
          });

          if (response.data) {
            const { biography, city, address, barangay, postal } = response.data;
            setBiography(biography || '');
            setLastValidBiography(biography || '');
            setWordCount(countWords(biography || ''));
            setCity(city || '');
            setAddress(address || '');
            setBarangay(barangay || '');
            setPostal(postal || '');
            setInitialData({
              biography,
              city,
              address,
              barangay,
              postal,
            });
          }
        } catch (error) {
          console.error('Error fetching applicant info:', error);
        }
      }
    };
    fetchApplicantInfo();
  }, [user]);

  const handleBiographyChange = (content, delta, source, editor) => {
    const currentWordCount = countWords(content);
    
    if (currentWordCount <= MAX_WORDS) {
      setBiography(content);
      setWordCount(currentWordCount);
      
      if (currentWordCount === MAX_WORDS) {
        setBioError(`Maximum limit reached (${MAX_WORDS} words)`);
      } else {
        setBioError('');
      }
    } else {
      // If over limit, revert to last valid biography
      setBiography(prev => {
        const prevWordCount = countWords(prev);
        
        // Only update if the new content has fewer words
        if (currentWordCount > prevWordCount) {
          return prev;
        }
        return content;
      });
    }
  };

  const isChanged = () => {
    if (!initialData) return false;
    return (
      biography !== initialData.biography ||
      city !== initialData.city ||
      address !== initialData.address ||
      barangay !== initialData.barangay ||
      postal !== initialData.postal
    );
  };

  const isValidBio = () => {
    const words = countWords(biography);
    return words === 0 || (words >= 100 && words <= MAX_WORDS); // Example: 10-30 words
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidBio()) {
      Swal.fire({
        title: 'Invalid Biography',
        text: `Please ensure your biography is between 10-${MAX_WORDS} words`,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    if (user?.id) {
      try {
        const response = await postToEndpoint('/updateApplicantAddress.php', {
          applicant_id: user.id,
          biography,
          city,
          address,
          barangay,
          postal,
        });
  
        if (response.data.success) {
          Swal.fire({
            title: 'Success!',
            text: 'Your information has been updated successfully!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: response.data.message || 'Failed to update your information. Please try again.',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }
      } catch (error) {
        console.error('Error updating applicant info:', error);
        Swal.fire({
          title: 'Oops!',
          text: 'An error occurred. Please try again later.',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      }
    }
  };

  return (
    <Container
      fluid="md"
      className="pb-5"
      style={{
        maxWidth: '1200px',
        background: 'transparent',
        borderRadius: '8px',
        padding: '2rem',
        paddingLeft: '10px',
        paddingTop: '16px',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Form style={{ width: '100%' }} onSubmit={handleSubmit}>
        <h4 style={{ marginBottom: '30px', fontSize: '28px', textAlign: 'left' }}>Address Information</h4>

        {/* Address and City Fields */}
        <Row className="gy-3 mb-4">
          <Col xs={12} md={6}>
            <Form.Label style={{ textAlign: 'left', display: 'block' }}>Address</Form.Label>
            <Form.Control
              className="register1"
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Col>
          <Col xs={12} md={6}>
            <Form.Label style={{ textAlign: 'left', display: 'block' }}>City</Form.Label>
            <Form.Control
              className="register1"
              type="text"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Col>
        </Row>

        {/* Barangay and Postcode Fields */}
        <Row className="gy-3 mb-4">
          <Col xs={12} md={6}>
            <Form.Label style={{ textAlign: 'left', display: 'block' }}>Barangay</Form.Label>
            <Form.Control
              className="register1"
              type="text"
              placeholder="Enter your barangay"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
            />
          </Col>
          <Col xs={12} md={6}>
            <Form.Label style={{ textAlign: 'left', display: 'block' }}>Postcode</Form.Label>
            <Form.Control
              className="register1"
              type="text"
              placeholder="Enter your postcode"
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
            />
          </Col>
        </Row>

        {/* Biography Field */}
        <hr className="my-4" />
        <Row>
          <Col xs={12}>
            <Form.Label
              style={{
                textAlign: 'left',
                display: 'block',
                fontSize: '24px',
                fontWeight: '500',
              }}
            >
              Biography
            </Form.Label>
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
              <small style={{ fontStyle: 'italic' }}>
                Note: Make sure to include a well-written biography that showcases your unique abilities, experiences,
                and accomplishments, offering prospective employers a compelling reason to consider you for the position.
                (Must be 10-{MAX_WORDS} words) Current count: {wordCount}/{MAX_WORDS} words
              </small>
            </div>
            <ReactQuill
              value={biography}
              onChange={handleBiographyChange}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                ],
              }}
              style={{ 
                minHeight: '150px', 
                textAlign: 'left',
                border: bioError ? '1px solid red' : '1px solid #ccc'
              }}
              placeholder={`Enter your biography (up to ${MAX_WORDS} words)...`}
            />
            {bioError && <div style={{ color: 'red', fontSize: '0.875rem' }}>{bioError}</div>}
            <div style={{ 
              textAlign: 'right', 
              color: wordCount === MAX_WORDS ? 'red' : 'inherit'
            }}>
              {wordCount}/{MAX_WORDS} words
            </div>
          </Col>
        </Row>

        {/* Save Changes Button */}
        <Row className="mt-5">
          <Col xs={12} className="d-flex flex-column flex-md-row" style={{ justifyContent: 'space-between' }}>
            <Button
              variant="primary"
              onClick={() => {
                window.history.back();
                window.scrollTo({ top: 0 });
              }}
              className="mt-3 btn-address"
              style={{
                width: '100%',
                maxWidth: '185px',
                height: '55px',
                color: '#0d6efd',
                background: 'transparent',
                marginBottom: '10px',
              }}
            >
              <FaArrowLeft style={{ fontSize: '14px', marginRight: '12px' }} /> Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="mt-3 btn-address"
              style={{
                width: '100%',
                maxWidth: '185px',
                height: '55px',
              }}
              disabled={!isChanged() || !isValidBio()}
            >
              Save Changes
            </Button>
          </Col>
        </Row>

        <style>{`
          @media (max-width: 768px) {
            .btn-address {
                max-width: 100% !important
            }
          }          
        `}</style>
      </Form>
    </Container>
  );
}