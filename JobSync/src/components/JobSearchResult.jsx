import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getFromEndpoint } from '../components/apiService';
import JobCards from './jobcards';

function SearchJobResults() {
    const [SearchJob, setSearchJob] = useState([]);
    const [loading, setLoading] = useState(true);
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

    return (
        <div>
            <h2>Search Results</h2>
            {loading ? <div>Loading...</div> : <JobCards jobs={SearchJob} />}
        </div>
    );
}

export default SearchJobResults;
