import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWrapper } from "../../apiIntercepter/intercepter";
import "./form.css";

const DrLogin = () => {
    const email = useRef(null);
    const password = useRef(null);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = {
            email: email.current.value,
            password: password.current.value,
        };

        try {
            const response = await fetchWrapper(
                `${process.env.REACT_APP_API_URL}/auth/login`,
                "POST",
                null,
                credentials
            );

            if (response?.token && response?.doctor) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.doctor));
                localStorage.setItem("userRole", "doctor"); // Store user role
                navigate("/DoctorDashboard/dashboard");
            } else {
                setError(response?.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        }
    };



    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-6 pt-4">
                    <div className='container' style={{ width: '100%', height: '400px' }}>
                        <img src="/images/loginbanner.png" alt="Login/Registration" style={{ width: 'auto', height: '100%' }} />
                    </div>
                </div>

                <div className="container col-md-6">
                    <div className="mt-5">
                        <div className="card px-4 py-3 w-75 mx-auto shadow-sm">
                            <div className="row py-1 mb-4 text-center">
                                <div className="col-md-6">
                                    <h4 className="text-start" style={{ color: '#00205b' }}>Dr Login</h4>
                                </div>
                                <div className="col-md-6 pt-2 pe-1">
                                    <h6 className="text-end">
                                        <Link className="text-decoration-none" to="/PatientsLogin" style={{ color: '#d21f49 ' }}>
                                            Login as Patient ?
                                        </Link>
                                    </h6>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="row needs-validation" noValidate>
                                <div className="row px-1 mt-1">
                                    <label htmlFor="email" className="form-label" style={{ color: '#00205b' }}>E-Mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control"
                                        required
                                        ref={email}
                                    />
                                </div>

                                <div className="px-1 mt-3">
                                    <label htmlFor="password" className="form-label" style={{ color: '#00205b' }}>Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        required
                                        ref={password}
                                    />
                                </div>

                                <div className="row px-1 mt-3">
                                    <button
                                        className="mt-3 w-100 btn text-white"
                                        type="submit"
                                        style={{ backgroundColor: '#00205b' }}
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>

                            {error && (
                                <div className="text-danger text-center mt-3">{error}</div>
                            )}

                            <div className="text-center mt-2">
                                <p>
                                    Don’t have an account?
                                    <Link className="text-decoration-none" to="/DrsRegistration">
                                        <span style={{ color: '#d21f49 ', cursor: 'pointer' }}> Register</span>
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

export default DrLogin;
