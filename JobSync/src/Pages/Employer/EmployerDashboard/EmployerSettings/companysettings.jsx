import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.snow.css';
import { Container, Form, Button, Row, Col, Image, Card } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useAuth } from '../../../../AuthContext'; 
import { postToEndpoint } from '../../../../components/apiService';


const FileUpload = ({ label, required, onChange }) => (
  <Form.Group controlId={`form${label.replace(" ", "")}`} className="text-start">
    <Form.Label>
      {label} {required && <span style={{ color: 'red' }}>*</span>}
    </Form.Label>
    <Form.Control type="file" accept="image/*" style={{borderRadius: '10px'}} onChange={onChange} />
  </Form.Group>
);

export default function CompanySettings() {
  const { user } = useAuth(); 
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [aboutUs, setAboutUs] = useState('');

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (user?.id) {
        try {
          const response = await postToEndpoint('/getCompanyInfo.php', {
            employer_id: user.id,
          });
          if (response.data) {
            const { company_name, about_us, logo, banner } = response.data;
            setCompanyName(company_name);
            setAboutUs(about_us);

            setLogo(logo ? logo : null);
            setBanner(banner ? banner : null);
          }
        } catch (error) {
          console.error('Error fetching company info:', error);
        }
      }
    };

    fetchCompanyInfo();
  }, [user]); 

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) setBanner(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ logo, banner, companyName, aboutUs });
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center"
      style={{
        padding: '0',
        paddingTop: '15px',
      }}
    >
      <Form onSubmit={handleSubmit} style={{ width: '100%' }} className="p-4">
        
        {/* File upload section */}
        <Row className="mb-4">
          <Col xs={12} md={6}>
            <FileUpload label="Upload Company Logo" required onChange={handleLogoChange} />
          </Col>
          <Col xs={12} md={6}>
            <FileUpload label="Upload Company Banner" required onChange={handleBannerChange} />
          </Col>
        </Row>

        {/* Image preview section */}
        <Row className="mb-4">
          <Col xs={12} md={6}>
            <Card
              className="p-3 mb-4 text-center"
              style={{
                width: '200px',
                height: '200px',
                overflow: 'hidden',
                borderRadius: '50%',
                border: '1px solid #ddd',
                margin: '0 auto',
              }}
            >
              {logo ? (
                <Image
                  src={logo}
                  alt="Company Logo Preview"
                  thumbnail
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: 'none',
                  }}
                />
              ) : (
                <div className="text-center text-muted" style={{ padding: '20px', fontSize: '14px' }}>
                  No image uploaded
                </div>
              )}
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card
              className="p-3 mb-4 text-center"
              style={{
                width: '100%',
                height: '200px',
                overflow: 'hidden',
              }}
            >
              {banner ? (
                <Image
                  src={banner}
                  alt="Company Banner Preview"
                  thumbnail
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    border: 'none',
                  }}
                />
              ) : (
                <div className="text-center text-muted" style={{ padding: '20px', fontSize: '14px' }}>
                  No image uploaded
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Company Name Input */}
        <Row className="mb-4">
          <Col xs={12}>
            <Form.Group controlId="formCompanyName" className="text-start">
              <Form.Label>
                Company Name <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                className='register1'
                type="text"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{ padding: '10px', width: '100%' }}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* About Us Section */}
        <Row className="mb-4">
          <Col xs={12}>
            <Form.Group controlId="formAboutUs" className="text-start">
              <Form.Label>
                About Us <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <ReactQuill
                theme="snow"
                value={aboutUs}
                onChange={setAboutUs}
                placeholder="Tell us about your company"
                style={{ height: '200px', marginBottom: '30px', width: '100%'}}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row>
          <Col className="text-start">
            <Button type="submit" style={{ width: '200px', backgroundColor: '#0A65CC', marginTop: '3px', height: '50px'}}>
              Save Changes
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
