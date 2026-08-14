'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './GlobalSearchBar.module.css';

export default function GlobalSearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchForm}>
      <input 
        type="text" 
        placeholder="Search destinations..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>
        🔍
      </button>
    </form>
  );
}
