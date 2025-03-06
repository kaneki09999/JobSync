import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faFilter } from '@fortawesome/free-solid-svg-icons';

const JobSearchBar = ({ jobSearch, setJobSearch, locationSearch, setLocationSearch, handleSearch, handleFilter, marginTop }) => {
  return (
<Container fluid style={{ maxWidth: '1209px', padding: '0 15px', marginTop: '0' }}>

      <Row className="mb-3" style={{ marginTop }}>
        <Col md={12}>
          <form onSubmit={handleSearch} className="d-flex flex-wrap justify-content-between">
            <div className="d-flex flex-wrap flex-md-nowrap" style={{ width: '100%' }}>
              {/* Job Search Input */}
              <div className="input-group" style={{ maxWidth: '600px', flexGrow: '1', minWidth: '250px' }}>
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#0A65CC',
                      padding: '15px',
                      fontSize: '18px',
                      zIndex: '1'
                    }}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Job title, keyword, company"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  style={{
                    paddingLeft: '45px',
                    fontSize: '16px',
                    borderRadius: '10px 0 0 10px',
                    paddingRight: '10px',
                    height: '50px',
                  }}
                />
              </div>

              {/* Location Search Input */}
              <div className="input-group ms-md-2 mt-2 mt-md-0" style={{ maxWidth: '600px', flexGrow: '1', minWidth: '250px' }}>
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#0A65CC',
                      padding: '15px',
                      fontSize: '18px',
                      zIndex: '1'
                    }}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="City, state, or zip code"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  style={{
                    paddingLeft: '45px',
                    fontSize: '16px',
                    borderRadius: '0 10px 10px 0',
                    paddingRight: '10px',
                    height: '50px',
                  }}
                />
              </div>

              {/* Filter Button */}
              <Button
                variant="secondary"
                className="ms-md-2 mt-2 mt-md-0 d-flex align-items-center justify-content-center"
                style={{ fontSize: '16px', height: '50px', width: '150px' }}
                onClick={handleFilter}
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                Filter
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default JobSearchBar;
