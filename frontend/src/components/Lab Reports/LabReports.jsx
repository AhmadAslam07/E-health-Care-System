import React, { useEffect, useState } from 'react';

const PrescriptionCards = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [newPrescription, setNewPrescription] = useState(null);

  const [showFullPrescModal, setShowFullPrescModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [showFullLabModal, setShowFullLabModal] = useState(false);
  const [selectedLabReport, setSelectedLabReport] = useState(null);

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, prescRes, reportRes] = await Promise.all([
        fetch(`${API_URL}/api/appointments/patient`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/appointments/prescriptions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/reports/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const appts = await apptRes.json();
      const prescs = await prescRes.json();
      const reports = await reportRes.json();

      if (apptRes.ok) setAppointments(appts);
      if (prescRes.ok) setPrescriptions(prescs.prescriptions || []);
      if (reportRes.ok) setLabReports(reports.reports || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleOpenModal = (appointmentId) => {
    setSelectedApptId(appointmentId);
    setShowModal(true);
  };

  const handleUploadPrescription = async () => {
    if (!newPrescription || !selectedApptId) return;

    const formData = new FormData();
    formData.append("prescriptions", newPrescription);

    try {
      const res = await fetch(`${API_URL}/api/appointments/${selectedApptId}/prescriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setShowModal(false);
        setNewPrescription(null);
        setSelectedApptId(null);
        fetchData();
      } else {
        alert("Failed to upload prescription.");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const getPrescriptionsByAppointment = (appointmentId) =>
    prescriptions.filter(p => p.appointment_id === appointmentId);

  const getCleanUrl = (filePath) =>
    `${API_URL}${filePath.startsWith('/api') ? filePath.replace('/api', '') : filePath}`;

  const handleViewFull = (prescription) => {
    setSelectedPrescription(prescription);
    setShowFullPrescModal(true);
  };

  const handleViewFullLab = (appointment) => {
    const report = labReports.find(r => r.appointment_id === appointment.appointment_id);
    if (report) {
      setSelectedLabReport({
        ...report,
        file_path: report.file_path,
        file_name: report.file_name,
        createdAt: report.createdAt
      });
    } else {
      setSelectedLabReport({
        file_path: appointment.lab_report,
        file_name: "Lab Report",
        createdAt: appointment.updatedAt || appointment.datetime
      });
    }
    setShowFullLabModal(true);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">My Prescriptions & Lab Reports</h3>
      <div className="row">
        {appointments.length === 0 ? (
          <p className="text-muted">No appointments found.</p>
        ) : (
          appointments.map(appt => {
            const relatedPrescs = getPrescriptionsByAppointment(appt.appointment_id);

            return (
              <div key={appt.appointment_id} className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Dr. {appt.Doctor?.name || 'N/A'}</h5>
                    <p><strong>Date:</strong> {new Date(appt.datetime).toLocaleString()}</p>
                    <p><strong>Type:</strong> {appt.appointment_type.replace("_", " ")}</p>

                    <h6 className="mt-3">Prescriptions:</h6>
                    {relatedPrescs.length > 0 ? (
                      <div className="row">
                        {relatedPrescs.map(presc => (
                          <div key={presc.prescription_id} className="col-6 mb-3">
                            <img
                              src={getCleanUrl(presc.file_path)}
                              alt={presc.file_name}
                              className="img-fluid rounded"
                              style={{ maxHeight: '180px', objectFit: 'cover' }}
                              onError={(e) => (e.target.src = "/images/Default.png")}
                            />
                            <span
                              className="d-block mt-1 text-primary text-center"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleViewFull(presc)}
                            >
                              View Full
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No prescriptions yet.</p>
                    )}

                    <button
                      className="btn btn-outline-secondary btn-sm mt-2"
                      onClick={() => handleOpenModal(appt.appointment_id)}
                    >
                      Add Prescription
                    </button>

                    <h6 className="mt-3">Lab Reports:</h6>
                    {appt.lab_report ? (
                      <div className="mt-3">
                        <img
                          src={`http://localhost:5000${appt.lab_report}`}
                          alt="Lab Report"
                          className="img-fluid rounded"
                          style={{ maxHeight: '180px', objectFit: 'cover' }}
                          onError={(e) => (e.target.src = "/images/Default.png")}
                        />
                        <span
                          className="d-block mt-2 text-primary text-center"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleViewFullLab(appt)}
                        >
                          View Full
                        </span>
                      </div>
                    ) : (
                      <p className="text-muted">No lab reports yet.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Prescription</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setNewPrescription(e.target.files[0])}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUploadPrescription}>Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Prescription Modal */}
      {showFullPrescModal && selectedPrescription && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxWidth: '80%' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Prescription Details</h5>
                <button className="btn-close" onClick={() => setShowFullPrescModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={getCleanUrl(selectedPrescription.file_path)}
                  alt={selectedPrescription.file_name}
                  className="img-fluid mb-3"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
                <p className="text-muted">
                  Uploaded on: {new Date(selectedPrescription.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Lab Report Modal */}
      {showFullLabModal && selectedLabReport && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered" style={{ maxWidth: '80%' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Lab Report Details</h5>
                <button className="btn-close" onClick={() => setShowFullLabModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={`http://localhost:5000${selectedLabReport.file_path}`}
                  alt={selectedLabReport.file_name}
                  className="img-fluid mb-3"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
                <p className="text-muted">
                  Uploaded on: {new Date(selectedLabReport.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionCards;
