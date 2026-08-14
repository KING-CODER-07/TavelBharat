'use client';

import { useState } from 'react';
import { toggleFavorite } from '@/app/actions/favorites';
import { useRouter } from 'next/navigation';

export default function FavoriteButton({ 
  placeId, 
  initialFavorited,
  isLoggedIn
}: { 
  placeId: string; 
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      router.push('/sign-in');
      return;
    }

    setLoading(true);
    // Optimistic UI update
    setIsFavorited(!isFavorited);

    const res = await toggleFavorite(placeId);
    
    if (res?.error) {
      // Revert if error
      setIsFavorited(isFavorited);
      alert(res.error);
    }
    
    setLoading(false);
  };

  return (
    <button 
      onClick={handleFavorite}
      disabled={loading}
      style={{
        background: isFavorited ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)',
        color: isFavorited ? '#ef4444' : 'var(--text-primary)',
        border: `1px solid ${isFavorited ? '#ef4444' : 'var(--border-color)'}`,
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-full)',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>
        {isFavorited ? '❤️' : '🤍'}
      </span>
      {isFavorited ? 'Saved to Favorites' : 'Add to Favorites'}
    </button>
  );
}
