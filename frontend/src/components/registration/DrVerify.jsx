import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DoctorVerify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyDoctor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify-doctor/${token}`);

        if (res.ok) {
          // Only parse JSON if OK
          const data = await res.json();
          setStatus("Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/DrsLogin"), 3000);
        } else {
          const data = await res.json(); // Read error message only once
          setError(true);
          setStatus(data.message || "Verification failed. Link may have expired.");
        }
      } catch (err) {
        setError(true);
        setStatus("An error occurred. Please try again later.");
      }
    };

    verifyDoctor();
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

export default DoctorVerify;
