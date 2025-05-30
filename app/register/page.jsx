'use client';
import React, { useState } from 'react';
import { useRouter }    from 'next/navigation';
import Link             from 'next/link';
import api              from '../lib/api';
import '../../styles/pages/Auth.css';
import ImageWithFallback from '../components/ImageWithFallback';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert('Passwords must match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      // auto-login on signup
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      router.push('/');  
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <ImageWithFallback src="/assets/logo.png" alt="Thanmai Home Foods" className="auth-logo" nextImage={false} />
        <h1>Create Account</h1>

        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Register'}
        </button>

        <div className="links">
          <span>Already have an account?</span>
          <Link href="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
}
