import React, { useEffect, useState } from 'react';
import './doctorprofile.css';
import {
  FaRegComment, FaRegBookmark, FaPhoneAlt, FaVideo, FaMapMarkerAlt,
  FaRegMoneyBillAlt, FaRegThumbsUp, FaMicroscope, FaStopwatch, FaStar, FaRegStar, FaBrain
} from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';

const Doctorprofile = () => {
  const { id } = useParams();
  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [drDetails, setDrDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [slots, setSlots] = useState([]);
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/doctors/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.status === 403) {
          console.warn("403 Forbidden — Token is missing or invalid.");
          setError("Access denied. Please login again.");
          return;
        }

        const text = await res.text();
        const data = JSON.parse(text);
        setDrDetails(data);

      } catch (err) {
        console.error("Error fetching doctor details:", err);
        setError("Failed to fetch doctor details.");
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews/${id}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };

    const fetchSlots = async () => {
      try {
        const res = await fetch(`${API_URL}/clinic/slots?doctor_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setSlots(data);
      } catch (err) {
        console.error("Error fetching slots", err);
      }
    };

    fetchDoctor();
    fetchReviews();
    fetchSlots();
  }, [id, token]);

  const handleSubmitReview = async () => {
    if (user?.role === "doctor") {
      alert("Only patients can submit reviews.");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          doctor_id: id,
          patient_id: user?.patient_id,
          comments: comment,
          recommend
        })
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setComment('');
        setRecommend(false);
      } else {
        alert("Error submitting review");
      }
    } catch (err) {
      console.error("Failed to submit review", err);
      alert("Server error while submitting review");
    }
  };

  const groupSlotsByDay = (slots) => {
    const dayMap = {};
    slots.forEach(slot => {
      const date = new Date(slot.start_time);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const from = new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const to = new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (!dayMap[day]) {
        dayMap[day] = { from, to };
      }
    });
    return dayMap;
  };

  const daySlots = groupSlotsByDay(slots);

  if (error) return <div className="text-center my-5 text-danger">{error}</div>;
  if (!drDetails) return <div className="text-center my-5">Loading doctor profile...</div>;

  const fullImagePath = drDetails.image
    ? `http://localhost:5000/uploads/${drDetails.image}`
    : '/images/Default.png';

  return (
    <div>
      <div className='row mx-4 my-3'>
        <p>Home <span style={{ color: "#ff9600" }}>/ Doctor Profile</span></p>
        <h4 className='text-secondary'>Doctor Profile</h4>
      </div>

      <div className='container w-100'>
        <div className="row my-3 px-2 py-4 border shadow-sm rounded">
          <div className="col-lg-10">
            <div className="row">
              <div className="col-lg-2 me-3">
                <img src={fullImagePath} alt="doctor" style={{ width: '100%', height: '110px' }} />
              </div>
              <div className="col-lg-8">
                <h4 style={{ color: "#0E8A8A" }}>Dr. {drDetails.name}</h4>
                <p style={{ color: "#63636D" }}><FaBrain style={{ color: "#0E8A8A" }} /> {drDetails.specialization} (Specialist)</p>
                <h6 className='text-warning'>
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
                  <span className='text-secondary'>&nbsp;&nbsp; {reviews.length} Patient Reviews</span>
                </h6>

                <div className="row mt-5 mb-4 me-5">
                  <div className="col-4 border-end">
                    <FaStopwatch style={{ color: "#0E8A8A" }} /> <h6>Under 15 Min</h6> <span>Wait Time</span>
                  </div>
                  <div className="col-4 border-end">
                    <FaMicroscope style={{ color: "#0E8A8A" }} /> <h6>{drDetails.experience} Years</h6> <span>Experience</span>
                  </div>
                  <div className="col-4">
                    <FaRegThumbsUp style={{ color: "#0E8A8A" }} /> <h6>99%</h6> <span>Satisfied Patients</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-2">
            <h6><FaRegComment /> {reviews.length} Feedback</h6>
            <h6><FaMapMarkerAlt /> {drDetails.clinicLocation}</h6>
            <h6><FaRegMoneyBillAlt /> RS. {drDetails.fee}</h6>
            <div className="save-icons">
              <div className="border"><FaVideo /></div>
            </div>
            <Link className='btn text-white' style={{ backgroundColor: "#FF9600" }} to="/booking">
              Book Appointment
            </Link>
          </div>
        </div>

        <div className="row mb-4 px-2 pb-2 border shadow-sm rounded btm-nav">
          <nav>
            <div className="nav nav-tabs nav-tabs-bottom nav-justified">
              <button className="nav-link active text-dark" data-bs-toggle="tab" data-bs-target="#nav-overview">Overview</button>
              <button className="nav-link" data-bs-toggle="tab" data-bs-target="#nav-review">Reviews</button>
              <button className="nav-link" data-bs-toggle="tab" data-bs-target="#nav-hours">Available Hours</button>
            </div>
          </nav>
          <div className="tab-content">
            <div className="tab-pane fade show active ps-3" id="nav-overview">
              <h5 className='pt-4'>About Me</h5>
              <p className='w-75'>{drDetails.about || 'No description provided.'}</p>
              <h5 className='pt-4'>Services</h5>
              <p className='w-75'>{drDetails.services || 'Not listed.'}</p>
            </div>

            <div className="tab-pane fade px-3" id="nav-review">
              <div className="container py-4">
                {reviews.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  reviews.map((review, idx) => (
                    <div className="row mb-3 border rounded-3 shadow-sm py-3" key={idx}>
                      <div className="col-lg-1 ps-4">
                        <FaRegThumbsUp style={{ color: "#0E8A8A", fontSize: '24px' }} />
                      </div>
                      <div className="col-lg-11 w-75">
                        <h6>Verified Patient</h6>
                        <p style={{ color: "#63636D" }}>{review.Patient?.name || "Anonymous"}</p>
                        <span style={{ color: "#ff9600" }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                        <p>{review.comments}</p>
                        {review.recommend && (
                          <div className="remarks mt-2">
                            <div className="remarks-box">Recommended</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                <div className="mb-4 p-3 border rounded shadow-sm">
                  <h5>Add a Review</h5>
                  <textarea className="form-control my-2" rows="3"
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" checked={recommend} onChange={(e) => setRecommend(e.target.checked)} id="recommendCheck" />
                    <label className="form-check-label" htmlFor="recommendCheck">
                      I recommend this doctor
                    </label>
                  </div>
                  <button className="btn btn-primary" onClick={handleSubmitReview}>Submit Review</button>
                </div>
              </div>
            </div>

            <div className="tab-pane fade ps-3" id="nav-hours">
              <div className="container my-5 w-50 border rounded-3 shadow-sm p-3">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th><h6><FaMapMarkerAlt /> Available Hours</h6></th>
                      <th>From</th>
                      <th>To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <tr key={day}>
                        <th>{day}</th>
                        <td>{daySlots[day]?.from || '-----'}</td>
                        <td>{daySlots[day]?.to || '-----'}</td>
                      </tr>
                    ))}
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

export default Doctorprofile;
