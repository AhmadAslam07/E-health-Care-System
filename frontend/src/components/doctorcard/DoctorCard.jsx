import React from 'react';
import './doctorcard.css';
import { Link } from 'react-router-dom';
import {
    FaStar, FaRegStar, FaStopwatch, FaVideo,
    FaClinicMedical, FaRegThumbsUp, FaMicroscope, FaRegCalendarAlt
} from "react-icons/fa";

function DoctorCard({ doctors = [] }) {
    return (
        <div>
            {doctors.length === 0 ? (
                <p className="text-center text-muted">No doctors found.</p>
            ) : (
                doctors.map(doc => (
                    <div className='container pb-4 mb-3 px-3 w-100 border shadow-sm rounded' key={doc.doctor_id}>
                        <div className="row mt-4">
                            <div className="col-8">
                                <div className="row">
                                    <div className="col-2">
                                        <img
                                            src={doc.image ? `http://localhost:5000/uploads/${doc.image}` : '/images/Default.png'}
                                            alt={doc.name}
                                            className="card-img-top pt-3"
                                            style={{ width: 'auto', height: '110px', objectFit: 'cover' }}
                                            onError={(e) => e.target.src = '/images/Default.png'}
                                        />
                                    </div>
                                    <div className="col-10 ps-3">
                                        <h4 style={{ color: "#0E8A8A" }}>{doc.name}</h4>
                                        <h6 className='text-secondary'>{doc.specialization}</h6>
                                        <p className='text-warning mt-4'>
                                            <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
                                            <span className='text-secondary'>&nbsp;&nbsp;15 Patient Reviews</span>
                                        </p>
                                        <div className="row my-4">
                                            <div className="col-4 border-end">
                                                <div className="row">
                                                    <div className="col-2 text-secondary"><FaStopwatch /></div>
                                                    <div className="col-10">
                                                        <h6>Under 15 Min</h6>
                                                        <span>Wait Time</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4 ps-2 border-end">
                                                <div className="row">
                                                    <div className="col-2 text-secondary"><FaMicroscope /></div>
                                                    <div className="col-10">
                                                        <h6>{doc.experience} Years</h6>
                                                        <span>Experience</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4 ps-2">
                                                <div className="row">
                                                    <div className="col-2 text-secondary"><FaRegThumbsUp /></div>
                                                    <div className="col-10">
                                                        <h6>90% (200)</h6>
                                                        <span>Satisfied Patients</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="col-4 pt-1 pb-1">
                                <div className='d-grid gap-1 mx-5 buttons'>
                                    <button className='btn my-3 white-btn'>
                                        <Link to={`/DrProfile/${doc.doctor_id}`} className='btn-link'>View Profile</Link>
                                    </button>
                                    <button className='btn green-btn'>
                                        <Link to="/booking" className='book-link'>Book Appointment</Link>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="container mt-1">
                            <div className="row">
                                <div className="col-5">
                                    <div className="card shadow-sm me-2">
                                        <div className="card-body">
                                            <h6 style={{ color: "#0E8A8A" }}><FaClinicMedical /> &nbsp; Clinic Location</h6>
                                            <span className='text-secondary'><FaRegCalendarAlt /> Available tomorrow</span>
                                            <span className='mx-4'><strong>Fee:</strong> RS {doc.fee || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <div className="card shadow-sm mx-2">
                                        <div className="card-body">
                                            <h6 style={{ color: "#0E8A8A" }}><FaVideo /> &nbsp; Online Consultation</h6>
                                            <span className='text-secondary'><FaRegCalendarAlt /> Available tomorrow</span>
                                            <span className='mx-4'><strong>Fee:</strong> RS {doc.fee || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default DoctorCard;
