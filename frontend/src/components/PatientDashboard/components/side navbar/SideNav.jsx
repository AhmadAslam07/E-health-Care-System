import React from 'react'
import { NavLink } from 'react-router-dom'
import "../patientdashboard.css"
import { useNavigate } from 'react-router-dom';
import { FaColumns, FaUserInjured, FaUsersCog, FaLock, FaFileMedical, FaSignOutAlt, FaVideo } from 'react-icons/fa';

const SideNav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/"); // Redirect to home or login
    };

    return (
        <div className="nav flex-column nav-pills my-side-nav">
            <div className='side-bar'>
                <ul className="navbar-nav">
                    {/* <li>
                        <NavLink className="nav-link" to="patient">
                            <FaColumns /> &nbsp; Dashboard
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink className="nav-link" to="appointments">
                            <FaVideo /> &nbsp; Appointments
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className="nav-link" to="lab-reports">
                            <FaFileMedical /> &nbsp; Lab Reports
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link" to="favourites">
                            <FaUserInjured /> &nbsp; Favourites
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link" to="patientprofileedit">
                            <FaUsersCog /> &nbsp; Profile Settings
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link" to="patientchangepassword">
                            <FaLock /> &nbsp; Change Password
                        </NavLink>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="nav-link btn btn-link text-start">
                            <FaSignOutAlt /> &nbsp; Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideNav;
