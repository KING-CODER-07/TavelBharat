import React from 'react';

export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--background)',
      position: 'relative',
      zIndex: 50
    }}>
      <div className="custom-spinner"></div>
      <h3 style={{ 
        marginTop: '2rem',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '1.2rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--primary)',
        animation: 'breathe 2s infinite ease-in-out'
      }}>
        Curating Experience...
      </h3>

      <style>{`
        .custom-spinner {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid rgba(79, 70, 229, 0.1);
          border-top-color: var(--primary);
          animation: spin 1s ease-in-out infinite;
          box-shadow: var(--shadow-glow);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.5; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
