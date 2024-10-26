"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/utils/http/api';

const Login: React.FC = () => {
    const [form, setForm] = useState({ username: '', otp: '' });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await loginUser(form.username, form.otp);
            if (response && response.token) {
                localStorage.setItem('token', response.token);
                router.push('/quote-list/');
            } else {
                setError("Login failed. Please check your username and OTP.");
            }
        } catch (error) {
            setError("Login failed. Please check your username and OTP.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error-message" style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="otp"
                placeholder="OTP"
                value={form.otp}
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
