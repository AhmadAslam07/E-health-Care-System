import React, { useEffect, useState } from 'react';
import "../docterdashboard.css";

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/appointments/doctor`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          const uniquePatients = [];
          const emails = new Set();

          data.forEach(appt => {
            const patient = appt.Patient;
            if (patient && !emails.has(patient.email)) {
              uniquePatients.push(patient);
              emails.add(patient.email);
            }
          });

          setPatients(uniquePatients);
        } else {
          console.error("Failed to load patients:", data.message);
        }
      } catch (err) {
        console.error("Error fetching patients:", err.message);
      }
    };

    fetchPatients();
  }, [token]);

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="patients-tab">
      <div className="row row-grid">
        {patients.map((patient, index) => (
          <div className="col-md-6 col-lg-4 col-xl-3" key={index}>
            <div className="card widget-profile pat-widget-profile">
              <div className="card-body">
                <div className="pro-widget-content">
                  <div className="profile-info-widget">
                    <a href="#/" className="booking-doc-img">
                      <img src="/images/Default.png" alt="User" />
                    </a>
                    <div className="profile-det-info">
                      <h3>{patient.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="patient-info">
                  <ul>
                    <li>Email <span>{patient.email}</span></li>
                    <li>Age <span>{calculateAge(patient.dob)} Years</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
        {patients.length === 0 && (
          <p className="text-muted text-center">No patients found.</p>
        )}
      </div>
    </div>
  );
};

export default MyPatients;
