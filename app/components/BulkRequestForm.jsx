'use client';

import React, { useState } from 'react';
import api from '../lib/api';
import '../../styles/components/BulkRequestForm.css';

export default function BulkRequestForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', details: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bulk-requests', form);
      alert('Request sent!');
      setForm({ name: '', email: '', phone: '', company: '', details: '' });
    } catch {
      alert('Error submitting.');
    }
    setLoading(false);
  };

  return (
    <section className="bulk-request-form">
      <h2>Request Bulk Order</h2>
      <form onSubmit={handleSubmit}>
        {['name','email','phone','company'].map(key => (
          <label key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <input
              name={key}
              type={key === 'email' ? 'email' : 'text'}
              value={form[key]}
              onChange={handleChange}
              required={key !== 'phone' && key !== 'company'}
            />
          </label>
        ))}
        <label>
          Details
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Submit'}
        </button>
      </form>
    </section>
  );
}
