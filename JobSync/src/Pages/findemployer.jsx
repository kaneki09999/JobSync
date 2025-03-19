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
            setFilteredCompanies(response.data); 
        } catch (error) {
            setError('No Company Data');
        } finally {
            setLoading(false);
        }
    };

    fetchCompanyData();
  }, []);

  useEffect(() => {
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
<Container className="job-grid-container">
<div className="fixed-search-container w-full">
  {/* Search Bar */}
  <Form className="search-form w-full container" onSubmit={(e) => e.preventDefault()}>
    <Row className="align-items-center w-full mx-0">
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
</div>
  
  {/* Job Grid with top padding to account for fixed search bar */}
  <div className="jobs-content-area">
    {loading ? (
      <div id="preloader"></div>
    ) : error ? (
      <div className="error-message">{error}</div>
    ) : (
      <div className="company-res">
        <Row className="gy-5 job-grid d-flex flex-wrap justify-content-center">
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
                      <span className="company-name" style={{ fontSize: '18px', color: '#353535' }}>{company.company_name}</span>
                     
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
      <div className="pagination-container">
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredCompanies.length}
          paginate={paginate}
          showArrows={Math.ceil(filteredCompanies.length / itemsPerPage) >= 10}
        />
      </div>
    )}
  </div>
</Container>

<style>{`
  .job-grid-container {
    max-width: 1200px;
    width: 100%;
    position: relative;
    padding-top: 120px; /* Space for fixed search bar */
    margin: 0 auto; /* Center the container */
  }
  
  .fixed-search-container {
    position: fixed;
    top: 190px;
    left: 0;
    right: 0;
    z-index: 100;
    background: linear-gradient(62deg, rgba(41,108,182,1) 0%, rgba(40,118,185,1) 51%, rgba(23,96,184,1) 98%);
    padding: 15px 0;  
    width: 100%; 
    margin: 0;
    height: 110px;
  }

  .search-form-wrapper {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 15px; /* Add padding inside the wrapper instead */
  }
  
  .search-form {
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 2px 6px 14px rgba(0, 0, 0, 0.4);
    margin-bottom: 0;
  }
  
  .page-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f8f9fa;
    z-index: -1;
  }

  .jobs-content-area {
    width: 100%;
    min-height: 50vh;
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
  
  .company-res {
    width: 1215px;
    margin: auto;
    
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
    background-color: #d8ecff;
    text-align: center;
    width: 100%;
    max-width: 100%;
    box-shadow: 2px 6px 16px rgba(0, 0, 0, 0.2);
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
    background-color: #ffffff;
    border: none;
    transition: 0.3s ease-in-out;
  }
  
  .open-position-btn:hover {
    background-color: #85b8ff;
  }
  
  .error-message {
    text-align: center;
    margin: 40px auto;
    padding: 20px;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 8px;
    width: 100%;
    max-width: 800px;
  }
  
  .pagination-container {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
  
  /* Responsive Design */
  @media (max-width: 1260px) {
    .company-res {
      width: auto;
    }
  } 
  @media (max-width: 992px) {
    .fixed-search-container {
      height: 125px;
    }
    .company-res {
      width: auto;
    }
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
    .jobs-content-area {
      margin-top: 6rem !important
    }
    .job-grid-container {
      padding-top: 170px; /* More space for stacked search form */
    }
    .company-res {
      width: 100%;
      padding: 0 10px;
    }
    .margins {
      margin-top: 8px;
      margin-bottom: 8px;
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
    .fixed-search-container {
      padding: 10px 0;
      height: 155px;
    }
    .job-grid-container {
      padding-top: 170px;
    }
  }
  
  @media (max-width: 576px) {
    .fixed-search-container {
      height:185px;
    }
    .job-grid-container {
      padding-top: 220px; /* Even more space for mobile layout */
    }
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
