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

            <header className="relative container text-center py-4 paddings">
                <div className="row align-items-center">
                    <div className="col-md-7 text-md-start text-center">
                        <h1>Find a job that suits<br />your interest & skills.</h1>
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
            </header>

            <main className="container mt-4">
                <div className="search-bar d-flex justify-content-center align-items-center my-4">
                    {/* Search bar content */}
                </div>

                <div className="suggestions text-md-start mb-4">
                    <p style={{ fontWeight: '600' }}>Designer, Programming, Digital Marketing, Video, Animation</p>
                </div>

                {/* Statistics Section */}
                <div className="row text-center g-3">
                    {[
                        { icon: FaBriefcase, text: "Live Jobs", bg: '#E7F0FA', color: '#0A65CC' },
                        { icon: FaBuilding, text: "Companies", bg: '#0A65CC', color: '#FFFFFF' },
                        { icon: FaUser, text: "Candidates", bg: '#E7F0FA', color: '#0A65CC' },
                        { icon: FaPlus, text: "New Jobs", bg: '#E7F0FA', color: '#0A65CC' }
                    ].map((item, index) => (
                        <div key={index} className="col-6 col-md-3">
                            <div className="border p-3 d-flex align-items-center justify-content-center flex-column">
                                <item.icon size={50} style={{ backgroundColor: item.bg, padding: '10px', borderRadius: '10px', color: item.color }} className="mb-2" />
                                <p className="mb-0 fw-bold text-guest">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="my-5">
                    <JobSyncFlow />
                </div>

                <div className="my-5">
                    <NewestJob />
                </div>

                {/* Featured Jobs Section */}
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
                    <JobCards jobs={jobs.slice(0, 6)} {...(user?.id && { applicantId: user.id })}/>
                </div>
            </main>
            <style>{`
                @media (max-width: 576px) {
                    .text-guest {
                        font-size: 14px;
                    }
                    .paddings{
                        padding: 0 25px !important;     
                        margin-top: 5rem !important;
                    }
            `}</style>
        </div>
    );
}
