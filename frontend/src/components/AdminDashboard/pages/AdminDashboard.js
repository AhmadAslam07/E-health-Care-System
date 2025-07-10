import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav } from '../components';
import '../components/admindashboard.css';

const PatientDashboard = () => {
  const [admin, setAdmin] = useState({ name: '', email: '' });

  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse admin data:', err);
      }
    }
  }, []);

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="row mx-4 my-3">
        <p>
          Home <span style={{ color: "#d21f49 " }}>/ Admin Dashboard</span>
        </p>
        <h4 className="text-secondary">Dashboard</h4>
      </div>

      {/* Dashboard Components */}
      <div className="container-fluid py-2">
        <div className="row">
          <div className="col-md-3 px-1">
            {/* Admin Side Navbar */}
            <div className="profile-sidebar">
              <div className="widget-profile pro-widget-content">
                <div className="profile-info-widget">
                  <a href="#" className="booking-doc-img">
                    <img src="/images/admin1.jpg" alt="Admin" />
                  </a>
                  <div className="profile-det-info">
                    <h3>{admin.name}</h3>
                    <div className="patient-details">
                      <h5 className="mb-0">{admin.email}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <SideNav />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-md-9 right-tab">
            <div className="tab-content">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
