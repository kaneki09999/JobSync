import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import JobCards from '../components/jobcards';
import Pagination from '../components/Pagination';
import Filter from '../components/Filter'; 
import { getFromEndpoint, postToEndpoint } from '../components/apiService';
import { useAuth } from '../AuthContext'; 
import { useLocation } from 'react-router-dom';
import JobSearchBar from '../components/SearchAndFilter';


export default function FindJob() {
  const { user } = useAuth(); 
  const [jobSearch, setJobSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [industry, setIndustry] = useState('Computer Games');
  const [jobType, setJobType] = useState('Full Time');
  const [salaryRange, setSalaryRange] = useState([70000, 120000]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [skills, setSkills] = useState([]);

  const [SearchJob, setSearchJob] = useState([]);
  const [FilterSearch, setFilterSearch] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const searchQuery = queryParams.get('query') || '';
  const locationQuery = queryParams.get('location') || '';
  const industryQuery = queryParams.get('industry') || '';
  const jobTypeQuery = queryParams.get('jobType') || '';
  const minSalaryQuery = queryParams.get('minSalary') || '';
  const maxSalaryQuery = queryParams.get('maxSalary') || '';
  
  useEffect(() => {
    const fetchSearchResults = async () => {
        setLoading(true);

        const params = {
          query: jobSearch || searchQuery,
          location: locationSearch || locationQuery,
      };
      

        console.log("Sending request with params:", params);

        try {
            const response = await getFromEndpoint('/getJobSearch.php', params);
            if (response && Array.isArray(response.data)) {
                setSearchJob(response.data);
            } else {
                setSearchJob([]);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchJob([]);
        } finally {
            setLoading(false);
        }
    };

    fetchSearchResults();
}, [jobSearch, locationSearch, searchQuery, locationQuery]);

useEffect(() => {
  const fetchFilterSearchResults = async () => {
      setLoading(true);

      const params = {
        industry: industry || industryQuery,
        jobType: jobType || jobTypeQuery,
        minSalary: Number(salaryRange[0]) || Number(minSalaryQuery) || 0,
        maxSalary: Number(salaryRange[1]) || Number(maxSalaryQuery) || 0,
    };
    

      console.log("Sending request with params:", params);

      try {
          const response = await getFromEndpoint('/getJobSearch.php', params);

          if (response && Array.isArray(response.data)) {
              setFilterSearch(response.data);
          } else {
              setFilterSearch([]);
          }
      } catch (error) {
          console.error('Error fetching search results:', error);
          setFilterSearch([]);
      } finally {
          setLoading(false);
      }
  };

  fetchFilterSearchResults();
}, [, industry, jobType, salaryRange, industryQuery, jobTypeQuery, minSalaryQuery, maxSalaryQuery]);

  const [jobmatches, setMatchJob] = useState([]);
  const [loader, setLoader] = useState(true);
  const [matchJob, setJobMatches] = useState([]);
    useEffect(() => {
        const fetchMatchedJobs = async () => {
          try {
            setLoader(true);
            const response = await postToEndpoint('/jobMatch.php', { applicant_id: user.id});
            setMatchJob(response.data.jobs);  
          } catch (error) {
            console.error('There was an error fetching the matched jobs!', error);
          } finally {
            setLoader(false);
          }
        };
        fetchMatchedJobs();
    }, [user?.id]);  

    useEffect(() => {
      const fetchJobmatches = async () => {
        try {
          const response = await postToEndpoint('/getJobMatches.php', { applicant_id: user.id });
          setJobMatches(response.data.matchjob);
        } catch (error) {
          console.error('There was an error fetching the matched jobs!', error);
        }
      };
      fetchJobmatches();  
    
      const interval = setInterval(fetchJobmatches, 20000);  
      return () => clearInterval(interval);  
    }, [user?.id]); 
    
  const presetRanges = [
    { label: '₱10 - ₱100', range: [10, 100] },
    { label: '₱100 - ₱1,000', range: [100, 1000] },
    { label: '₱1,000 - ₱10,000', range: [1000, 10000] },
    { label: '₱10,000 - ₱100,000', range: [10000, 100000] },
    { label: '₱100,000 Up', range: [100000, 200000] },
    { label: 'Custom', range: salaryRange },
  ];

  const handleFilter = () => setShowFilter(!showFilter);

  const handleJobTypeChange = (e) => {
    const selectedJobType = e.target.value;
    setJobType(selectedJobType);

    const existingFilter = activeFilters.find(filter => filter.type === 'Job Type');
    if (existingFilter) {
      existingFilter.value = selectedJobType;
      setActiveFilters([...activeFilters]);
    } else {
      setActiveFilters([...activeFilters, { type: 'Job Type', value: selectedJobType }]);
    }
  };

  const handleSalaryRangeChange = (range) => {
    setSalaryRange(range);

    const existingFilter = activeFilters.find(filter => filter.type === 'Salary Range');
    if (existingFilter) {
      existingFilter.value = `₱${range[0]} - ₱${range[1]}`;
      setActiveFilters([...activeFilters]);
    } else {
      setActiveFilters([...activeFilters, { type: 'Salary Range', value: `₱${range[0]} - ₱${range[1]}` }]);
    }
  };

  const removeFilter = (filterType) => {
    setActiveFilters(activeFilters.filter((filter) => filter.type !== filterType));
  };

  const handleIndustryChange = (e) => {
    const selectedIndustry = e.target.value;
    setIndustry(selectedIndustry);

    const existingFilter = activeFilters.find(filter => filter.type === 'Industry');
    if (existingFilter) {
      existingFilter.value = selectedIndustry;
      setActiveFilters([...activeFilters]);
    } else {
      setActiveFilters([...activeFilters, { type: 'Industry', value: selectedIndustry }]);
    }
  };

  const handlePresetSalarySelect = (range) => {
    setSalaryRange(range);

    const formattedSalaryRange = `₱${range[0]} - ₱${range[1]}`;

    const existingFilter = activeFilters.find((filter) => filter.type === 'Salary Range');

    if (existingFilter) {
      existingFilter.value = formattedSalaryRange;
      setActiveFilters([...activeFilters]);
    } else {
      setActiveFilters([ ...activeFilters, { type: 'Salary Range', value: formattedSalaryRange } ]);
    }
  };

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getFromEndpoint('/get_jobs.php');
        setJobs(response.data);
      } catch (error) {
        console.error('There was an error fetching the jobs!', error);
      }  
    };
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for jobs:', jobSearch, 'in location:', locationSearch);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  
  const paginatedJobs = (jobs || []).slice(indexOfFirstJob, indexOfLastJob);
  const paginatedMatchJobs = (matchJob || []).slice(indexOfFirstJob, indexOfLastJob);
  const paginatedSearchJobs = (SearchJob || []).slice(indexOfFirstJob, indexOfLastJob);
  
  const totalItems = SearchJob?.length > 0 
  ? SearchJob.length 
  : user?.id && matchJob?.length > 0 
    ? matchJob.length 
    : (jobs?.length || 0);  

  
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const marginTop =
    (paginatedSearchJobs.length >= 1 && paginatedSearchJobs.length <= 3) || 
    (paginatedMatchJobs.length >= 1 && paginatedMatchJobs.length <= 3) || 
    (paginatedJobs.length >= 1 && paginatedJobs.length <= 3) 
      ? '-225px' 
      : (paginatedSearchJobs.length >= 4 && paginatedSearchJobs.length <= 6) || 
        (paginatedMatchJobs.length >= 4 && paginatedMatchJobs.length <= 6) || 
        (paginatedJobs.length >= 4 && paginatedJobs.length <= 6) 
        ? '0px' 
        : '109px';
  
  const height = jobs.length > 0 ? 'auto' : '380px';

  return (
    <>
<div className="main-container" style={{marginTop: '6.9rem'}}>
  {loader ? (
    <div id="preloader" style={{zIndex: '1'}}>
      <p style={{ marginTop: "20px", animation: "blink 1.8s infinite", fontSize: '23px', position: 'relative', top: '505px', color: '#6e84bb'}}>
        Matching you with the best job opportunities...
      </p>
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.1; }
          }
        `}
      </style>
    </div>  
  ) : (
    <>
    <div className="content-wrapper">
    <div className="fixed-search-area">
    <div className="search-bar-container">
      <JobSearchBar
        jobSearch={jobSearch}
        setJobSearch={setJobSearch}
        locationSearch={locationSearch}
        setLocationSearch={setLocationSearch}
        handleSearch={handleSearch}
        handleFilter={handleFilter}
        marginTop="0"
      />
    </div>

    <Container>
      <div className="filters-inline-container">
        <div className="filters-badge">
          <span className="filter-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </span>
          <span>Filters</span>
        </div>
        
        <div className="filters-row">
          <div className="filter-item">
            <select 
              className="filter-select" 
              onChange={(e) => handleFilter('timePeriod', e.target.value)}
              aria-label="Filter by date posted"
            >
              <option value="">Date Posted</option>
              <option value="24h">Last 24 hours</option>
              <option value="3d">Last 3 days</option>
              <option value="7d">Last 7 days</option>
              <option value="14d">Last 14 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
          
          <div className="filter-item">
            <select 
              className="filter-select" 
              onChange={(e) => handleFilter('workType', e.target.value)}
              aria-label="Filter by work type"
            >
              <option value="">Work Type</option>
              <option value="fullTime">Full-time</option>
              <option value="partTime">Part-time</option>
              <option value="contract">Contract</option>
              <option value="casual">Casual</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          
          <div className="filter-item">
            <select 
              className="filter-select" 
              onChange={(e) => handleFilter('salaryRange', e.target.value)}
              aria-label="Filter by salary range"
            >
              <option value="">Monthly Salary</option>
              <option value="below15k">Below ₱15,000</option>
              <option value="15k-25k">₱15,000 - ₱25,000</option>
              <option value="25k-40k">₱25,000 - ₱40,000</option>
              <option value="40k-60k">₱40,000 - ₱60,000</option>
              <option value="above60k">Above ₱60,000</option>
            </select>
          </div>
          
          <button 
            className="filter-reset-btn" 
            onClick={() => handleClearFilters()}
            aria-label="Reset all filters"
          >
            Reset
          </button>
        </div>
      </div>
    </Container>
    </div>

      {/* Job Listings with a fixed top margin to ensure content appears below search area */}
      <div className="job-listings-area mt-4">
        <Container fluid="md" className="d-flex flex-column align-items-center">
          <Row
            className="gy-4 flex flex-column justify-content-center w-100"
            style={{ minWidth: "350px",}}
          >
            {(searchQuery || locationQuery) && (FilterSearch?.length > 0 || SearchJob?.length > 0) ? (
              FilterSearch?.length > 0 ? (
                <JobCards jobs={FilterSearch} applicantId={user?.id} />
              ) : SearchJob?.length > 0 ? (
                <JobCards jobs={SearchJob} applicantId={user?.id} />
              ) : (
                <div className="no-result">
                  No jobs found for "{searchQuery}" in "{locationQuery}". Try adjusting your search terms or filters.
                </div>
              )
            ) : (!searchQuery && !locationQuery && user && matchJob?.length > 0) ? (
              paginatedMatchJobs.length > 0 ? (
                <>
                  <h5 className="mb-2 mt-5" style={{ textAlign: "left" }}>Recommended Jobs:</h5>
                  <JobCards
                    jobs={paginatedMatchJobs}
                    jobType={jobType}
                    salaryRange={salaryRange}
                    applicantId={user.id}
                  />
                </>
              ) : (
                <div className="text-center mt-5" style={{ fontSize: "20px", color: "#777" }}>
                  No job matches based on your skills and experience. Try adjusting your filters or search terms.
                </div>
              )
            )  : FilterSearch?.length > 0 ? (
              <JobCards jobs={FilterSearch} applicantId={user?.id} />
            ) : SearchJob?.length > 0 ? (
              <JobCards jobs={SearchJob} applicantId={user?.id} />
            ) : searchQuery || locationQuery ? (
              <div className='no-result'>
                No jobs found for "{searchQuery}" in "{locationQuery}". Try adjusting your search terms or filters.
              </div>
            ) : paginatedJobs.length > 0 ? (
              <JobCards
                jobs={paginatedJobs}
                jobType={jobType}
                salaryRange={salaryRange}
                applicantId={user?.id}
              />
            ) : (
              <div className="text-center mt-5" style={{ fontSize: "20px", color: "#777" }}>
                {searchQuery || locationQuery
                  ? "No jobs match your search criteria. Please try adjusting your filters or search terms."
                  : "Start your job search by entering a job title or location above!"}
              </div>
            )}
          </Row>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <Row className="w-100">
              <Col className="d-flex justify-content-center">
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} paginate={paginate} />
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
    </>
  )}
</div>

<style>{`
.fixed-search-area {
  background: linear-gradient(62deg, rgba(41,108,182,1) 0%, rgba(40,118,185,1) 51%, rgba(23,96,184,1) 98%) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 28px;
  transition: all 0.3s ease;
}

.filters-inline-container {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  gap: 20px;
  flex-wrap: wrap;
}

.filters-badge {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #ffffff;
  font-size: 15px;
  gap: 8px;
  min-width: 80px;
}

.filter-icon {
  display: flex;
  align-items: center;
  color: #ffffff;
}

.filters-row {
  display: flex;
  flex: 1;
  gap: 16px;
  align-items: center;
  flex-wrap: nowrap;
}

.filter-item {
  position: relative;
  flex: 1;
  max-width: 220px;
}

.filter-select {
  width: 100%;
  padding: 12px 36px 12px 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.25s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232557a7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 14px;
}

.filter-select:hover {
  border-color: #2557a7;
  background-color: #f5f9ff;
}

.filter-select:focus {
  outline: none;
  border-color: #2557a7;
  box-shadow: 0 0 0 3px rgba(37, 87, 167, 0.15);
  background-color: white;
}

.filter-reset-btn {
  background-color: transparent;
  border: 2px solid #f0f0f0;
  color: #ff6b6b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 8px;
  white-space: nowrap;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-reset-btn:hover {
  background-color: #fff0f0;
  border-color: #ffdbdb;
  color: #ff4040;
}

.filter-reset-btn::before {
  content: "×";
  font-size: 18px;
  line-height: 0;
  padding-bottom: 2px;
}

@media (max-width: 900px) {
  .filters-inline-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filters-row {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
    gap: 12px;
  }
  
  .filter-item {
    min-width: 160px;
  }
}

@media (max-width: 600px) {
  .fixed-search-area {
    padding: 16px;
    border-radius: 10px;
  }

  .filters-row {
    flex-wrap: wrap;
  }
  
  .filter-item {
    max-width: none;
    width: 100%;
  }
  
  .filter-reset-btn {
    margin-top: 8px;
    width: 100%;
    justify-content: center;
  }
}
  #root {
    width: 100%;
  }
  .main-container {
    /* Let it fill at least one full screen of height */
    min-height: 100vh;
    margin-top: 8rem; /* or whatever space you need at the top */
    margin-bottom: 2rem; /* or whatever space you need at the bottom */
  }
  
  .content-wrapper {
    display: flex;
    flex-direction: column;
    /* Remove the min-height here if you want auto height within the container */
    /* min-height: 100vh; <-- remove or comment this out */
  }
    
  .fixed-search-area {
    position: relative;
    background-color: white;
    margin-bottom: 10px; /* Create space between search and results */
  }
  .filter-container {
    padding: 5px 0 15px 0;
  }
  
  .job-listings-area {
    flex-grow: 1; /* Take remaining space */
  }
  
  .no-result {
    text-align: center;
    margin-top: 50px;
    font-size: 20px;
    color: #777;
    width: 100%;
    max-width: 1200px;
    min-height: 300px; /* Ensure minimum height even with no results */
  }
  
  @media (max-width: 768px) {
    .fixed-search-area {
      padding: 0 10px;
    }
  }
`}</style>
    </>

  );
}


      