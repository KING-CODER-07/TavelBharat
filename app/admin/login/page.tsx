'use client';

import { useState } from 'react';
import { adminLoginUser } from '@/app/actions/auth';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = await adminLoginUser(null, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If successful, the action will automatically redirect to /admin
  };

  return (
    <div className={styles.loginContainer}>
      <div className={`animate-fade-up ${styles.loginCard}`}>
        <h1 className={styles.loginTitle}>Admin Portal</h1>
        <p className={styles.loginSubtitle}>Secure portal for authorized partners and administrators only.</p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Admin Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Enter admin email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter your secure password"
              required
            />
          </div>
          <button 
            type="submit" 
            className={`btn btn-primary ${styles.loginBtn}`}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
