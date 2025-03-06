import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container fluid className="h-100 d-flex align-items-center justify-content-center px-4 bg-white"
    style={{position: 'fixed', zIndex:'99999999', top: '0', right: '0', background: 'white'}}
    >
      <Row className="w-100">
        
        {/* Left Section: Text */}
        <Col md={6} className="text-center text-md-left">
          <h1 className="text-4xl font-bold text-gray-900">Oops! Page not found</h1>
          <p className="mt-3 text-gray-600">
            Something went wrong. It looks like the link is broken or the page has been removed.
          </p>
          <div className="mt-6 d-flex justify-content-center">
            <button
              className="text-white px-5 py-2 rounded-lg d-flex align-items-center transition me-3"
              onClick={() => window.location.href = "/"}
              style={{background: '#0a65cc'}}
            >
              Home →
            </button>
            <button
              className="border border-gray-400 text-black px-5 py-2 rounded-lg hover:bg-gray-200 transition ml-3"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </Col>

        {/* Right Section: Image */}
        <Col md={4} className="d-flex justify-content-center">
          <img
            src="/assets/notfound.png"
            alt="404 Not Found"
            className="img-fluid"
            style={{
              maxWidth: '100%',
            }}
          />
        </Col>

      </Row>
    </Container>
  );
};

export default NotFound;
