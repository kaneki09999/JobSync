import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBriefcase, FaGraduationCap, FaCogs, FaClipboardCheck, FaCertificate, FaLanguage, FaEdit, FaSuitcase } from "react-icons/fa";
import { postToEndpoint, getFromEndpoint } from "../../../components/apiService";
import { useAuth } from "../../../AuthContext";

export default function Qualifications() {
  const { user } = useAuth();
  const [qualifications, setQualifications] = useState({
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    jobPreferences: [],
  });

  useEffect(() => {
    fetchQualifications();
  }, []);

  const fetchQualifications = async () => {
    try {
      const response = await getFromEndpoint(`/GetQualifications.php?applicant_id=${user.id}`);
      if (response.data.status === "success") {
        setQualifications(response.data.qualifications);
      } else {
        console.error("Error fetching data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching qualifications:", error);
    }
  };

  const [activeForm, setActiveForm] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    workExperience: { jobTitle: "", yearsOfExperience: "" },
    education: { degree: "", fieldOfStudy: "" },
    skills: { skillName: "", yearsOfExperience: "" },
    certifications: { certificationName: "" },
    languages: { language: "", proficiency: "" },
    jobPreferences: { jobTitle: "", minBasePay: "", jobType: "" },
  });

  const handleInputChange = (e, key) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]: value,
      },
    }));
  };

  const handleCancel = () => {
    setActiveForm(null);
    setEditingEntry(null);
    setNewEntry({
      workExperience: { jobTitle: "", yearsOfExperience: "" },
      education: { degree: "", fieldOfStudy: "" },
      skills: { skillName: "", yearsOfExperience: "" },
      certifications: { certificationName: "" },
      languages: { language: "", proficiency: "" },
      jobPreferences: { jobTitle: "", minBasePay: "", jobType: "" },
    });
  };

  const handleAddOrUpdateEntry = async (key) => {
    if (editingEntry && editingEntry.id) {
      setQualifications((prev) => ({
        ...prev,
        [key]: prev[key].map((entry) =>
          entry.id === editingEntry.id ? { ...newEntry[key], id: editingEntry.id } : entry
        ),
      }));
    } else {
      setQualifications((prev) => ({
        ...prev,
        [key]: [...prev[key], { ...newEntry[key], id: Date.now() }],
      }));
    }

    const entryData = { 
      ...newEntry[key], 
      qualificationType: key, 
      applicant_id: user.id 
    };

    try {
      const response = await postToEndpoint("/AddQualification.php", entryData);
      if (response.data.status === "success") {
        console.log("Data saved successfully");
      } else {
        console.error("Error saving data: ", response.data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }

    setNewEntry({
      ...newEntry,
      [key]: Object.keys(newEntry[key]).reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
    });
    setActiveForm(null);
    setEditingEntry(null);
  };

  const handleEditEntry = (key, entry) => {
    const { id, created_at, applicant_id, ...entryWithoutId } = entry;
    setNewEntry((prev) => ({
      ...prev,
      [key]: { ...entryWithoutId },
    }));
    setEditingEntry(entry);
    setActiveForm(key);
  };

  const sections = [
    { label: "Work Experience", icon: <FaBriefcase />, key: "workExperience" },
    { label: "Education", icon: <FaGraduationCap />, key: "education" },
    { label: "Skills", icon: <FaCogs />, key: "skills" },
    { label: "Languages", icon: <FaLanguage />, key: "languages" },
    { label: "Certifications", icon: <FaCertificate />, key: "certifications" },
    { label: "Job Preferences", icon: <FaSuitcase />, key: "jobPreferences" },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "0px 20px", borderRadius: "8px", textAlign: "left", height: "550px", overflowY: "auto" }}>
      <h4 style={{ marginBottom: "10px", textAlign: "left", fontSize: '28px' }}>Qualifications</h4>
      <p style={{ marginBottom: "20px", color: "#555", textAlign: "left" }}>
        Using your unique skills and experience, we refine job recommendations to connect you with the most suitable opportunities on JobSync.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", position: "relative" }}>
        {sections.map((item, index) => (
          <div key={index} style={{ width: "calc(50% - 7.5px)", padding: "10px 15px", background: "#f9f9f9", borderRadius: "5px", alignSelf: "flex-start", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "16px", color: "#333", display: "flex", alignItems: "center" }}>
                {item.icon} <strong style={{ marginLeft: "8px" }}>{item.label}</strong>
              </div>
              <button
                style={{ background: "#007bff", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "50%", cursor: "pointer", fontSize: "11px" }}
                onClick={() => setActiveForm(item.key)}
              >
                +
              </button>
            </div>
            {qualifications[item.key] && Array.isArray(qualifications[item.key]) ? (
            qualifications[item.key].map((entry) => (
              <div key={entry.id} style={{ marginTop: "10px", padding: "5px", background: "#ffffff", borderRadius: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  {Object.entries(entry)
                    .filter(([key]) => key !== "id" && key !== "created_at" && key !== "applicant_id")  
                    .map(([, value]) => value)
                    .join(" - ")}
                </span>
                <FaEdit
                  onClick={() => handleEditEntry(item.key, entry)}
                  style={{ cursor: "pointer", color: "#007bff", marginLeft: "10px" }}
                />
              </div>
            ))
            ) : (
              <p>No {item.label} added yet.</p>
            )}
            {activeForm === item.key && (
              <div style={{
                position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", padding: "20px", boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)", borderRadius: "10px", zIndex: "99999", width: "400px",
              }}>
                <h3 style={{ marginBottom: "10px" }}>Add {item.label}</h3>
                {Object.keys(newEntry[item.key]).map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    value={newEntry[item.key][field]}
                    onChange={(e) => handleInputChange(e, item.key)}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                  />
                ))}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button
                    onClick={handleCancel}
                    style={{ height: "40px",
                    fontSize: "12px",
                    borderRadius: "3px",
                    width: "75px",
                    color: "#156ad7",
                    background: "#bce0ff",
                    border: "none",
                    fontWeight: "700",}}>
                    Close
                  </button>
                  <button onClick={() => handleAddOrUpdateEntry(item.key)} style={{  width: "80px",
                            height: "40px",
                            fontSize: "12px",
                            borderRadius: "3px",
                            background: "#156ad7",
                            fontWeight: "500", }}>
                    {editingEntry && editingEntry.id ? "Update" : "Save"}
                  </button>   
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {activeForm && (
        <div
          onClick={() => setActiveForm(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "9999",
          }}
        ></div>
      )}
    </div>
  );
}
