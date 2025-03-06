import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useLocalScreenTrack,
  useTrackEvent,
  LocalVideoTrack,
  LocalAudioTrack
} from "agora-rtc-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import logo from '../assets/logo3.png'
import { useAuth } from '../AuthContext';
import { postToEndpoint } from '../components/apiService';
import Swal from "sweetalert2"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import apiClient from "../components/apiClient";

export const Publisher = () => {
  const { user } = useAuth();
  const { job_id, application_id } = useParams();
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("969528b81d9d47f49fe811e371eb1510");
  const [token, setToken] = useState(""); 
  const [channel, setChannelName] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [company, setCompany] = useState([]);
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    const fetchCompany = async () => {
        try {
            const response = await postToEndpoint('/getCompanyName.php', {
                job_id: job_id,
            });

            if (response.data?.companyname) {
                setCompany(response.data.companyname);
            } else {
                console.error('No company found or an error occurred:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching company:', error);
        }
    };

      fetchCompany();
  }, [job_id]);

  useEffect(() => {
    const fetchApplied = async () => {
        try {
            const response = await postToEndpoint('/getApplicantAppliedDetails.php', { application_id, job_id });
            if (response.data.jobs) {
                setApplications(response.data.jobs);
            } else {
                console.error('No jobs found or an error occurred:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    fetchApplied();
}, [application_id, job_id]);
  
  useEffect(() => {
    const fetchChannelName = async () => {
      try {
        const response = await postToEndpoint('/getChannelName.php', { employer_id: user.id, application_id, job_id });
        if (response.data?.channelname) {
          setChannelName(response.data.channelname);
          
        } else {
          console.error('No channel name found or an error occurred:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching channel name:', error);
      }
    };
  
    fetchChannelName();
  }, [user.id, application_id, job_id]);
  
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          `${apiClient.defaults.baseURL}/getJoinRequest.php?channelName=${channel.channel_name}`
        );
        
        if (response.data.status === "success") {
          setPendingRequests(response.data.requests);
        } else {
          console.error("Error fetching join requests:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching join requests:", error);
      }
    };

    if (channel) {
      fetchPendingRequests();
    }

    const intervalId = setInterval(() => {
      if (channel) {
        fetchPendingRequests();
      }
    }, 5000);

    return () => clearInterval(intervalId);

  }, [channel]);

  const TOKEN_FETCH_URL = `${apiClient.defaults.baseURL}/generateToken.php`;

  const fetchRTCToken = async (channelName) => {
    try {
      const response = await fetch(
        `${TOKEN_FETCH_URL}?channelName=${channelName}&uid=${user.id}&role=publisher`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.rtcToken;
    } catch (error) {
      console.error("Error fetching RTC token:", error);
      throw error;
    }
  };

  const checkIfChannelExists = async (channel, applicationId, jobId) => {
    try {
      const response = await fetch(
        `${apiClient.defaults.baseURL}/checkChannelExists.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channel_name: channel.channel_name,
            application_id: applicationId,
            job_id: jobId,
          }),
        }
      );
  
      const data = await response.json();
      if (data.status === "exists") {
        return true;
      } else {
        Swal.fire({
          icon: "error",
          title: "Channel Not Found",
          text: "The channel name you are trying to access does not exist. Kindly verify the channel name and ensure it is entered correctly.",
          confirmButtonText: "OK",
        });
        return false;
      }
    } catch (error) {
      console.error("Error checking channel existence:", error);
  
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error checking the channel existence.",
        confirmButtonText: "OK",
      });
      return false;
    }
  };


  const handleJoin = async () => {
    const channelExists = await checkIfChannelExists(channel, application_id, job_id);
    if (!channelExists) return;  
    try {
      const rtcToken = await fetchRTCToken(channel.channel_name);
      setToken(rtcToken);
      setCalling(true);
    } catch (error) {
      console.error("Failed to join channel:", error);
    }
  };

  useJoin(
    { appid: appId, channel: channel.channel_name, token: token || null, uid: user.id || null },
    calling
  );

  const [micOn, setMic] = useState(false);
  const [cameraOn, setCamera] = useState(false);
  const [screenShareOn, setScreenShareOn] = useState(false); 
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

 
  const { screenTrack, error: screenShareError } = useLocalScreenTrack(screenShareOn, { systemAudio: "include" });
  const [screenVideoTrack, setScreenVideoTrack] = useState(null);
  const [screenAudioTrack, setScreenAudioTrack] = useState(null);

  useTrackEvent(screenVideoTrack, "track-ended", () => {
    console.log("Screen sharing ended");
    setScreenShareOn(false);  
  });
  
  useEffect(() => {
    if (!screenTrack) {
      
      setScreenAudioTrack(null);
      setScreenVideoTrack(null);
    } else {
      
      if (Array.isArray(screenTrack)) {
        setScreenVideoTrack(
          screenTrack.find((track) => track.trackMediaType === "video") || null
        );
        setScreenAudioTrack(
          screenTrack.find((track) => track.trackMediaType === "audio") || null
        );
      } else {
        setScreenVideoTrack(screenTrack);
      }
    }
  }, [screenTrack]);

  usePublish([localMicrophoneTrack, localCameraTrack, screenVideoTrack]);

  const remoteUsers = useRemoteUsers();


  const handleRequestAction = async (request, action) => {
    try {
      const response = await axios.post(
        `${apiClient.defaults.baseURL}/updateRequest.php`,
        {
          channelName: channel.channel_name,
          uid: request.request_id,  
          approved: action === "approve",  
        }
      );
  
      if (response.data.status === "approved" || response.data.status === "rejected") {
        setPendingRequests((prev) =>
          prev.filter((req) => req.request_id !== request.request_id) 
        );
        console.log(`Request ${action}d for UID: ${request.request_id}`);
      } else {
        console.error("Error updating request status:", response.data.error);
      }
    } catch (error) {
      console.error("Error handling request action:", error);
    }
  };

  return (
    <>
    <div className="room">
      {isConnected ? (
        <div className="user-list">
          {/* Render the local user */}
          <div className="user">
            {screenShareOn && screenVideoTrack ? (
              <div className="screen-share">
                <LocalVideoTrack
                  disabled={!screenShareOn}
                  play={screenShareOn}
                  track={screenVideoTrack}
                />
                {screenAudioTrack && (
                  <LocalAudioTrack
                    disabled={!screenShareOn}
                    track={screenAudioTrack}
                  />
                )}
              </div>
            ) : (
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                cover={company.logo}
              >
                <samp className="user-name">You: ({company.company_name})</samp>
              </LocalUser>
            )}
          </div>
          {/* Render remote users */}
          {remoteUsers.map((user) => (
            <div className="user" key={user.uid}>
              <RemoteUser
                cover={applications[0]?.profile_picture_url}
                user={user}
              >
                <samp className="user-name">{applications[0]?.firstname} {applications[0]?.lastname}</samp>
              </RemoteUser>
            </div>
          ))}
        </div>
        
      ) : (
        <>
      <div className="join-room">
      <div className="header" style={{ marginBottom: '35px' }}>
                <div className="logo-container">
                  <img 
                    src={logo}
                    alt="Jobsync Logo" 
                    className="logo" 
                    style={{ width: '150px' }}
                  />
                  <h1 className="title" style={{ fontWeight: '700' }}>JobSync</h1>
                </div>
              </div>
              <div className="welcome-message">
                <h4 style={{color: '#a7a7a7'}}>Welcome to the JobSync Video Conference</h4>
                <p style={{color: '#7b7b7b'}}>To proceed with your one-on-one video conference, please input the designated meeting name.</p>
              </div>
              <input
                onChange={(e) => setChannelName({ channel_name: e.target.value })}
                placeholder="<Your Channel Name>"
                value={channel.channel_name || ""}
              />
        <button
          className={`join-channel ${!channel.channel_name ? "disabled" : ""}`}
          disabled={!channel.channel_name}
          onClick={handleJoin}
        >
          <span>Join Channel</span>
        </button>
        {/* Home link */}
        <div className="link" style={{textAlign: 'end', padding: '5px 10px'}}>
          <a href="/home" className="home-link">
            Back home
          </a>
        </div>
      </div>

        </>
      )}
    </div>
    
    {isConnected && pendingRequests.length > 0 && (
  <div>
    {/* Overlay for Blur Effect */}
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        zIndex: 99,
      }}
    ></div>

    {/* Join Requests Modal */}
    <div className="join-requests">
      <h3>Join Requests:</h3>
      {pendingRequests.map((request) => (
        <div key={request.request_id} className="request-item">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            {/* Profile Picture */}
            <div
              style={{
                width: '100px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
              }}
            >
              <img
                src={request.profile_picture}
                alt="Applicant"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Name and Buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div style={{ textAlign: 'left', marginRight: '10px' }}>
                <h5 className="mb-1">
                  {request.firstname} {request.middlename} {request.lastname}
                </h5>
                <p className="mb-0" style={{ color: '#2d2d2d' }}>
                  {request.schedule}, at {request.time}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRequestAction(request, 'approve')}
                  className="px-3 py-2 shadow me-3"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRequestAction(request, 'reject')}
                  className="px-3 py-2 shadow btn-danger"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}



    {isConnected && (
      <div className="control">
        <div className="left-control">
          <button className="btn1" onClick={() => setMic((a) => !a)}>
            <i className={`i-microphone ${!micOn ? "off" : ""}`} />
          </button>
          <button className="btn1" onClick={() => setCamera((a) => !a)}>
            <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
          </button>
          <button
            className="btn1"
            style={{height: '33px'}}
            onClick={() => setScreenShareOn((prev) => !prev)}
          >
            <FontAwesomeIcon 
              icon={faDesktop} 
              className={!screenShareOn ? "off" : ""} 
              style={{ fontSize: '1.2rem', width: '1.5rem', marginTop: '2px' }} 
            />
          </button>
        </div>
        <button
          className={`btn1 btn-phone ${calling ? "btn-phone-active" : ""}`}
          onClick={() => setCalling((a) => !a)}
        >
          {calling ? <i className="i-phone-hangup" /> : <i className="i-mdi-phone" />}
        </button>
      </div>
    )}
  </>
  );
};

export default Publisher;

