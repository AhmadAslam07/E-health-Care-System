import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./form.css";

const DrRegistration = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [gender, setGender] = useState("");
    const [qualification, setQualification] = useState("");
    const [experience, setExperience] = useState("");
    const [clinicLocation, setClinicLocation] = useState("");
    const [fee, setFee] = useState("");
    const [about, setAbout] = useState("");
    const [services, setServices] = useState("");
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validatePassword = (password) => password.length >= 6;

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!name || !email || !phone || !password || !specialization || !gender || !image) {
            setError("All required fields must be filled.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Invalid email format.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 6 characters.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("specialization", specialization);
        formData.append("gender", gender);
        formData.append("qualification", qualification);
        formData.append("experience", experience);
        formData.append("clinic_location", clinicLocation);
        formData.append("fee", fee);
        formData.append("about", about);
        formData.append("services", services);
        formData.append("image", image);

        try {
            const response = await fetch(`http://localhost:5000/api/auth/register`, {
                method: "POST",
                body: formData
            });

            const res = await response.json();
            if (response.ok && res?.doctor_id) {
                setShowSuccessModal(true);
            } else {
                setError(res.message || "Registration failed.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="row">
                {/* Left Image */}
                <div className="col-md-6 pt-4">
                    <img src="/images/loginbanner.png" alt="Login" style={{ width: '100%', height: '400px' }} />
                </div>

                {/* Form */}
                <div className="col-md-6">
                    <div className="my-5">
                        <div className="card px-4 py-3 w-75 mx-auto shadow-sm">
                            <div className="row py-1 mb-4 text-center">
                                <div className="col-md-6">
                                    <h4 className="text-start" style={{ color: '#00205b' }}>Doctor Register</h4>
                                </div>
                                <div className="col-md-6 pt-2 pe-1">
                                    <h6 className="text-end">
                                        <Link className="text-decoration-none" to="/PatientsRegistration" style={{ color: '#d21f49 ' }}>
                                            Not a Doctor?
                                        </Link>
                                    </h6>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <input className="form-control mt-2" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                                <input className="form-control mt-2" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
                                <input className="form-control mt-2" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                <input className="form-control mt-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

                                <select className="form-control mt-2" value={gender} onChange={e => setGender(e.target.value)} required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>

                                <select className="form-control mt-2" value={specialization} onChange={e => setSpecialization(e.target.value)} required>
                                    <option value="">Select Specialization</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Child Specialist">Child Specialist</option>
                                    <option value="General">General</option>
                                </select>

                                <input className="form-control mt-2" placeholder="Qualification" value={qualification} onChange={e => setQualification(e.target.value)} />
                                <input className="form-control mt-2" placeholder="Experience" value={experience} onChange={e => setExperience(e.target.value)} />
                                <input className="form-control mt-2" placeholder="Clinic Location" value={clinicLocation} onChange={e => setClinicLocation(e.target.value)} />
                                <input className="form-control mt-2" placeholder="Fee" type="number" value={fee} onChange={e => setFee(e.target.value)} />
                                <textarea className="form-control mt-2" placeholder="About" rows="2" value={about} onChange={e => setAbout(e.target.value)} />
                                <textarea className="form-control mt-2" placeholder="Services (comma-separated)" rows="2" value={services} onChange={e => setServices(e.target.value)} />

                                <label className="form-label mt-2">Upload Profile Image</label>
                                <input className="form-control" type="file" accept="image/*" onChange={handleImageChange} required />

                                <button className="btn btn-primary w-100 mt-3" type="submit">Register</button>
                            </form>

                            {error && <div className="text-danger text-center mt-3">{error}</div>}

                            <div className="text-center mt-2">
                                <p>
                                    Already have an account?
                                    <Link to="/DrsLogin" className="text-danger"> Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showSuccessModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content text-center p-4">
                            <h3 className="text-success">
                                <span role="img" aria-label="check"></span> Registration Successful
                            </h3>
                            <p className="mt-3">A verification email has been sent to:</p>
                            <p><strong>{email}</strong></p>
                            <p>Please check your inbox to verify your account before logging in.</p>
                            <button className="btn btn-secondary mt-3 w-100" onClick={() => setShowSuccessModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DrRegistration;
