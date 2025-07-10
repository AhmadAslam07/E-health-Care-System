import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('500.00');

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/appointments/patient`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const handlePrescriptionSubmit = async () => {
    if (!prescriptionFile || !selectedApptId) return;

    const formData = new FormData();
    for (let file of prescriptionFile) {
      formData.append('prescriptions', file);
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/appointments/${selectedApptId}/prescriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setShowModal(false);
        setPrescriptionFile(null);
        setSelectedApptId(null);
        fetchAppointments();
      } else {
        console.error("Failed to upload prescriptions");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleOpenModal = (appointmentId) => {
    setSelectedApptId(appointmentId);
    setShowModal(true);
  };

  const handlePayNowClick = (appointmentId) => {
    setSelectedApptId(appointmentId);
    setPaymentAmount('500.00');
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = () => {
    if (!paymentAmount || parseFloat(paymentAmount) < 1) {
      alert("Please enter a valid amount (minimum 1.00)");
      return;
    }
    window.open(
      `http://localhost:5000/api/payments/payfast/redirect/${selectedApptId}?amount=${paymentAmount}`,
      '_blank'
    );
    setShowPaymentModal(false);
  };

  return (
    <div className="container my-4">
      <h4>My Appointments</h4>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Action</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.appointment_id}>
                <td>{appt.Doctor?.name || 'N/A'}</td>
                <td>{new Date(appt.datetime).toLocaleString()}</td>
                <td>{appt.appointment_type.replace('_', ' ')}</td>
                <td>
                  <span className={`badge ${appt.status === 'scheduled'
                    ? 'bg-success'
                    : appt.status === 'pending'
                      ? 'bg-warning text-dark'
                      : appt.status === 'completed'
                        ? 'bg-secondary'
                        : 'bg-danger'}`}>
                    {appt.status}
                  </span>
                </td>
                <td>
                  {appt.payment_status === 'paid' ? (
                    <span className="badge bg-success">Paid</span>
                  ) : appt.status === 'scheduled' ? (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handlePayNowClick(appt.appointment_id)}
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  {appt.appointment_type === 'video' &&
                    appt.status === 'scheduled' &&
                    appt.payment_status === 'paid' ? (
                    <Link
                      to={`/video-call/room-${appt.patient_id}-${appt.doctor_id}/${appt.appointment_id}`}
                      className="btn btn-danger btn-sm"
                    >
                      Start Call
                    </Link>
                  ) : (
                    <span className="text-muted">No action</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleOpenModal(appt.appointment_id)}
                  >
                    Add Prescription
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Prescription Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Prescription</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setPrescriptionFile(e.target.files)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handlePrescriptionSubmit}>Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Payment Amount</h5>
                <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handlePaymentSubmit}>Proceed to Pay</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
