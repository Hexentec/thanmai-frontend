'use client';

import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import Link from 'next/link';
import '../../styles/components/Footer.css';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/site-settings')
      .then(res => setSettings(res.data))
      .catch(console.error);
  }, []);

  if (!settings) return null;

  return (
    <footer className="site-footer" style={{ background: settings.lightColor }}>
      <div className="footer-content">
        <p>{settings.footerText}</p>
        <div className="social-links">
          {settings.socialLinks.facebook && (
            <Link href={settings.socialLinks.facebook}><a target="_blank">Facebook</a></Link>
          )}
          {settings.socialLinks.instagram && (
            <Link href={settings.socialLinks.instagram}><a target="_blank">Instagram</a></Link>
          )}
          {settings.socialLinks.whatsapp && (
            <Link href={settings.socialLinks.whatsapp}><a target="_blank">WhatsApp</a></Link>
          )}
        </div>
      </div>
    </footer>
  );
}
