'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import api from '../lib/api';
import '../../styles/components/BulkRequestForm.css';

export default function BulkRequestForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    details: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
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
    <section className="bulk-request-section" aria-label="Bulk Order Request" role="region">
      <div className="bulk-request-container">
        {/* Image side */}
        <div className="bulk-request-image">
          <Image
            src="/assets/bulk-order.png"
            alt="Bulk order illustration"
            width={500}
            height={300}
            priority
          />
        </div>

        {/* Form side */}
        <div className="bulk-request-form-wrapper">
          <h2>Request a Bulk Order</h2>
          <form onSubmit={handleSubmit} aria-label="Bulk order form">
            {['name', 'email', 'phone', 'company'].map(key => (
              <label key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <input
                  name={key}
                  type={key === 'email' ? 'email' : 'text'}
                  value={form[key]}
                  onChange={handleChange}
                  required={key !== 'phone' && key !== 'company'}
                  placeholder={`Enter your ${key}`}
                  aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              </label>
            ))}
            <label>
              Details
              <textarea
                name="details"
                value={form.details}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us more..."
                required
                aria-label="Details"
              />
            </label>
            <button type="submit" disabled={loading} aria-label="Submit bulk order request">
              {loading ? 'Sending…' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
