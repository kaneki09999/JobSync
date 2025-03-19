import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import ph from "../assets/ph.png";

function SearchBarSection({ selected }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setSearchQuery(queryParams.get("query") || "");
        setLocationQuery(queryParams.get("location") || "");
    }, [location.search]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            const params = new URLSearchParams();
            if (searchQuery) params.set("query", searchQuery);
            if (locationQuery) params.set("location", locationQuery);

            if (params.toString()) {
                navigate(`/findjob?${params.toString()}`);
            } else if (location.pathname === "/findjob") {
                navigate("/findjob");
            }
        }, 600);

        return () => clearTimeout(delaySearch);
    }, [searchQuery, locationQuery, navigate, location.pathname]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <div className="search-bar-container">
                <div className={`search-bar flex-grow-1 d-flex justify-content-center mb-2 mb-md-0 ${isMobile ? "hidden" : ""}`}>
                    
                    {/* Country Selector - Hidden on Mobile */}
                    {!isMobile && (
                        <div className="custom-select" style={{ marginRight: "-8px" }}>
                            <div className="selected-option" style={{ borderRightColor: "transparent" }}>
                                <img src={ph} alt="Philippines" className="country-flag" />
                                {selected}
                            </div>
                        </div>
                    )}

                    {/* Job Search Input */}
                    {!isMobile && (
                        <div className="input-group" style={{ marginRight: "-8px" }}>
                            <span className="input-icon">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Job title, keyword, company"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ borderRadius: "0", borderRightColor: "transparent" }}
                            />
                        </div>
                    )}

                    {/* Location Search Input */}
                    {!isMobile && (
                        <div className="input-group">
                            <span className="input-icon">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                            </span>
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="City, state, or zip code"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                /* Search Bar Container */
                .search-bar-container {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }

                /* Search Bar */
                .search-bar {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                    max-width: 100%;
                }

                /* Country Selector (Hidden on Mobile) */
                .custom-select {
                    position: relative;
                    max-width: 200px;
                }

                .selected-option {
                    display: flex;
                    align-items: center;
                    border: 1px solid #dee2e6;
                    border-radius: 10px 0 0 10px;
                    background: #fff;
                    padding: 10px;
                    cursor: pointer;
                    height: 46.5px;
                }

                .country-flag {
                    width: 30px;
                    margin-right: 5px;
                    margin-left: 5px;
                }

                /* Input Group */
                .input-group {
                    display: flex;
                    align-items: center;
                    position: relative;  
                    width: 100%;
                    max-width: 400px;
                }

                .input-icon {
                    position: absolute;
                    left: 15px;  
                    color: #0A65CC;
                    font-size: 16px; 
                    z-index: 10;
                }

                .search-input {
                    width: 100%;
                    padding: 10px 10px 10px 40px; 
                    border: 1px solid #dee2e6;
                    border-radius: 10px;
                    background: #fff;
                }

                /* Ensure search input and icon align */
                .input-group .input-icon + .search-input {
                    padding-left: 40px; 
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .search-bar {
                        display: none; /* Hide entire search bar on mobile */
                    }
                }
            `}</style>
        </>
    );
}

export default SearchBarSection;
