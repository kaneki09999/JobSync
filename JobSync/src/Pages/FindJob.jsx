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
  const [industry, setIndustry] = useState('Business');
  const [jobType, setJobType] = useState('Full Time');
  const [salaryRange, setSalaryRange] = useState([70000, 120000]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [skills, setSkills] = useState([]);

  const [SearchJob, setSearchJob] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || '';
  const locationQuery = queryParams.get('location') || '';

  useEffect(() => {
      const fetchSearchResults = async () => {
          if (!searchQuery && !locationQuery) {
              setSearchJob([]);
              setLoading(false);
              return;
          }

          try {
              setLoading(true);
              const response = await getFromEndpoint('/getJobSearch.php', {
                  query: searchQuery,
                  location: locationQuery,
              });

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
  }, [searchQuery, locationQuery]); 

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
    
      const interval = setInterval(fetchJobmatches, 1300);  
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
     <div className="main-container">
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
        {/* Keep JobSearchBar separate from the container below */}
        <div style={{ width: "100%", position: "relative", zIndex: 10 }}>
          <JobSearchBar
            jobSearch={jobSearch}
            setJobSearch={setJobSearch}
            locationSearch={locationSearch}
            setLocationSearch={setLocationSearch}
            handleSearch={handleSearch}
            handleFilter={handleFilter}
            marginTop="20px"
          />
        </div>

        <Filter
          showFilter={showFilter}
          handleFilter={handleFilter}
          activeFilters={activeFilters}
          removeFilter={removeFilter}
          industry={industry}
          jobType={jobType}
          salaryRange={salaryRange}
          selectedSalaryRange={selectedSalaryRange}
          presetRanges={presetRanges}
          handleIndustryChange={handleIndustryChange}
          handleJobTypeChange={handleJobTypeChange}
          handleSalaryRangeChange={handleSalaryRangeChange}
          handlePresetSalarySelect={handlePresetSalarySelect}
        />

        {/* Job Listings */}
        <Container fluid="md" className="d-flex flex-column align-items-center" style={{marginTop: SearchJob?.length > 0 ? "7rem" : "5rem",}}>
        <Row
        className="gy-4 justify-content-center w-100"
        style={{ minWidth: "350px", maxWidth: "1200px" }}
      >
        {SearchJob?.length > 0 ? (
          <JobCards jobs={SearchJob} applicantId={user?.id} />
        ) : searchQuery || locationQuery ? (
          <div className='no-result'>
            No jobs found for "{searchQuery}" in "{locationQuery}". Try adjusting your search terms or filters.
          </div>
        ) : user?.id ? (
          matchJob?.length > 0 ? (
            paginatedMatchJobs.length > 0 ? (
              <>
                <h5 className="mb-1" style={{ textAlign: "left" }}>
                  Recommended Jobs:
                </h5>
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
          ) : paginatedJobs.length > 0 ? (
            <JobCards
              jobs={paginatedJobs}
              jobType={jobType}
              salaryRange={salaryRange}
              applicantId={user.id}
            />
          ) : (
            <div className="text-center mt-5" style={{ fontSize: "20px", color: "#777" }}>
              {jobSearch || locationSearch
                ? "No jobs match your search criteria. Please try adjusting your filters or search terms."
                : "Start your job search by entering a job title or location above!"}
            </div>
          )
        ) : paginatedJobs.length > 0 ? (
          <JobCards jobs={paginatedJobs} jobType={jobType} salaryRange={salaryRange} />
        ) : (
          <div className="text-center mt-5" style={{ fontSize: "20px", color: "#777" }}>
            {jobSearch || locationSearch
              ? "No jobs match your search criteria. Please try adjusting your filters or search terms."
              : "Start your job search by entering a job title or location above!"}
          </div>
        )}
      </Row>;


          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <Row className="w-100">
              <Col className="d-flex justify-content-center">
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} paginate={paginate} />
              </Col>
            </Row>
          )}
        </Container>
      </>

      )}
    </div>
    <style>{`
    .no-result {
      text-align: center;
      margin-top: 50px;
      font-size: 20px;
      color: #777;
      width: 1200px;
      height: 40vh;
    }
    @media (max-width: 768px) {
      .no-result {
        width: 100%;
      }
      .main-container {
        margin-top: 8rem !important;
      }
    }
    `}</style>
    </>

  );
}


      