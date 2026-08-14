'use client';

import { useState, useActionState, useEffect } from 'react';
import { createBooking } from '@/app/actions/bookings';
import styles from '../places/[placeId]/place.module.css';

export default function BookingModal({ placeId, placeName, isLoggedIn }: { placeId: string, placeName: string, isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingType, setBookingType] = useState('Hotel');
  const [state, formAction, isPending] = useActionState(createBooking, null);

  // Guest checkout state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestDetails, setGuestDetails] = useState('');
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestSuccess, setGuestSuccess] = useState(false);
  const [guestError, setGuestError] = useState('');

  useEffect(() => {
    if (state?.success) {
      alert('Booking request submitted successfully! Our team will contact you soon.');
      setIsOpen(false);
    }
  }, [state]);

  const openModal = (type: string) => {
    setBookingType(type);
    setGuestSuccess(false);
    setGuestError('');
    setIsOpen(true);
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestLoading(true);
    setGuestError('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
          inquiryType: `Instant ${bookingType} Booking`,
          message: `Booking Request for ${placeName} (${bookingType}). Requirements: ${guestDetails}`
        })
      });

      if (res.ok) {
        setGuestSuccess(true);
      } else {
        setGuestError('Could not process booking. Please check your network or contact us.');
      }
    } catch (err) {
      setGuestError('Error connecting to reservation system.');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
        <button onClick={() => openModal('Hotel')} className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.85rem' }}>🏨 Hotel</button>
        <button onClick={() => openModal('Guide')} className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.85rem' }}>🧑‍🏫 Guide</button>
        <button onClick={() => openModal('Transport')} className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.85rem' }}>🚗 Cab</button>
      </div>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}>
          <div className="card animate-fade-up" style={{ width: '90%', maxWidth: '440px', padding: '2rem', position: 'relative', background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }}>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}>✕</button>
            <h3 style={{ marginBottom: '0.3rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{bookingType === 'Hotel' ? '🏨' : bookingType === 'Guide' ? '🧑‍🏫' : '🚗'}</span>
              <span>Book {bookingType}</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>Reservation for <strong style={{ color: 'var(--text-primary)' }}>{placeName}</strong></p>

            {state?.success || guestSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>✅</div>
                <h4 style={{ color: '#10B981', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Booking Request Confirmed!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Your {bookingType.toLowerCase()} reservation request for <strong>{placeName}</strong> has been logged into our verified concierge database.
                </p>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.85rem', color: '#10B981' }}>
                  Reference ID: TB-{Math.floor(100000 + Math.random() * 900000)}
                </div>
                <button onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>Done</button>
              </div>
            ) : !isLoggedIn ? (
              /* Guest Fast-Track Booking Form */
              <form onSubmit={handleGuestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  ⚡ Guest Instant Checkout &mdash; No login required!
                </div>

                {guestError && <div style={{ color: '#ef4444', fontSize: '0.85rem', padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>{guestError}</div>}

                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Rahul Sharma"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="email@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+91 98765 43210"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Travel Dates &amp; Special Requests</label>
                  <textarea 
                    required 
                    rows={2}
                    placeholder="e.g. 2 guests, checking in mid-October..."
                    value={guestDetails}
                    onChange={(e) => setGuestDetails(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={guestLoading} style={{ marginTop: '0.5rem', width: '100%' }}>
                  {guestLoading ? 'Confirming Booking...' : `Request Instant ${bookingType} Booking`}
                </button>
              </form>
            ) : (
              /* Logged In Member Form */
              <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <input type="hidden" name="placeId" value={placeId} />
                <input type="hidden" name="type" value={bookingType} />
                
                {state?.error && <div style={{ color: '#ef4444', fontSize: '0.85rem', padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>{state.error}</div>}

                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Details (Dates, Pax, Requirements)</label>
                  <textarea 
                    name="details" 
                    required 
                    rows={3}
                    placeholder="e.g. 2 Adults, check-in next weekend"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.8rem', marginTop: '0.3rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Card Details (Mock Payment)</label>
                  <input type="text" placeholder="💳 4242 4242 4242 4242" required style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)', marginBottom: '0.5rem' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <input type="text" placeholder="MM/YY" required style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }} />
                    <input type="text" placeholder="CVC" required style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isPending} style={{ marginTop: '0.5rem', position: 'relative', width: '100%' }}>
                  {isPending ? 'Processing Payment...' : `Pay ₹${(parseInt(placeId.substring(0, 8) || '0', 16) % 5000) + 1000} & Book`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
