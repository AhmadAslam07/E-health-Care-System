import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaInstagram,
  FaPhoneAlt,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Dropdown from "react-bootstrap/Dropdown";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const syncFromLocalStorage = () => {
      const storedUser = localStorage.getItem("user");
      const userRole = localStorage.getItem("userRole");

      setUser(storedUser ? JSON.parse(storedUser) : null);
      setRole(userRole || null);
    };

    syncFromLocalStorage();

    // Optional: also listen to changes (e.g. from another tab)
    window.addEventListener("storage", syncFromLocalStorage);

    return () => {
      window.removeEventListener("storage", syncFromLocalStorage);
    };
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

  const image =
    role === "doctor"
      ? user?.image
        ? `${process.env.REACT_APP_API_URL}/uploads/${user.image}`
        : "/images/Default.png"
      : "/images/Default.png";

  return (
    <div>
      {/* Top Bar */}
      <div style={{ backgroundColor: "#00205b" }}>
        <div className="main-nav-sec p-2">
          <div className="main-nav-sec1">
            <FaPhoneAlt className="text-light mx-2" />
            <span className="text-light">Contact Number: +92 314 3696063</span>
            &nbsp;&nbsp;&nbsp;
            <FaMapMarkerAlt className="text-light mx-2" />
            <span className="text-light">Location: Fareed town Sahiwal</span>
          </div>
          <div className="main-nav-sec2">
            <div className="text-light">
              <span className="mx-3">Follow US:</span>
              <FaInstagram />
              <FaTwitter className="mx-3" />
              <FaFacebook />
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-md shadow-sm">
        <div className="container-fluid header-bar">
          <Link className="navbar-brand mx-3" to="/">
            <img
              src="/images/hospital.png"
              alt="hospital"
              style={{ width: "120px" }}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <GiHamburgerMenu />
          </button>

          <div className="collapse navbar-collapse top-nav" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link nav-button" to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-button" to="/Doctor">
                  Search Doctors
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-button" to="/AboutUs">
                  About Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-button" to="/ContactUs">
                  Contact Us
                </NavLink>
              </li>
            </ul>

            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-user"
                  className="d-flex align-items-center border-0 bg-transparent"
                >
                  <img
                    src={
                      role === "doctor" && user?.image
                        ? `http://localhost:5000/uploads/${user.image}`
                        : role === "admin"
                          ? '/images/admin1.png'
                          : '/images/Default.png'
                    }
                    alt={user?.name || "User"}
                    onError={(e) => (e.target.src = "/images/Default.png")}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: 8,
                    }}
                  />
                  <span style={{ fontWeight: 500 }}>{user?.name || "User"}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    href={
                      role === "doctor"
                        ? "/DoctorDashboard/dashboard"
                        : role === "admin"
                          ? "/AdminDashboard/admin"
                          : "/PatientDashboard/appointments"
                    }
                  >
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link className="text-decoration-none" to="/PatientsRegistration">
                <button
                  className="btn text-white rounded-pill mx-3 px-3"
                  style={{ fontSize: "14px", backgroundColor: "#d21f49" }}
                >
                  Login/Signup
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
