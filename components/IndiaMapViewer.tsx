'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import India from '@react-map/india';

interface StateData {
  id: string;
  name: string;
}

export default function IndiaMapViewer({ dbStates }: { dbStates: StateData[] }) {
  const router = useRouter();

  const handleSelect = (stateName: string | null) => {
    if (!stateName) return;
    
    // Attempt to find the matching state from DB by name
    const foundState = dbStates.find(
      (s) => s.name.toLowerCase() === stateName.toLowerCase() || 
             s.name.toLowerCase().includes(stateName.toLowerCase()) ||
             stateName.toLowerCase().includes(s.name.toLowerCase())
    );

    if (foundState) {
      router.push(`/states/${foundState.id}`);
    } else {
      // Fallback: alert or log
      console.log('State not found in DB:', stateName);
      alert(`No destinations found in ${stateName} yet!`);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
      <div style={{ maxWidth: '600px', width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '2rem', backgroundColor: 'var(--bg-card)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Interactive Map</h3>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>Click on any state to explore destinations</p>
        <India 
          type="select-single" 
          size={500} 
          mapColor="#e2e8f0" 
          strokeColor="#94a3b8" 
          strokeWidth={1} 
          hoverColor="#cbd5e1" 
          selectColor="#2563eb" 
          hints={true} 
          onSelect={handleSelect} 
        />
      </div>
    </div>
  );
}
