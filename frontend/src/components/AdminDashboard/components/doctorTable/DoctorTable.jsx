import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(res.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="content container-fluid">
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title">List of Doctors</h3>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>Doctor Name</th>
                      <th>Speciality</th>
                      <th>Phone</th>
                      <th>Consultation Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4">Loading...</td></tr>
                    ) : (
                      doctors.map((doctor) => (
                        <tr key={doctor.doctor_id}>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              <img
                                className="avatar-img rounded-circle me-2"
                                src={`http://localhost:5000/uploads/${doctor.image}`}
                                alt="User"
                                width={40}
                                height={40}
                              />
                              Dr. {doctor.name}
                            </h2>
                          </td>
                          <td>{doctor.specialization}</td>
                          <td>{doctor.phone}</td>
                          <td>Rs. {doctor.fee}</td>
                        </tr>
                      ))
                    )}
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

export default DoctorTable;
