'use client';

import { useActionState } from 'react';
import { registerUser } from '@/app/actions/auth';
import Link from 'next/link';
import styles from './auth.module.css';

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <div className={styles.authContainer}>
      <div className={`animate-fade-up ${styles.authCard}`}>
        <h1 className={styles.authTitle}>Create an Account</h1>
        <p className={styles.authSubtitle}>Join TravelBharat to save your favorite destinations</p>

        {state?.error && <div className={styles.errorMessage}>{state.error}</div>}

        <form action={formAction}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              placeholder="Enter your name"
              required
            />
          </div>
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
              placeholder="Create a password (min. 6 characters)"
              required
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={isPending}
          >
            {isPending ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.switchAuth}>
          Already have an account? <Link href="/sign-in">Log In</Link>
        </p>
      </div>
    </div>
  );
}
