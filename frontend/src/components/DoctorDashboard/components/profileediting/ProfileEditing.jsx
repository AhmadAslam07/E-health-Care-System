import React, { useState, useEffect } from "react";
import "../docterdashboard.css";

const ProfileEditing = () => {
  const [form, setForm] = useState(null);
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!user?.doctor_id || !token) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/doctors/${user.doctor_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok && data?.doctor) {
          setForm(data.doctor);
        }
      } catch (err) {
        console.error("Failed to fetch doctor profile:", err.message);
      }
    };

    fetchDoctor();
  }, [token, user?.doctor_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        formData.append(key, val);
      }
    });
    if (picture) formData.append("image", picture);

    try {
      const res = await fetch(
        `http://localhost:5000/api/doctors/${user.doctor_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Update failed");
      } else {
        localStorage.setItem("user", JSON.stringify(data.doctor));
        alert("Profile updated successfully!");
        setError(null);
      }
    } catch (err) {
      setError("Server error occurred.");
    }
  };

  if (!form) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  return (
    <div className="profile-edit-tab">
      <div className="right-tab">
        <form onSubmit={handleSubmit}>
          <div className="row basic-info">
            <div className="form-head">
              <h2>Basic Information</h2>
            </div>

            <div className="col-md-6 input-sec-1">
              <label className="head-text">Your Name <span>*</span></label>
              <input
                type="text"
                name="name"
                value={form.name || ""}
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 input-sec-2">
              <label className="head-text">Your Email <span>*</span></label>
              <input
                type="email"
                name="email"
                value={form.email || ""}
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 input-sec-1">
              <label className="head-text">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone || ""}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 input-sec-2">
              <label className="head-text">Gender</label>
              <select
                className="form-select form-control"
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="FeMale">Female</option>
              </select>
            </div>

            <div className="col-md-12">
              <label className="head-text">Address</label>
              <textarea
                className="form-control"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="head-text text-white">Upload Image</label>
              <input
                className="form-control"
                type="file"
                accept="image/*"
                onChange={(e) => setPicture(e.target.files[0])}
              />
            </div>
          </div>

          <div className="row basic-info">
            <div className="form-head mt-3">
              <h2>Other Details</h2>
            </div>

            <div className="col-md-12">
              <label className="head-text">About</label>
              <textarea
                className="form-control"
                name="about"
                value={form.about || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="head-text">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={form.qualification || ""}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="head-text">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={form.specialization || ""}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="head-text">Experience</label>
              <input
                type="text"
                name="experience"
                value={form.experience || ""}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="head-text">Clinic Location</label>
              <input
                type="text"
                name="clinicLocation"
                value={form.clinicLocation || ""}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="head-text">Fee</label>
              <input
                type="number"
                name="fee"
                value={form.fee || ""}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="head-text">Services</label>
              <textarea
                className="form-control"
                name="services"
                value={form.services || ""}
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
