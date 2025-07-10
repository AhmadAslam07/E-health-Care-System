import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav } from '../components';
import '../components/patientdashboard.css';
import { fetchWrapper } from '../../../apiIntercepter/intercepter';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user?.patient_id || !token) return;

      const res = await fetchWrapper(
        `${process.env.REACT_APP_API_URL}/patients/${user.patient_id}/details`,
        "GET",
        token
      );

      if (res?.patient) {
        setProfile(res.patient);
      }
    };

    loadProfile();
  }, []);

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="row mx-4 my-3">
        <p>
          Home <span style={{ color: "#d21f49 " }}>/ Patient Dashboard</span>{" "}
        </p>
        <h4 className="text-secondary">Dashboard</h4>
      </div>

      {/* Dashboard Components */}
      <div className="container-fluid py-2">
        <div className="row">
          <div className="col-md-3 px-1">
            {/* Doctor Side Navbar */}
            <div className="profile-sidebar">
              <div class="widget-profile pro-widget-content">
                <div class="profile-info-widget">
                  <a href="#" class="booking-doc-img">
                    <img src="/images/Default.png" alt="User Image" />
                  </a>
                  <div className="profile-det-info">
                    <h3>{profile?.name || "Patient"}</h3>
                  </div>
                </div>
              </div>
              <div class="d-flex align-items-start">
                {/* <DrSideMenu/> */}
                <SideNav />
              </div>
            </div>
          </div>

          {/*  inside Doctor Dashboard Components*/}
          <div className="col-md-9 right-tab">
            <div class="tab-content">

              <Outlet />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default PatientDashboard