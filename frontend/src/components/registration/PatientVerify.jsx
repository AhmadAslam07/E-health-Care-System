// src/pages/PatientVerify.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PatientVerify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyPatient = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/patients/verify/${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/PatientsLogin"), 3000);
        } else {
          setError(true);
          setStatus(data.message || "Verification failed. Link may have expired.");
        }
      } catch (err) {
        setError(true);
        setStatus("An error occurred. Please try again later.");
      }
    };

    verifyPatient();
  }, [token, navigate]);

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="text-center">
        {!error && <div className="spinner-border text-primary mb-3" role="status"><span className="visually-hidden">Loading...</span></div>}
        <h4 className={error ? 'text-danger' : 'text-success'}>{status}</h4>
      </div>
    </div>
  );
};

export default PatientVerify;
