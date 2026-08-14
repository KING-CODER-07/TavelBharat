'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('TravelBharat Application Error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--background)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background for Error State */}
      <div className="bg-blobs" style={{ opacity: 0.3 }}>
        <div className="blob-1" style={{ background: 'var(--accent)' }}></div>
        <div className="blob-2" style={{ background: 'var(--primary)' }}></div>
      </div>

      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '3rem 2rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div 
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          style={{ fontSize: '4rem', marginBottom: '1rem' }}
        >
          ⚠️
        </motion.div>
        <h2 style={{ 
          fontFamily: 'Outfit, sans-serif', 
          fontSize: '2rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          color: 'var(--text-main)'
        }}>
          Service Unavailable
        </h2>
        <p style={{ 
          color: 'var(--text-muted)', 
          marginBottom: '2.5rem',
          lineHeight: 1.6 
        }}>
          We encountered an unexpected connection issue. Our premium concierge servers might be experiencing a temporary hiccup.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '300px' }}
          >
            Try Again
          </button>
          
          <Link href="/" className="btn btn-outline" style={{ width: '100%', maxWidth: '300px' }}>
            Return to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
