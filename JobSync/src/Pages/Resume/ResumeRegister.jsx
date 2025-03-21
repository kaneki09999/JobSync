import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [responseMsg, setResponseMsg] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setResponseMsg('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('http://localhost:80/capstone-project/jobsync/src/api/upload_resume.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data);
      setResponseMsg(res.data.message);
    } catch (err) {
      console.error(err);
      setResponseMsg('Error uploading file.');
    }
  };

  return (
    <div>
      <h2>Upload Resume (PDF)</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{responseMsg}</p>
    </div>
  );
};

export default ResumeUpload;
