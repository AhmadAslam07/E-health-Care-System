import React, { useEffect, useState } from "react";
import "./about.css";
import { FaBed } from "react-icons/fa";
import Testimonial from "../testimonial/Testimonial";

const About = () => {
  const [stats, setStats] = useState({
    pending: 0,
    scheduled: 0,
    totalPatients: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/analytics/patient-stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="row mx-4 my-3">
        <p>
          Home <span style={{ color: "#d21f49 " }}>/ About Us</span>
        </p>
        <h4 className="text-secondary">About Us</h4>
      </div>

      {/* Banner Section */}
      <div className="container-fluid">
        <div className="about-banner">
          <div className="row mx-5">
            <div className="col-md-6">
              <h4 className="text-secondary ps-1 pt-4">About Us</h4>
              <p>
                Welcome to our e-Healthcare system, where we believe that quality healthcare should be accessible to everyone, anytime, and anywhere. Our platform bridges the gap between patients and healthcare providers through seamless, user-friendly services like online consultations, appointment scheduling, and personalized medical records. By leveraging the latest digital health tech, we aim to deliver efficient, transparent, and patient-centered care. Your health journey is our top priority.
              </p>
            </div>
            <div className="col-md-6"></div>
          </div>
        </div>
      </div>

      {/* Doctors Info Cards */}
      <div className="container clear-section">
        <div className="row">
          {[...Array(3)].map((_, i) => (
            <div className="col-md-4 category-col" key={i}>
              <div className="category-subox pb-0 d-flex flex-wrap">
                <h4>Visit a Doctor</h4>
                <p>
                  We hire the best specialists to deliver top-notch diagnostic services for you.
                </p>
                <div className="subox-img">
                  <div className="subox-circle">
                    <FaBed className="icon-img" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Patient Record Section */}
      <div className="container-fluid patient-record">
        <div className="under-lay">
          <div className="row py-5 text-white">
            <div className="col-md-3">
              <h3 className="heading-element ms-4">
                Numbers of Patient's we Treated.
              </h3>
            </div>
            <div className="col-md-3 text-center">
              <h1 className="heading-element">{stats.pending}</h1>
              <span>Recent Patients</span>
            </div>
            <div className="col-md-3 text-center">
              <h1 className="heading-element">{stats.scheduled}</h1>
              <span>Active Patients</span>
            </div>
            <div className="col-md-3 text-center">
              <h1 className="heading-element">{stats.totalPatients}</h1>
              <span>Total Patients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-5">
        <Testimonial />
      </div>
    </div>
  );
};

export default About;
