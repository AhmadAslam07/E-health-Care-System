import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const email = useRef();
  const password = useRef();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await fetch('http://localhost:5000/api/admins/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.current.value, password: password.current.value })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      localStorage.setItem('userRole', 'admin');
      navigate('/AdminDashboard/admin');
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h3 className="mt-5 mb-3 text-center">Admin Login</h3>
      <form onSubmit={handleLogin} className="mx-auto" style={{ maxWidth: '400px' }}>
        <input type="email" placeholder="Email" ref={email} className="form-control mb-3" required />
        <input type="password" placeholder="Password" ref={password} className="form-control mb-3" required />
        <button className="btn btn-primary w-100 mb-10" type="submit">Login</button>
        {error && <div className="text-danger mt-3 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default AdminLogin;
