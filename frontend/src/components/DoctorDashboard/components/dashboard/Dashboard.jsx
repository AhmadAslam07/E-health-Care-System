import React, { useEffect, useState } from 'react';
import { fetchWrapper } from '../../../../apiIntercepter/intercepter';
import '../docterdashboard.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const loadAppointments = async () => {
      const token = localStorage.getItem("token");
      const res = await fetchWrapper(
        `${process.env.REACT_APP_API_URL}/appointments/doctor`,
        "GET",
        token
      );

      if (Array.isArray(res)) {
        setAppointments(res);

        const today = new Date().toISOString().split("T")[0];
        const todayAppointments = res.filter(app =>
          app.datetime.startsWith(today)
        );
        setTodayCount(todayAppointments.length);
      }
    };

    loadAppointments();
  }, []);

  return (
    <div className="tab-pane fade show active">
      <div className="card dash-card progres-bats">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12 col-lg-4 pe-3">
              <div className="dash-widget dct-border-rht">
                <div className="circle-bar circle-bar1">
                  <div className="circle-graph1">
                    <img src='/images/total-patient.png' alt="" />
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6>Total Patients</h6>
                  <h3>{appointments.length}</h3>
                  <p className="text-muted">Till Today</p>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-4 pe-3">
              <div className="dash-widget dct-border-rht">
                <div className="circle-bar circle-bar2">
                  <div className="circle-graph2">
                    <img src='/images/patient-today.png' alt="" />
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6>Today Patients</h6>
                  <h3>{todayCount}</h3>
                  <p className="text-muted">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-4">
              <div className="dash-widget">
                <div className="circle-bar circle-bar3">
                  <div className="circle-graph3">
                    <img src='/images/appointment.png' alt="" />
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6>Appointments</h6>
                  <h3>{appointments.length}</h3>
                  <p className="text-muted">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <h4 className="text-start">Patient Appointments</h4>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt, idx) => (
                <tr key={idx}>
                  <td>{appt.Patient?.name || appt.patient_id}</td>
                  <td>{new Date(appt.datetime).toLocaleString()}</td>
                  <td>{appt.appointment_type}</td>
                  <td>{appt.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No appointments yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
