'use client';

import { motion } from 'framer-motion';

const testimonials = [
  { name: "Rahul S.", role: "Corporate Exec", text: "TravelBharat transformed our company retreat. Flawless execution and premium service.", rating: "⭐⭐⭐⭐⭐" },
  { name: "Priya M.", role: "Travel Blogger", text: "The hidden gems they recommended in Kerala were absolutely breathtaking. A class apart.", rating: "⭐⭐⭐⭐⭐" },
  { name: "Amit K.", role: "Solo Explorer", text: "Incredible attention to detail. Their curated itineraries saved me hours of planning.", rating: "⭐⭐⭐⭐" },
  { name: "Sarah J.", role: "Foreign Tourist", text: "Made my first trip to India completely stress-free. The 24/7 concierge was a lifesaver.", rating: "⭐⭐⭐⭐⭐" },
  { name: "Vikram R.", role: "Family Traveler", text: "From luxury stays in Rajasthan to seamless cab bookings. Worth every penny.", rating: "⭐⭐⭐⭐⭐" },
];

export default function TestimonialMarquee() {
  return (
    <div style={{ overflow: 'hidden', padding: '3rem 0', position: 'relative', width: '100%', display: 'flex' }}>
      {/* Fade edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '10%', background: 'linear-gradient(to right, var(--background), transparent)', zIndex: 2 }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '10%', background: 'linear-gradient(to left, var(--background), transparent)', zIndex: 2 }} />

      <motion.div
        animate={{ x: [0, -1500] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        style={{ display: 'flex', gap: '2rem', flexShrink: 0, whiteSpace: 'nowrap' }}
      >
        {/* Double the array to create seamless loop */}
        {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
          <div key={i} className="card" style={{ width: '350px', padding: '1.5rem', whiteSpace: 'normal', flexShrink: 0, backdropFilter: 'blur(12px)', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border-strong)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.1rem' }}>{t.name}</h4>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>{t.role}</p>
              </div>
              <div style={{ fontSize: '0.9rem' }}>{t.rating}</div>
            </div>
            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>"{t.text}"</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
