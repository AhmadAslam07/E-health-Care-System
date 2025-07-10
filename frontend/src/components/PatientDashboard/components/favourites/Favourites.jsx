import React, { useEffect, useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import "../patientdashboard.css";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/patients/${user.patient_id}/favourites`); // ✅ Hardcoded base URL

        let data;
        try {
          data = await res.json();
        } catch {
          const text = await res.text();
          console.error("Non-JSON response:", text);
          return;
        }

        if (res.ok) {
          setFavourites(data.favourites || []);
        } else {
          console.error("Error fetching favourites:", data.message);
        }
      } catch (err) {
        console.error("Error:", err.message);
      }
    };

    fetchFavourites();
  }, [user.patient_id]);

  return (
    <div className="patients-tab">
      <div className="row row-grid">
        {favourites.length > 0 ? favourites.map((doc, index) => {
          const imageUrl = doc.image
            ? `http://localhost:5000/uploads/${doc.image}`
            : '/images/Default.png';

          return (
            <div className="col-md-6 col-lg-4 col-xl-3" key={index}>
              <div className="card widget-profile pat-widget-profile">
                <div className="card-body">
                  <div className="pro-widget-content">
                    <div className="profile-info-widget">
                      <a href="#/" className="booking-doc-img">
                        <img
                          src={imageUrl}
                          alt={doc.name}
                          onError={(e) => (e.target.src = '/images/Default.png')}
                        />
                      </a>
                      <div className="profile-det-info">
                        <h3>{doc.name}</h3>
                        <div className="patient-details">
                          <h5>{doc.specialization}</h5>
                          <h5 className="mb-0"><FaMapMarker /> {doc.clinicLocation || 'N/A'}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="patient-info">
                    <ul>
                      <li>Experience<span>{doc.experience || 'N/A'}</span></li>
                      <li>Fee<span>{doc.fee || 'N/A'}</span></li>
                    </ul>
                  </div>
                  <div className="main-btn">
                    <button type="button" className="btn book-btn">
                      <Link to="/Doctor" className="btn-link">Book Appointment</Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <p className="text-center text-muted">No favourite doctors yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favourites;
