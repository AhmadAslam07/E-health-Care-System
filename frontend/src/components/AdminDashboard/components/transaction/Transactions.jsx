import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentsAdmin = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="content container-fluid">
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title">All Appointments</h3>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>Appointment ID</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Specialization</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="8">Loading...</td></tr>
                    ) : appointments.length === 0 ? (
                      <tr><td colSpan="8">No appointments found</td></tr>
                    ) : (
                      appointments.map((appt) => (
                        <tr key={appt.appointment_id}>
                          <td>#{appt.appointment_id}</td>
                          <td>{appt.Patient?.name || 'N/A'}</td>
                          <td>{appt.Doctor?.name || 'N/A'}</td>
                          <td>{appt.Doctor?.specialization || 'N/A'}</td>
                          <td>{new Date(appt.datetime).toLocaleString()}</td>
                          <td>{appt.appointment_type}</td>
                          <td><span className={`badge bg-${appt.status === 'completed' ? 'success' : appt.status === 'scheduled' ? 'info' : 'secondary'}`}>{appt.status}</span></td>
                          <td><span className={`badge bg-${appt.payment_status === 'paid' ? 'success' : 'warning'}`}>{appt.payment_status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsAdmin;
