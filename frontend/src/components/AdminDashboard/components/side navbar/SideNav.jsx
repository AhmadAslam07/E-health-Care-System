import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaColumns, FaUserInjured, FaUsersCog, FaLock } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import "../admindashboard.css";

const SideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens and any saved state
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('userRole');

    // Redirect to admin login page
    navigate('/');
  };

  return (
    <div className="nav flex-column nav-pills my-side-nav">
      <div className='side-bar'>
        <ul className="navbar-nav">
          <li>
            <NavLink className="nav-link" to="admin">
              <FaColumns /> &nbsp; Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" to="specialities">
              <FaUserInjured /> &nbsp; Specialities
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" to="doctorrecord">
              <FaUsersCog /> &nbsp; Doctor Record
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" to="patientrecord">
              <FaLock /> &nbsp; Patient Record
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-link" to="transaction">
              <FaLock /> &nbsp; Appointments
            </NavLink>
          </li>
          <li>
            {/* Logout */}
            <button className="nav-link btn btn-link text-start" onClick={handleLogout}>
              <FaLock /> &nbsp; Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
