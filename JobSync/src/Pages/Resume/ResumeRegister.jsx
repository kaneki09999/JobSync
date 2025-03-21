import React, { useState } from 'react';
import axios from 'axios';

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('resume', file);  
  
    try {
      const response = await axios.post(
        'http://localhost:80/capstone-project/jobsync/src/api/upload_resume.php',
        formData
      );
      setProfileData(response.data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Upload Resume PDF</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} className="mb-2" />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>

      {profileData && (
        <div className="mt-4">
          <h3 className="font-semibold">Parsed Profile:</h3>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(profileData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
