import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { getFromEndpoint } from "../../components/apiService";

const MapComponent = ({ job_id }) => {
  const [location, setLocation] = useState(null);
  const [mapSrc, setMapSrc] = useState("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchLocation = async () => {
      if (!job_id) return;  

      try {
        const response = await getFromEndpoint(`/mapping.php?job_id=${job_id}`);
        if (response.data.length > 0) {
          const job = response.data[0];
          setLocation(job);

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                const directionsUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyAyMtyxzFqO1j5YcTAGgyi-gSbhfyvKWQA
                &origin=${userLat},${userLng}
                &destination=${job.lat},${job.lng}
                &mode=driving`;

                setMapSrc(directionsUrl);
                setLoading(false);  
              },
              (error) => {
                console.error("Error getting user location:", error);
                setLoading(false);
              }
            );
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setLoading(false);
      }
    };

    fetchLocation();
  }, [job_id]);  

  return (
    <div className="mt-4">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
          <Spinner animation="border" role="status" style={{color: '#0a60bb'}}>
            <span className="visually-hidden">Loading map...</span>
          </Spinner>
        </div>
      ) : mapSrc ? (
        <>
            <iframe
            title="Google Directions Map"
            src={mapSrc}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            />
            <p>
                <strong>Job Location:</strong> {location.address}, {location.city}
            </p>
        </>
      ) : (
            <Spinner animation="border" role="status" style={{color: '#0a60bb'}}>
          </Spinner>
      )}
    </div>
  );
};

export default MapComponent;
