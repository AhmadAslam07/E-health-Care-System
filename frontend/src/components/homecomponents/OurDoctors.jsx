import React, { useEffect, useState } from 'react';
import { FaStar, FaRegStar } from "react-icons/fa";

const OurDoctors = ({ specialization }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let url = "http://localhost:5000/api/doctors";
        if (specialization) {
          url += `?specialists=${encodeURIComponent(specialization)}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        const uniqueDoctors = Array.from(
          new Map(data.map(d => [d.doctor_id, d])).values()
        );

        setDoctors(uniqueDoctors);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, [specialization]);

  return (
    <div className='container-fluid my-5 px-4 text-center'>
      <h2 style={{ color: "#d21f49 " }}>
        {specialization ? `Doctors - ${specialization}` : 'Our Doctors'}
      </h2>
      <div className="row mt-3">
        {doctors.length === 0 ? (
          <p className="text-muted">No doctors found.</p>
        ) : (
          <div className="row">
            {doctors.map(d => (
              <div className="col-md-3 mb-4" key={d.doctor_id}>
                <div className="card shadow-sm h-100">
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <img
                      src={`http://localhost:5000/uploads/${d.image}`}
                      alt={d.name}
                      className="card-img-top"
                      style={{
                        objectFit: 'cover',
                        height: '100%',
                        maxWidth: '100%',
                        width: 'auto'
                      }}
                      onError={(e) => e.target.src = '/images/Default.png'}
                    />
                  </div>

                  <div className="card-body">
                    <h5>{d.name}</h5>
                    <p>{d.experience || 0} Years</p>
                    <p className='text-warning'>
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
                      <span className='text-secondary'>&nbsp;&nbsp;Ratings</span>
                    </p>
                    <a href={`/booking`} className="btn btn-primary">Book Appointment</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurDoctors;
