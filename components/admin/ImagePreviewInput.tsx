'use client';

import { useState } from 'react';

export default function ImagePreviewInput({ defaultValue = '', name = 'imageUrl' }: { defaultValue?: string, name?: string }) {
  const [url, setUrl] = useState(defaultValue);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input 
        type="url" 
        name={name} 
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="input-field" 
        placeholder="https://..." 
      />
      {url && (
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', width: '100%', maxWidth: '400px', height: '200px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={url} 
            alt="Preview" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPkludmFsaWQgSW1hZ2UgVVJMPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        </div>
      )}
    </div>
  );
}
