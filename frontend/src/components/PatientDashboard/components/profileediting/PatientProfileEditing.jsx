import React, { useState, useEffect } from "react";
import "../patientdashboard.css";

const ProfileEditing = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    contact_info: ""
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch patient details to prefill form
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/patients/${user.patient_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data?.patient) {
          setForm(data.patient);
        } else {
          setError("Failed to load profile.");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Server error.");
      }
    };
    if (user?.patient_id && token) fetchProfile();
  }, [user, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/patients/${user.patient_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Update failed");
      } else {
        alert("Profile updated successfully!");
      }
    } catch (err) {
      setError("Server error occurred.");
    }
  };

  return (
    <div className="profile-edit-tab">
      <div className="right-tab">
        <form onSubmit={handleSubmit}>
          <div className="row basic-info">
            <div className="form-head">
              <h2>Basic Information</h2>
            </div>

            <div className="col-md-6 input-sec-1">
              <label className="head-text">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 input-sec-2">
              <label className="head-text">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 input-sec-1">
              <label className="head-text">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 input-sec-2">
              <label className="head-text">Contact Info</label>
              <input
                type="text"
                name="contact_info"
                value={form.contact_info}
                className="form-control"
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <button className="btn upload-btn mt-3" type="submit">
            Submit Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditing;
