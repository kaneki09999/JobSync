import React, { useState, useEffect } from "react";
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
import { useLocation, useParams } from "react-router-dom";
import "../css/video.css";
import logo from "../assets/logo3.png";
import { useAuth } from "../AuthContext";
import { postToEndpoint } from '../components/apiService';
import Swal from "sweetalert2"; 
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import apiClient from "../components/apiClient";

export const Subscriber = () => {
  const { user } = useAuth();
  const { job_id, application_id } = useParams();
  const [calling, setCalling] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const isConnected = useIsConnected();
  const [appId] = useState("969528b81d9d47f49fe811e371eb1510");
  const [channel, setChannel] = useState("");
  const [token, setToken] = useState("");
  const [uid, setUid] = useState(null);
  const [company, setCompany] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const JOIN_REQUEST_URL = `${apiClient.defaults.baseURL}/joinRequest.php`;
  const APPROVED_REQUEST_URL = `${apiClient.defaults.baseURL}/approvedRequest.php`;
  const TOKEN_FETCH_URL = `${apiClient.defaults.baseURL}/generateToken.php`;
  const DELETE_REQUEST_URL = `${apiClient.defaults.baseURL}/deleteRequest.php`;

  const handleCancel = async () => {
    try {
      const response = await fetch(DELETE_REQUEST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: job_id,
          application_id: application_id,
          channel
        }),
      });
  
      const data = await response.json();
      if (data.status === "success") {
        setPendingApproval(false); 
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error canceling request:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while canceling the request.",
        confirmButtonText: "OK",
      });
    }
  };
  
  const sendJoinRequest = async (channel) => {
    try {
      const response = await fetch(JOIN_REQUEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, application_id, job_id }),
      });
      const data = await response.json();
      if (data.status === "pending") {
        setPendingApproval(true);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error sending join request:", error);
    }
  };

  const fetchRTCToken = async (channel) => {
    try {
      const uid = Math.floor(Math.random() * 100000);
      setUid(uid);
      const response = await fetch(
        `${TOKEN_FETCH_URL}?channelName=${channel}&uid=${uid}&role=subscriber`
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
      setLoading(true);
      const response = await fetch(
        `${apiClient.defaults.baseURL}/checkChannelExists.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channel_name: channel,
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
        setLoading(false);
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
      setLoading(false);
      return false;
    }
  };
  
  
  const handleJoin = async () => {
    setLoading(true);
    const channelExists = await checkIfChannelExists(channel, application_id, job_id);
    if (!channelExists) return;  
  
    try {
      await sendJoinRequest(channel);
      
      const approvalCheckInterval = setInterval(async () => {
        const response = await fetch(
          `${APPROVED_REQUEST_URL}?channel=${channel}&uid=${application_id}&job_id=${job_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ channel, application_id, job_id }),
          }
        );
  
        const data = await response.json();
  
        if (data.status === "approved") {
          clearInterval(approvalCheckInterval);
          setPendingApproval(false);
          const rtcToken = await fetchRTCToken(data.channel_name);
          setToken(rtcToken);
          setCalling(true);
          setLoading(false);
        } else if (data.status === "rejected") {
          clearInterval(approvalCheckInterval);
          setPendingApproval(false);
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Request Rejected",
            text: "Your request to join was rejected by the host.",
            confirmButtonText: "OK",
          });
        } else if (data.error) {
          console.error("Approval Error:", data.error);
          setLoading(false);
        }
      }, 3000);
    } catch (error) {
      console.error("Failed to join channel:", error);
      setLoading(false);
    }
  };
  
  
  useJoin(
    { appid: appId, channel: channel, token: token || null, uid: uid || null },
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

  return (
    <>
      <div className="room">
        {isConnected ? (
          <div className="user-list">
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
                cover={applications[0]?.profile_picture_url}
              >
                <samp className="user-name">You: ({applications[0]?.firstname} {applications[0]?.lastname})</samp>
              </LocalUser>
            )}
          </div>
          {remoteUsers.map((user) => (
              <div className="user" key={user.uid}>
                <RemoteUser
                  cover={company.logo}
                  user={user}
                >
                  <samp className="user-name">{company.company_name}</samp>
                </RemoteUser>
              </div>
            ))}
          </div>
        ) : pendingApproval ? (
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
                onChange={(e) => setChannel(e.target.value)}
                placeholder="Company Name-5f9JCv5d2El2sdte4WkAnuqaXiY0LNG"
                value={channel}
              />
              <button
                className={`join-channel ${!channel ? "disabled" : ""}`}
                disabled={!channel}
                onClick={handleJoin}
              >
                <span>Request to Join</span>
              </button>
              {/* Home link */}
              <div className="link" style={{ textAlign: 'end', padding: '5px 10px' }}>
                <a href="/" className="home-link">
                  Back home
                </a>
              </div>
            </div>
          <div>
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
      
          <div className="join-requests" style={{backgroundColor: '#d9d9d978', width: "30%"}}>
            <h4 style={{color: 'white', marginTop: '30px'}}>Waiting for host approval...</h4>
            <button
                style={{color: '#e03131', background: '#f99bab', marginTop: '30px', border: 'none'}}
                onClick={handleCancel}
              >
                <span>Cancel</span>
              </button>
          </div>
        </div>
        </>
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
                onChange={(e) => setChannel(e.target.value)}
                placeholder="Company Name-5f9JCv5d2El2sdte4WkAnuqaXiY0LNG"
                value={channel}
              />
               <button
                  className={`join-channel ${!channel ? "disabled" : ""}`}
                  disabled={!channel || loading}
                  style={{background: loading && '#5076ab',
                          border: 'none'}}
                  onClick={handleJoin}
                >
                  {loading ? <div className="loading-message">Joining...</div> : <span>Request to Join</span>}
                </button>
              {/* Home link */}
              <div className="link" style={{ textAlign: 'end', padding: '5px 10px' }}>
                <a href="/" className="home-link">
                  Back home
                </a>
              </div>
            </div>
          </>
        )}
      </div>
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
              className={`fa ${!screenShareOn ? "off" : ""}`} 
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

export default Subscriber;
