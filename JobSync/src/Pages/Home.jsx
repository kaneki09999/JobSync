import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { FaBriefcase, FaBuilding, FaUser, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import JobSyncFlow from '../components/jobsyncflow.jsx';
import PopularCategories from '../components/popularcategories';
import JobCards from '../components/jobcards';
import { getFromEndpoint } from '../components/apiService.jsx';
import { useAuth } from '../AuthContext.jsx'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import JobDetails from '../Pages/JobDetails';
import FindEmployer from './findemployer.jsx';
import NewestJob from './NewestJobDetail.jsx';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Carousel } from 'bootstrap';

export default function Home() {
    const { user } = useAuth(); 
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true); 
                const response = await getFromEndpoint('/get_jobs.php');
                setJobs(response.data);
            } catch (error) {
                console.error('There was an error fetching the jobs!', error);
            } finally {
                setLoading(false); 
            }
        };
        fetchJobs();
    }, []);

useEffect(() => {
  const myCarousel = document.getElementById('carouselExampleAutoplaying');
  const carousel = new Carousel(myCarousel, {
    interval: 3000,
    ride: 'carousel'
  });

  return () => {
    carousel.dispose();
  };
}, []);

    return (
<div> 
    {loading && <div id='preloader'></div>}

    <header className="py-4 header-bg" style={{ marginTop: '60px' }}>
  <div className="container">
    <div className="row align-items-center">
      <div className="col-md-7 text-center text-md-start headerss">
        <h1 className="fw-bold text-white">
          FIND A JOB THAT SUITS<br className="d-none d-md-block" />YOUR INTEREST & SKILLS.
        </h1>
        <div className="mt-4">
          <button className="btn-search">
            Find Job Now
            <i className="fa fa-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
      <div className="col-md-5 text-center text-md-end mt-5 mt-md-0">
        <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/src/assets/blogging.webp" alt="Job search 1" className="img-fluid carousel-img" />
            </div>
            <div className="carousel-item">
              <img src="/src/assets/c1.png" alt="Job search 2" className="img-fluid carousel-img" />
            </div>
            <div className="carousel-item">
              <img src="/src/assets/c2.png" alt="Job search 3" className="img-fluid carousel-img" />
            </div>
            <div className="carousel-item">
              <img src="/src/assets/c3.png" alt="Job search 4" className="img-fluid carousel-img" />
            </div>
            <div className="carousel-item">
              <img src="/src/assets/c4.png" alt="Job search 5" className="img-fluid carousel-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>

    <main className="container mt-4">
        <div className="search-bar d-flex justify-content-center align-items-center my-4">
            {/* Search bar content */}
        </div>

        <div className="my-5">
            <JobSyncFlow />
        </div>

        <div className="d-flex justify-content-between align-items-center my-5">
            <h4>Newest Jobs</h4>
            <Link to="/findjob" className="text-decoration-none text-primary">
                <div className="d-flex align-items-center">
                    <span>View All</span>
                    <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </div>
            </Link>
        </div>

        <div>
            <JobCards jobs={jobs.slice(0, 4)} {...(user?.id && { applicantId: user.id })}/>
        </div>
    </main>

    <style>{`
    .btn-search {
      background: #144a9d;
      box-shadow: 1px 3px 7px 0px rgb(255 255 255 / 52%);
    }
    .header-bg {
        background: linear-gradient(135deg, #1d73cb, #9c9ecd);
        padding: 2rem 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 100vw;
        height: 55vh;
        margin-left: calc(-50vw + 50%);
        position: relative;
        left: 0;
        right: 0;
    }

    .headerss h1 {
        font-size: 3rem;
        color: white;
    }

    @media (max-width: 768px) {
      .header-bg {
        height: 600px;
    }
        .headerss h1 {
            font-size: 1.5rem !important;
            margin-top: 2rem;
        }
    }

    @media (max-width: 576px) {
        .text-guest {
            font-size: 14px;
        }
        .paddings {
            padding: 0 25px !important;     
            margin-top: 5rem !important;
        }

        .carousel-img {
            width: 100%; 
            height: 300px; /* Set a fixed height for all images */
            object-fit: cover; /* This ensures images fill the space and maintain aspect ratio */
        }
    }

    /* Fix the carousel height */
    .carousel {
        height: 50vh;
        overflow: hidden; /* Prevent carousel images from overflowing */
    }

    .carousel-inner {
        height: 100%;
    }

    .carousel-item img {
        height: 100%; /* Ensure images cover the full carousel height */
        object-fit: cover; /* Keeps aspect ratio and ensures the image covers the area */
    }
`}</style>
</div>

    );
}