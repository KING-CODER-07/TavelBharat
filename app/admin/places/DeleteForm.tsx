'use client';

import React from 'react';

export default function DeleteForm({ id, action }: { id: string, action: (formData: FormData) => void }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit" 
        className="btn btn-primary" 
        style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#dc3545', border: 'none' }} 
        onClick={(e) => { 
          if(!window.confirm('Are you sure you want to delete this place?')) {
            e.preventDefault(); 
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
