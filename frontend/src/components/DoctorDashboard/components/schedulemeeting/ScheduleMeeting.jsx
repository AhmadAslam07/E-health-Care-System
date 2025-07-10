import React, { useEffect, useState } from 'react';
import { FaRegEdit, FaPlusCircle, FaTimes } from 'react-icons/fa';
import "../docterdashboard.css";

const ScheduleMeeting = () => {
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSlots = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/clinic/slots/all?doctor_id=${user?.doctor_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (res.ok) setSlots(data);
  };


  useEffect(() => {
    if (user?.doctor_id) fetchSlots();
  }, [user?.doctor_id]);

  const handleSlotSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      doctor_id: user.doctor_id,
      start_time: startTime,
      end_time: endTime
    };

    const url = `${process.env.REACT_APP_API_URL}/clinic/slots${editMode ? `/${editingSlot.slot_id}` : ''}`;
    const method = editMode ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.ok) {
      fetchSlots();
      setStartTime('');
      setEndTime('');
      setEditMode(false);
      setEditingSlot(null);
      document.querySelector('#add_time_slot .btn-close').click();
    } else {
      alert(result.message || 'Error saving slot');
    }
  };

  const handleDelete = async (slot_id) => {
    const confirm = window.confirm("Are you sure you want to delete this slot?");
    if (!confirm) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/clinic/slot/${slot_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert("Slot deleted successfully.");
        fetchSlots();
      } else {
        alert(data.message || "Failed to delete slot.");
      }
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Something went wrong while deleting the slot.");
    }
  };

  const handleEdit = (slot) => {
    setEditMode(true);
    setEditingSlot(slot);
    setStartTime(slot.start_time.slice(0, 16));
    setEndTime(slot.end_time.slice(0, 16));
    document.querySelector('[data-bs-target="#add_time_slot"]').click();
  };

  return (
    <div className="meeting-tab">
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Schedule Timings</h4>
              <div className="profile-box">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label>Timing Slot Duration</label>
                      <select className="form-select form-control" disabled>
                        <option selected>30 mins</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <h5>Time Slots</h5>
                  <button
                    className="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_time_slot"
                    onClick={() => {
                      setEditMode(false);
                      setStartTime('');
                      setEndTime('');
                    }}
                  >
                    <FaPlusCircle /> Add Slot
                  </button>
                </div>

                <div className="doc-times mt-3">
                  {slots.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped text-center align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Booked</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {slots.map((slot, index) => {
                            const start = new Date(slot.start_time);
                            const end = new Date(slot.end_time);
                            return (
                              <tr key={slot.slot_id}>
                                <td>{index + 1}</td>
                                <td>{start.toLocaleDateString()}</td>
                                <td>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>
                                  <span
                                    className={`badge ${slot.is_booked ? 'bg-success' : 'bg-secondary'}`}
                                  >
                                    {slot.is_booked ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-info me-2"
                                    onClick={() => handleEdit(slot)}
                                    title="Edit"
                                  >
                                    <FaRegEdit />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(slot.slot_id)}
                                    title="Delete"
                                  >
                                    <FaTimes />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted">No slots available</p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Slot Modal */}
      <div className="modal fade" id="add_time_slot" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">{editMode ? "Edit Slot" : "Add New Slot"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSlotSubmit}>
                <div className="mb-3">
                  <label className="form-label">Start Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  {editMode ? "Update Slot" : "Save Slot"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
