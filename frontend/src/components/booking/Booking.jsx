import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from "react-icons/fa";
import './booking.css';

const Booking = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentType, setAppointmentType] = useState('video');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/clinic/slots`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok) {
          setSlots(data);
        } else {
          setError(data.message || "Failed to fetch slots");
        }
      } catch (err) {
        setError("Error fetching slots.");
      }
    };

    fetchSlots();
  }, []);

  const handleBooking = async () => {
    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          slot_id: selectedSlot.slot_id,
          appointment_type: appointmentType
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Appointment booked successfully!");
        setError(null);
      } else {
        setError(data.message || "Failed to book appointment");
      }
    } catch (err) {
      setError("Server error during booking.");
    }
  };

  return (
    <div className='container my-5'>
      <div className="row">
        <div className="col-md-7 mb-4">
          <div className="border rounded-3 shadow-sm p-3">
            <h5 className="mb-3">
              <FaMapMarkerAlt /> Available Slots
            </h5>
            {slots.length > 0 ? (
              <div className="list-group">
                {slots.map(slot => (
                  <button
                    key={slot.slot_id}
                    className={`list-group-item list-group-item-action ${selectedSlot?.slot_id === slot.slot_id ? 'active' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <strong>{slot.Doctor?.name || 'Doctor'}</strong> &nbsp;
                    <small className="text-muted">({slot.Doctor?.specialization})</small><br />
                    {new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleString()}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted">No available slots found.</p>
            )}
          </div>
        </div>

        <div className="col-md-5">
          <div className="border rounded-3 shadow-sm p-3">
            <h5 className="mb-3">Appointment Type</h5>
            <select
              className="form-select mb-3"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
            >
              <option value="video">Video</option>
              <option value="in_clinic">In Clinic</option>
            </select>

            <button
              className="btn btn-danger w-100"
              onClick={handleBooking}
              disabled={!selectedSlot}
            >
              Confirm Appointment
            </button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {success && <div className="alert alert-success mt-3">{success}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
