'use client';

import { useState } from 'react';
import { addDay, addPlaceToDay, removePlaceFromDay } from '@/app/actions/itineraries';
import Image from 'next/image';

export default function ItineraryBuilder({ itinerary, favorites }: { itinerary: any, favorites: any[] }) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [isAddingPlace, setIsAddingPlace] = useState(false);

  const handleAddDay = async () => {
    setIsAddingDay(true);
    await addDay(itinerary.id, itinerary.days.length);
    setIsAddingDay(false);
  };

  const handleAddPlace = async (placeId: string) => {
    if (!selectedDayId) return alert('Select a day first');
    setIsAddingPlace(true);
    await addPlaceToDay(selectedDayId, placeId);
    setIsAddingPlace(false);
    setSelectedDayId(null);
  };

  const handleRemovePlace = async (itemId: string) => {
    await removePlaceFromDay(itemId, itinerary.id);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
      
      {/* Itinerary Days */}
      <div>
        {itinerary.days.map((day: any) => (
          <div key={day.id} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>Day {day.dayNumber}</h3>
              <button 
                onClick={() => setSelectedDayId(day.id)}
                className="btn btn-outline" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                + Add Place
              </button>
            </div>

            {day.items.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No places scheduled for this day yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {day.items.map((item: any) => {
                  let img = '/images/placeholder.jpg';
                  try {
                    const parsed = JSON.parse(item.place.imageUrls);
                    if (parsed.length > 0) img = parsed[0];
                  } catch (e) {}

                  return (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--glass-bg)', padding: '0.75rem', borderRadius: '12px' }}>
                      <div style={{ position: 'relative', width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                        <Image src={img} alt={item.place.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0 }}>{item.place.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.time} • {item.place.city?.name}</p>
                      </div>
                      <button 
                        onClick={() => handleRemovePlace(item.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        
        <button 
          onClick={handleAddDay} 
          disabled={isAddingDay}
          className="btn btn-outline" 
          style={{ width: '100%', padding: '1rem', borderStyle: 'dashed' }}
        >
          {isAddingDay ? 'Adding...' : '+ Add Another Day'}
        </button>
      </div>

      {/* Favorites Sidebar (Modal-like behavior) */}
      {selectedDayId && (
        <div className="card" style={{ padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Your Favorites</h3>
            <button onClick={() => setSelectedDayId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
          
          {favorites.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Go favorite some places first!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '500px', overflowY: 'auto' }}>
              {favorites.map((fav) => (
                <div key={fav.id} style={{ padding: '0.5rem', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{fav.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{fav.city?.name}</div>
                  </div>
                  <button 
                    onClick={() => handleAddPlace(fav.id)}
                    disabled={isAddingPlace}
                    className="btn btn-primary"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
