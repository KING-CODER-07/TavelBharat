'use client';

import { useState } from 'react';

export default function MultiImageInput({ defaultUrls = [] }: { defaultUrls?: string[] }) {
  const [urls, setUrls] = useState<string[]>(defaultUrls.length > 0 ? defaultUrls : ['']);

  const addField = () => {
    setUrls([...urls, '']);
  };

  const removeField = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls.length === 0 ? [''] : newUrls);
  };

  const updateUrl = (index: number, val: string) => {
    const newUrls = [...urls];
    newUrls[index] = val;
    setUrls(newUrls);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="hidden" name="imageUrls" value={JSON.stringify(urls.filter(u => u.trim() !== ''))} />
      
      {urls.map((url, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="url" 
              value={url}
              onChange={(e) => updateUrl(index, e.target.value)}
              className="input-field" 
              placeholder="https://..." 
              style={{ flex: 1 }}
            />
            {urls.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeField(index)} 
                className="btn btn-outline"
                style={{ padding: '0.5rem 1rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                Remove
              </button>
            )}
          </div>

          {url && (
            <div style={{ borderRadius: '8px', overflow: 'hidden', height: '150px', background: 'rgba(0,0,0,0.2)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={url} 
                alt={`Preview ${index + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPkludmFsaWQgSW1hZ2UgVVJMPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
          )}
        </div>
      ))}

      <button 
        type="button" 
        onClick={addField} 
        className="btn btn-outline"
        style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
      >
        + Add Another Image
      </button>
    </div>
  );
}
