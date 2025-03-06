import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { getFromEndpoint } from '../components/apiService';
import Pagination from '../components/Pagination';

const FindEmployer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCompanyData = async () => {
        try {
            const response = await getFromEndpoint('/viewCompany.php');
            setCompanies(response.data);
            setFilteredCompanies(response.data); // Initialize filteredCompanies with all data
        } catch (error) {
            setError('Error fetching company data');
        } finally {
            setLoading(false);
        }
    };

    fetchCompanyData();
  }, []);

  useEffect(() => {
    // Filter companies whenever searchTerm or locationSearch changes
    const filtered = companies.filter(company =>
      company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      company.city.toLowerCase().includes(locationSearch.toLowerCase())
    );
    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset pagination to first page
  }, [searchTerm, locationSearch, companies]);

  const indexOfLastCompany = currentPage * itemsPerPage;
  const indexOfFirstCompany = indexOfLastCompany - itemsPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
    <Container className="my-5 job-grid-container">
      {/* Search Bar */}
      <Form className="mb-5 search-form" onSubmit={(e) => e.preventDefault()}>
        <Row className="align-items-center">
          <Col md={5} sm={6} xs={12}>
            <Form.Control
              type="text"
              placeholder="Search by company name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={5} sm={6} xs={12}>
            <Form.Control
              type="text"
              className="margins"
              placeholder="Search by location"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />
          </Col>
          <Col md={2} xs={12} className="text-center">
            <Button className="search-btn">
              <FontAwesomeIcon icon={faSearch} /> Search
            </Button>
          </Col>
        </Row>
      </Form>
      
      {/* Job Grid */}
      {loading ? (
        <div id="preloader"></div>
      ) : error ? (
        <div>{error}</div>
      ) : (
    <div className="company-res">
      <Row className="gy-5 job-grid d-flex flex-wrap justify-content-start">
        {currentCompanies.map((company) => (
          <Col 
            md={4} sm={6} xs={12} 
            key={`${company.id}-${company.company_name}`} 
            className="job-col d-flex justify-content-center"
            style={{ minWidth: '320px', maxWidth: '400px' }} // Keep consistent width
          >
            <div className="job-card w-100">
              <Row className="align-items-center">
                {/* Job Image */}
                <Col md={4} sm={4} xs={4} className="d-flex justify-content-center p-0">
                  <img src={company.logo} alt="Company Logo" className="company-logo" />
                </Col>

                {/* Job Info */}
                <Col md={8} sm={8} xs={8}>
                  <div className="company-details">
                    <span className="company-name" style={{ fontSize: '18px' }}>{company.company_name}</span>
                    <span className="badge featured-badge">Featured</span>
                  </div>
                  <div className="company-location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                    <span>{company.city}</span>
                  </div>
                </Col>
              </Row>

              {/* Open Position Button */}
              <Link to={`/employerdetails/${encodeURIComponent(company.company_name)}`}>
                <Button className="open-position-btn">
                  Open Position ({company.job_post_count})
                </Button>
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </div>
      )}
      {/* Pagination */}
      {filteredCompanies.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredCompanies.length}
          paginate={paginate}
          showArrows={Math.ceil(filteredCompanies.length / itemsPerPage) >= 10}
        />
      )}
    </Container>
  <style>{`
  .company-res {
        width: 1215px;
        margin: auto;
    }
  .search-form {
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  }
  .search-btn {
    width: 100%;
    background-color: #0A65CC;
    color: white;
    border: none;
  }
  .search-btn:hover {
    background-color: #0858b5;
  }
  .my-5 {
    margin-top: 0px !important
  }
  .job-grid-container {
    max-width: 1200px;
    width: 100%;
  }
  
  .job-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .job-col {
    display: flex;
    justify-content: center;
  }
  
  .job-card {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #f8f9fa;
    text-align: center;
    width: 100%;
    max-width: 100%;
  }
  
  .company-logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .company-details {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
    font-weight: bold;
  }
  
  .featured-badge {
    background-color: #dc3545;
    color: white;
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 5px;
  }
  
  .company-location {
    display: flex;
    align-items: center;
    color: #6c757d;
    font-size: 14px;
  }
  
  .location-icon {
    margin-right: 5px;
  }
  
  .open-position-btn {
    margin-top: 10px;
    padding: 6px 12px;
    width: 100%;
    color: #0A65CC;
    background-color: #add1ff;
    border: none;
    transition: 0.3s ease-in-out;
  }
  
  .open-position-btn:hover {
    background-color: #85b8ff;
  }
  
  /* Responsive Design */
  @media (max-width: 992px) {
    .job-card {
      padding: 10px;
    }
    .company-logo {
      width: 70px;
      height: 70px;
    }
    .featured-badge {
      font-size: 10px;
    }
  }
  
  @media (max-width: 768px) {
    .company-res {
      width: 100%;
      padding: 0 10px;
    }
    .margins {
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .job-grid-container {
      margin-top: 8rem !important
    }
    .job-col {
      width: 100%;
    }
    .company-logo {
      width: 60px;
      height: 60px;
    }
    .company-location {
      font-size: 12px;
    }
  }
  
  @media (max-width: 576px) {
    .job-card {
      padding: 16px;
      margin-top: 20px;
    }
    .company-logo {
      width: 50px;
      height: 50px;
    }
    .company-details {
      flex-direction: column;
      align-items: center;
    }
    .open-position-btn {
      font-size: 14px;
      padding: 5px 10px;
    }
  }
  
  `}</style>
  </>
  );
};

export default FindEmployer;
