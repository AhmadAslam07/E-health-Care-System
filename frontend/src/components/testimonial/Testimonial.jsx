import React, { useEffect, useState } from 'react';
import './testimonial.css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", comment: "", location: "" });

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_URL}/testimonials`);
      const data = await res.json();
      if (data?.testimonials) setTestimonials(data.testimonials);
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setForm({ name: "", comment: "", location: "" });
        setShowForm(false);
        fetchTestimonials();
      }
    } catch (err) {
      console.error("Failed to submit testimonial", err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <>
      <div className="row mt-4 py-3">
        <div className="col-md-12 px-2">
          <div className="section-header text-center mb-4 position-relative">
            <h2 className="section-heading-title">Testimonials</h2>
            <button
              className="btn btn-sm btn-success position-absolute"
              style={{ top: 0, right: 0 }}
              onClick={() => setShowForm(true)}
            >
              + Add Review
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-2 mb-5 mx-1 px-3">
        <Swiper
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            850: { slidesPerView: 3 },
            1150: { slidesPerView: 4 },
            1700: { slidesPerView: 5 },
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper px-4 pb-5 pt-2"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="testimonial-item text-center mx-auto" style={{ width: "90%", display: "block" }}>
                  <div className="testimonial-img">
                    <img src="/images/Default.png" className="img-fluid" alt="User" />
                  </div>
                  <div className="testimonial-content">
                    <p>{t.comment}</p>
                    <p className="user-name">- {t.name}</p>
                    <p className="user-location mb-0">{t.location || 'Verified Patient'}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "#00000080" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Add Testimonial</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      className="form-control"
                      required
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-2">
                    <textarea
                      placeholder="Your Comment"
                      value={form.comment}
                      className="form-control"
                      rows="3"
                      required
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Location (optional)"
                      value={form.location}
                      className="form-control"
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonial;
