import React, { useState, useEffect } from 'react';
import { FaUser, FaKey } from "react-icons/fa";
import { postToEndpoint } from '../../components/apiService';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth(); 
  console.log("User in id:", user); 

  const referrer = '/admindashboard';
  useEffect(() => {
    if (user) {
      navigate(referrer);
    }
  }, [user, navigate, referrer]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postToEndpoint("/AdminLogin.php", {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data));  
        login(response.data);  
        navigate(referrer); 
    } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <>
    {loading && (
        <div id="preloader">
        </div>
      )}
    <div className="wrapper">
      <div className="logo">
        <img src="/assets/logo jobsync2.png" alt="Admin Logo" />
      </div>
      <div className="text-center mt-4 name">Admin Login</div>

      {error && <p className="error-message text-danger">{error}</p>}

      <form className="p-3 mt-3" onSubmit={handleSubmit}>
        <div className="form-field">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <FaKey className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn mt-3">Login</button>
      </form>

      <div className="text-center fs-6">
        <a href="#">Forgot password?</a>  
      </div>
    </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Poppins', sans-serif;
          }

          body {
              background: #ecf0f3;
          }

          .wrapper {
              width: 700px;
              min-height: 500px;
              margin: 80px auto;
              padding: 40px 30px 30px 30px;
              background-color: #ecf0f3;
              border-radius: 15px;
              box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #fff;
          }

          .logo {
              width: 80px;
              margin: auto;
          }

          .logo img {
              width: 100%;
              height: 80px;
              object-fit: cover;
              border-radius: 50%;
              box-shadow: 0px 0px 3px #5f5f5f,
                  0px 0px 0px 5px #ecf0f3,
                  8px 8px 15px #a7aaa7,
                  -8px -8px 15px #fff;
          }

          .wrapper .name {
              font-weight: 600;
              font-size: 1.4rem;
              letter-spacing: 1.3px;
              padding-left: 10px;
              color: #555;
          }

          .form-field {
              padding-left: 10px;
              margin-bottom: 20px;
              border-radius: 20px;
              box-shadow: inset 8px 8px 8px #cbced1, inset -8px -8px 8px #fff;
              display: flex;
              align-items: center;
          }

          .form-field input {
              width: 100%;
              border: none;
              outline: none;
              background: none;
              font-size: 1.2rem;
              color: #666;
              padding: 10px 15px 10px 10px;
          }

          .icon {
              margin-right: 10px;
              color: #555;
          }

          .btn {
              width: 100%;
              height: 40px;
              background-color: #03A9F4;
              color: #fff;
              border-radius: 25px;
              box-shadow: 3px 3px 3px #b1b1b1, -3px -3px 3px #fff;
              letter-spacing: 1.3px;
              border: none;
              cursor: pointer;
          }

          .btn:hover {
              background-color: #039BE5;
          }

          .text-center a {
              text-decoration: none;
              font-size: 0.8rem;
              color: #03A9F4;
          }

          .text-center a:hover {
              color: #039BE5;
          }

          @media(max-width: 380px) {
              .wrapper {
                  margin: 30px 20px;
                  padding: 40px 15px 15px 15px;
              }
          }
        `}
      </style>
    </>
  );
}
