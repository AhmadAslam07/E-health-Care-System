import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaClock, FaCheck, FaTimes, FaFlask, FaEdit, FaEye } from 'react-icons/fa';
import "../docterdashboard.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFile, setReportFile] = useState(null);
  const token = localStorage.getItem('token');
  const API_URL = "http://localhost:5000";

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/appointments/doctor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const fetchPrescriptions = async (appointment_id) => {
    try {
      const res = await fetch(`${API_URL}/api/appointments/prescriptions/${appointment_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.prescriptions)) {
        setPrescriptions(data.prescriptions);
        setSelectedAppt(appointment_id);
        setShowPrescriptions(true);
      }
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment status:", err);
    }
  };

  const handleUploadReport = async () => {
    if (!reportFile || !selectedAppt) return;

    const patientId = appointments.find(a => a.appointment_id === selectedAppt)?.patient_id;
    const formData = new FormData();
    formData.append("reports", reportFile);
    formData.append("appointment_id", selectedAppt);

    try {
      const res = await fetch(`${API_URL}/api/reports/upload/${patientId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert("Lab report uploaded.");
        setReportFile(null);
        setShowReportModal(false);
        setSelectedAppt(null);
        fetchAppointments();
      } else {
        alert("Failed to upload lab report.");
      }
    } catch (err) {
      console.error("Error uploading lab report:", err);
    }
  };

  const renderStatusBadge = (status) => {
    const badgeMap = {
      pending: 'badge bg-secondary',
      scheduled: 'badge bg-warning text-dark',
      completed: 'badge bg-success',
      canceled: 'badge bg-danger'
    };
    return <span className={badgeMap[status] || 'badge bg-light'}>{status}</span>;
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="appoint-tab">
      <div className="appointments">
        {appointments.length > 0 ? appointments.map((appt) => (
          <div className="appointment-list" key={appt.appointment_id}>
            <div className="d-flex justify-content-between align-items-start">
              <div className="profile-det-info">
                <h3>{appt.Patient?.name || "Patient"}</h3>
                <div className="patient-details">
                  <h5><FaClock /> {new Date(appt.datetime).toLocaleString()}</h5>
                  <h5><FaEnvelope /> {appt.Patient?.email}</h5>
                  <h5>Status: {renderStatusBadge(appt.status)}</h5>
                  <h5>Payment: <span className={`badge ${appt.payment_status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>{appt.payment_status}</span></h5>

                  <h5>Prescription:
                    <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => fetchPrescriptions(appt.appointment_id)}>
                      View Prescription
                    </button>
                  </h5>

                  <h5>Lab Report:
                    <button
                      className="btn btn-sm btn-outline-success ms-2"
                      onClick={() => {
                        setSelectedAppt(appt.appointment_id);
                        setShowReportModal(true);
                      }}>
                      {appt.lab_report ? <><FaEdit /> Edit Report</> : <><FaFlask /> Add Report</>}
                    </button>
                    {appt.lab_report && (
                      <>
                        <a
                          href={`${API_URL}${appt.lab_report}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary ms-2"
                        >
                          <FaEye /> View
                        </a>
                        <div className="text-muted small mt-1">Uploaded on: {new Date(appt.updatedAt || appt.datetime).toLocaleString()}</div>
                      </>
                    )}
                  </h5>
                </div>
              </div>
              <div className="appointment-action text-end">
                {appt.status === 'pending' && (
                  <>
                    <button className="btn btn-sm btn-success mb-1" onClick={() => updateStatus(appt.appointment_id, 'scheduled')}>
                      Accept
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => updateStatus(appt.appointment_id, 'canceled')}>
                      <FaTimes /> Cancel
                    </button>
                  </>
                )}
                {appt.status === 'scheduled' && (
                  <>
                    {appt.appointment_type === 'video' ? (
                      <Link
                        to={`/video-call/room-${appt.patient_id}-${appt.doctor_id}/${appt.appointment_id}`}
                        className="btn btn-sm btn-danger mb-1"
                      >
                        Start Call
                      </Link>
                    ) : (
                      <p className="text-muted">In-clinic</p>
                    )}
                    <button className="btn btn-sm btn-success me-2" onClick={() => updateStatus(appt.appointment_id, 'completed')}>
                      <FaCheck /> Complete
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => updateStatus(appt.appointment_id, 'canceled')}>
                      <FaTimes /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )) : <p className="text-muted text-center">No appointments found.</p>}
      </div>

      {showPrescriptions && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Prescriptions</h5>
                <button className="btn-close" onClick={() => setShowPrescriptions(false)}></button>
              </div>
              <div className="modal-body">
                {prescriptions.length === 0 ? (
                  <p>No prescriptions available.</p>
                ) : (
                  <div className="row">
                    {prescriptions.map(presc => (
                      <div key={presc.prescription_id} className="col-md-6 mb-3">
                        <img src={`${API_URL}${presc.file_path}`} alt={presc.file_name} className="img-fluid rounded shadow-sm" />
                        <p className="text-muted small mt-2">Uploaded on: {new Date(presc.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Lab Report</h5>
                <button className="btn-close" onClick={() => setShowReportModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*,application/pdf"
                  onChange={(e) => setReportFile(e.target.files[0])}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUploadReport}>Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
