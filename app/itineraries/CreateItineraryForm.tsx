'use client';

import { useActionState, useEffect } from 'react';
import { createItinerary } from '@/app/actions/itineraries';
import { useRouter } from 'next/navigation';

export default function CreateItineraryForm() {
  const [state, formAction, isPending] = useActionState(createItinerary, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.itineraryId) {
      router.push(`/itineraries/${state.itineraryId}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {state?.error && <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{state.error}</div>}
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          Trip Title
        </label>
        <input 
          type="text" 
          name="title" 
          required 
          placeholder="e.g., Rajasthan Backpacking"
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }}
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={isPending}
      >
        {isPending ? 'Creating...' : 'Start Planning'}
      </button>
    </form>
  );
}
