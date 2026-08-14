'use client';

import React from 'react';

interface StateData {
  id: string;
  name: string;
  _count: {
    places: number;
    cities: number;
  };
}

export default function MapTicker({ states }: { states: StateData[] }) {
  // Sort states so we have a consistent order, or filter out ones with 0 places to keep it relevant
  const activeStates = states.filter(s => s._count.places > 0 || s._count.cities > 0)
                             .sort((a, b) => b._count.places - a._count.places);

  if (activeStates.length === 0) return null;

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      backgroundColor: 'var(--accent)',
      color: 'white',
      padding: '0.75rem 0',
      borderRadius: 'var(--radius-md)',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      whiteSpace: 'nowrap'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: inline-block;
          animation: scroll 30s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        .ticker-item {
          display: inline-block;
          margin-right: 3rem;
          font-weight: 500;
          font-size: 1.1rem;
        }
        .ticker-highlight {
          color: #fef08a;
          font-weight: 600;
        }
      `}} />
      <div className="ticker-track">
        {/* Render twice for seamless looping */}
        {[...activeStates, ...activeStates].map((state, i) => (
          <span key={`${state.id}-${i}`} className="ticker-item">
            {state.name} <span className="ticker-highlight">({state._count.places} Places, {state._count.cities} Cities)</span>
            <span style={{ marginLeft: '3rem', opacity: 0.5 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
