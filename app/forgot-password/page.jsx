'use client';
import React, { useState } from 'react';
import Link             from 'next/link';
import api              from '../lib/api';
import '../../styles/pages/Auth.css';
import ImageWithFallback from '../components/ImageWithFallback';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // backend must expose this; otherwise stub:
      await api.post('/auth/forgot-password', { email });
      alert('Reset link sent!');
    } catch {
      alert('Error sending reset link');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <ImageWithFallback src="/assets/logo.png" alt="Thanmai Home Foods" className="auth-logo" nextImage={false} />
        <h1>Forgot Password</h1>
        <p>Enter your email and we&apos;ll send you a reset link.</p>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>

        <div className="links">
          <Link href="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
