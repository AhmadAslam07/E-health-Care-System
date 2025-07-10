import React, { useEffect, useState } from 'react';
import { FaCheck, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import "../admindashboard.css";

const Admin = () => {
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

    // Fetch unverified doctors
    const fetchPendingDoctors = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/unverified-doctors');
            setPendingDoctors(res.data);
        } catch (err) {
            console.error('Error fetching unverified doctors:', err);
        }
    };

    // Fetch admins
    const fetchAdmins = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admins');
            setAdmins(res.data);
        } catch (err) {
            console.error('Error fetching admins:', err);
        }
    };

    useEffect(() => {
        fetchPendingDoctors();
        fetchAdmins();
        setLoading(false);
    }, []);

    const verifyDoctor = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/auth/verify-doctor/${id}`);
            setPendingDoctors(prev => prev.filter(doc => doc.doctor_id !== id));
        } catch (err) {
            console.error('Error verifying doctor:', err);
        }
    };

    const deleteAdmin = async (id) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admins/${id}`);
            setAdmins(prev => prev.filter(admin => admin.admin_id !== id));
        } catch (err) {
            console.error('Error deleting admin:', err);
        }
    };

    const addAdmin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admins', newAdmin);
            setNewAdmin({ name: '', email: '', password: '' });
            setShowAddPopup(false);
            fetchAdmins();
        } catch (err) {
            console.error('Error adding admin:', err);
        }
    };

    return (
        <div className="container-fluid mt-4">
            {/* Doctor Registration Requests */}
            <div className="card card-table mb-5">
                <div className="card-header">
                    <h4 className="card-title">Doctor Registration Requests</h4>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p>Loading...</p>
                    ) : pendingDoctors.length === 0 ? (
                        <p>No pending verification requests.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover table-center mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Specialization</th>
                                        <th>Phone</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingDoctors.map(doctor => (
                                        <tr key={doctor.doctor_id}>
                                            <td>{doctor.name}</td>
                                            <td>{doctor.email}</td>
                                            <td>{doctor.specialization}</td>
                                            <td>{doctor.phone}</td>
                                            <td>
                                                <button className="btn btn-success btn-sm" onClick={() => verifyDoctor(doctor.doctor_id)}>
                                                    <FaCheck /> Verify
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Admins List */}
            <div className="card card-table">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title">Admins</h4>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddPopup(true)}>
                        <FaPlus /> Add Admin
                    </button>
                </div>
                <div className="card-body">
                    {admins.length === 0 ? (
                        <p>No admins found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover table-center mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map(admin => (
                                        <tr key={admin.admin_id}>
                                            <td>{admin.name}</td>
                                            <td>{admin.email}</td>
                                            <td>
                                                {/* Edit functionality can be implemented later */}
                                                <button className="btn btn-sm btn-danger me-2" onClick={() => deleteAdmin(admin.admin_id)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Admin Modal */}
            {showAddPopup && (
                <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={addAdmin}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Admin</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddPopup(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control" required value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" required value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input type="password" className="form-control" required value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">Add Admin</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddPopup(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
