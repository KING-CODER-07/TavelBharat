'use client';

import Link from 'next/link';
import { logoutUser } from '@/app/actions/auth';
import type { SessionPayload } from '@/lib/auth';
import styles from '../layout.module.css';

export default function AuthNav({ session }: { session: SessionPayload | null }) {
  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/dashboard" className={styles.navLink}>
          Dashboard
        </Link>
        <Link href="/profile" className={styles.navLink}>
          Profile
        </Link>
        <button 
          onClick={() => logoutUser()} 
          className={styles.navLink}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link href="/sign-in" className={styles.navLink}>
      Sign In
    </Link>
  );
}
