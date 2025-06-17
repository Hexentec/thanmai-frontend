'use client';
import React, { useState } from 'react';
import { useRouter }    from 'next/navigation';
import Link             from 'next/link';
import api              from '../lib/api';
import '../../styles/pages/Auth.css';
import ImageWithFallback from '../components/ImageWithFallback';
import { motion } from 'framer-motion';
import { fade } from '../lib/animationVariants';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    acceptTnC: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.acceptTnC) {
      alert('Please accept Terms & Conditions');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      });
      // store token + set header
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      router.push('/');  // redirect home
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <motion.div variants={fade} initial="hidden" animate="visible">
      <div className="auth-page">
        <form className="auth-form" onSubmit={handleSubmit}>
          <ImageWithFallback src="/assets/logo.png" alt="Thanmai Home Foods" className="auth-logo" nextImage={false} />
          <h1>Login</h1>

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
            />
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="acceptTnC"
              checked={form.acceptTnC}
              onChange={handleChange}
            />
            I accept the <Link href="/terms">Terms &amp; Conditions</Link>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>

          <div className="links">
            <Link href="/forgot-password">Forgot password?</Link>
            <span>·</span>
            <Link href="/register">Create account</Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
