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

    return (
<div> 
    {loading && <div id='preloader'></div>}

    <header className="py-4 header-bg" style={{ marginTop: '60px' }}>
        <div className="container">
            <div className="row align-items-center">
                <div className="col-md-7 text-md-center text-center headerss" style={{fontSize: '20px'}}>
                    <h1 className="fw-bold text-white">
                        Find a job that suits<br />your interest & skills.
                    </h1> 
                </div>
                <div className="col-md-5 text-md-end text-center">
                    <img 
                        src="https://i0.wp.com/freelancemethod.com/wp-content/uploads/2021/06/blogging.png?resize=768%2C576&ssl=1" 
                        alt="Job search" 
                        className="img-fluid" 
                        style={{ maxWidth: '100%' }} 
                    />
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
        .header-bg {
            background: linear-gradient(135deg, #1d73cb, #9c9ecd);
            padding: 2rem 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            width: 100vw;
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
        }
    `}</style>
</div>

    );
}
