'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './contact.module.css';

export default function ContactForm() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('destination');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: destination ? 'Leisure Vacation' : 'Corporate Booking',
    message: destination ? `I would like to plan a trip to ${destination}. Please provide more details.` : ''
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', inquiryType: 'Corporate Booking', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.formCard} animate-slide-in-right`}>
      <h2 className="text-gradient-emerald">Request a Private Consultation</h2>
      <p className={styles.formDesc} style={{ color: 'var(--text-secondary)' }}>Connect with our private travel curators, corporate retreat directors, and heritage itinerary specialists.</p>

      {status === 'success' && (
        <div className={`alert alert-success ${styles.alertSuccess}`}>
          Thank you! Your inquiry has been received by our Executive Concierge desk. We will contact you shortly.
        </div>
      )}
      
      {status === 'error' && (
        <div className={`alert alert-error ${styles.alertError}`}>
          Something went wrong. Please try again or contact our Concierge desk directly.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Full Name *</label>
          <input id="name" name="name" type="text" className="input-field" placeholder="Enter your full name" required value={formData.name} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email Address *</label>
          <input id="email" name="email" type="email" className="input-field" placeholder="Enter your email" required value={formData.email} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>Phone Number</label>
          <input id="phone" name="phone" type="tel" className="input-field" placeholder="Enter your contact number" value={formData.phone} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="inquiryType" className={styles.label}>Inquiry Category</label>
          <select id="inquiryType" name="inquiryType" className="input-field" value={formData.inquiryType} onChange={handleChange}>
            <option>Corporate Retreat &amp; Conference</option>
            <option>Bespoke Luxury Vacation</option>
            <option>Sovereign &amp; Institutional Delegation</option>
            <option>Royal Concierge Assistance</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>Message / Expedition Wishlist *</label>
          <textarea id="message" name="message" className="input-field" rows={5} placeholder="Share your travel dates, preferred destinations, or luxury requirements..." required value={formData.message} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
          {loading ? 'Submitting Inquiry...' : 'Submit Private Inquiry'}
        </button>
      </form>
    </div>
  );
}
