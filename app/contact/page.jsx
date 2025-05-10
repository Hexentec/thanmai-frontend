'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../styles/pages/Contact.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // send to your /contact endpoint or email service
      alert('Message sent!');
      setForm({ name:'', email:'', message:'' });
    } catch {
      alert('Error sending message');
    }
    setLoading(false);
  };

  return (
    <>
     
      <main className="contact-page">
        <h1>Contact Us</h1>
        <form className="contact-form" onSubmit={onSubmit}>
          <label>
            Name
            <input name="name" value={form.name} onChange={onChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Message
            <textarea name="message" value={form.message} onChange={onChange} required />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </main>
      
    </>
  );
}
