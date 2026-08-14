'use client';

import { useActionState } from 'react';
import { loginUser } from '@/app/actions/auth';
import Link from 'next/link';
import styles from '../sign-up/auth.module.css';

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(loginUser, null);

  return (
    <div className={styles.authContainer}>
      <div className={`animate-fade-up ${styles.authCard}`}>
        <h1 className={styles.authTitle}>Welcome Back</h1>
        <p className={styles.authSubtitle}>Log in to access your curated travel wishlist</p>

        {state?.error && <div className={styles.errorMessage}>{state.error}</div>}

        <form action={formAction}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit" 
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={isPending}
          >
            {isPending ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className={styles.switchAuth}>
          Don't have an account? <Link href="/sign-up">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
