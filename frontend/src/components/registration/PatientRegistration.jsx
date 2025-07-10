import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./form.css";

const PatientRegistration = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        dob: '',
        contact_info: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, phone, dob, contact_info } = form;

        if (!name || !email || !password || !phone || !dob || !contact_info) {
            setError("All fields are required");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/patients/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setError(null);
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        }
    };

    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-6 pt-4">
                    <img src="/images/online patient.jpg" alt="Register" style={{ width: '100%', height: '490px', objectFit: 'cover' }} />
                </div>

                <div className="col-md-6">
                    <div className="my-5">
                        <div className="card px-4 py-3 w-75 mx-auto shadow-sm">
                            <div className="row py-1 mb-4 text-center">
                                <div className="col-md-6">
                                    <h4 className="text-start" style={{ color: '#00205b' }}>Patient Register</h4>
                                </div>
                                <div className="col-md-6 pt-2 pe-1">
                                    <h6 className="text-end">
                                        <Link className="text-decoration-none" to="/DrsRegistration" style={{ color: '#d21f49' }}>
                                            Are you a Doctor?
                                        </Link>
                                    </h6>
                                </div>
                            </div>

                            {!success ? (
                                <form onSubmit={handleSubmit} className="row needs-validation" noValidate>
                                    <div className="row px-1">
                                        <label className="form-label" style={{ color: '#00205b' }}>Full Name</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="row px-1 mt-3">
                                        <label className="form-label" style={{ color: '#00205b' }}>Phone Number</label>
                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="row px-1 mt-3">
                                        <label className="form-label" style={{ color: '#00205b' }}>E-Mail</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="px-1 mt-3">
                                        <label className="form-label" style={{ color: '#00205b' }}>Password</label>
                                        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="px-1 mt-3">
                                        <label className="form-label" style={{ color: '#00205b' }}>Date of Birth</label>
                                        <input type="date" name="dob" value={form.dob} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="px-1 mt-3">
                                        <label className="form-label" style={{ color: '#00205b' }}>Contact Info</label>
                                        <input type="text" name="contact_info" value={form.contact_info} onChange={handleChange} className="form-control" required />
                                    </div>
                                    <div className="row px-1 mt-3">
                                        <button className="mt-3 w-100 btn text-white" type="submit" style={{ backgroundColor: '#00205b' }}>
                                            Signup
                                        </button>
                                    </div>
                                    {error && <div className="text-danger mt-2 text-center">{error}</div>}
                                </form>
                            ) : (
                                <div className="text-center py-4">
                                    <img src="/images/email_sent.png" alt="Check Email" style={{ width: "120px", marginBottom: "20px" }} />
                                    <h5 className="text-success">Registration successful!</h5>
                                    <p>Please check your email to verify your account.</p>
                                </div>
                            )}

                            <div className='text-center mt-2'>
                                <p>
                                    Already have an account?
                                    <Link className="text-decoration-none" to="/PatientsLogin">
                                        <span style={{ color: '#d21f49', cursor: 'pointer' }}> Login</span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;
