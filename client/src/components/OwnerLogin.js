// src/components/OwnerLogin.js
import React, { useState } from 'react';
import '../css/OwnerLogin.css'; // You can move the CSS to an external file if needed.

// src/components/OwnerLogin.js

import { useNavigate } from 'react-router-dom';

const OwnerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/owner/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            // Log the raw response to inspect the status and response body
          // console.log('Response:', response);
            const data = await response.json();
          // console.log('Response Data:', data);

            if (response.ok) {
                // If login is successful, redirect to the dashboard
                navigate('/dashboard', { state: { orders: data.orders } });
            } else {
                // Handle login errors
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Server error, please try again later.');
        }
    };

    return (
        <div className="container">
            <h1>Restaurant Owner Login</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default OwnerLogin;

