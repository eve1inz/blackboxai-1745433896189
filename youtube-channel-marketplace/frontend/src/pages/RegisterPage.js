import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        nickname,
        email,
        password,
        role,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-youtubeLight">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-youtubeRed">Register</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Nickname</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="block mb-2 font-semibold">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="block mb-2 font-semibold">Role</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <button
            type="submit"
            className="w-full bg-youtubeRed text-white py-2 rounded hover:bg-red-700 transition-colors"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-youtubeRed hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
