'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import styles from '../layout.module.css';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLight(true);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  return (
    <button 
      onClick={toggleTheme} 
      className={styles.navLink}
      style={{ 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        borderRadius: 'var(--radius-full)'
      }}
      aria-label="Toggle Theme"
    >
      {isLight ? <Moon size={20} color="var(--text-main)" /> : <Sun size={20} color="var(--text-main)" />}
    </button>
  );
}
