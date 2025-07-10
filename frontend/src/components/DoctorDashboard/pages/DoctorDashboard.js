import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav } from '../components';
import '../components/docterdashboard.css';

const DoctorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // const doctorImage = user?.image ? `/uploads/${user.image}` : '/images/default-doctor.jpg';

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="row mx-4 my-3">
        <p>
          Home <span style={{ color: "#d21f49 " }}>/ Doctor Dashboard</span>
        </p>
        <h4 className="text-secondary">Dashboard</h4>
      </div>

      {/* Dashboard Components */}
      <div className="container-fluid py-2">
        <div className="row">
          <div className="col-md-3 px-1">
            {/* Doctor Side Navbar */}
            <div className="profile-sidebar">
              <div className="widget-profile pro-widget-content">
                <div className="profile-info-widget">
                  <a href="#" className="booking-doc-img">
                    <img src={`http://localhost:5000/uploads/${user?.image}`} alt="Doctor" />
                  </a>
                  <div className="profile-det-info">
                    <h3>{user?.name || "Doctor Name"}</h3>
                    <div className="patient-details">
                      <h5 className="mb-0">{user?.specialization || "Specialist"}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <SideNav />
              </div>
            </div>
          </div>

          {/* Inside Doctor Dashboard Components */}
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

export default DoctorDashboard;
