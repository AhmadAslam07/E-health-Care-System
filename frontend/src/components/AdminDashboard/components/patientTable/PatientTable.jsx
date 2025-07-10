import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="content container-fluid">
      <div className="page-header">
        <div className="row">
          <div className="col-sm-12">
            <h3 className="page-title">List of Patients</h3>
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
                      <th>Patient ID</th>
                      <th>Patient Name</th>
                      <th>Date of Birth</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Contact Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6">Loading...</td></tr>
                    ) : patients.length === 0 ? (
                      <tr><td colSpan="6">No patients found</td></tr>
                    ) : (
                      patients.map((p) => (
                        <tr key={p.patient_id}>
                          <td>#{p.patient_id}</td>
                          <td>
                            <h2 className="table-avatar d-flex align-items-center">
                              {p.name}
                            </h2>
                          </td>
                          <td>{p.dob}</td>
                          <td>{p.email}</td>
                          <td>{p.phone}</td>
                          <td>{p.contact_info || 'N/A'}</td>
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

export default PatientTable;
