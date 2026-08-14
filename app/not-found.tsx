import Link from 'next/link';
import styles from './layout.module.css';

export default function NotFound() {
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorTitle}>404 - Page Not Found</h2>
      <p className={styles.errorMessage}>
        Oops! The destination you are looking for does not exist on TravelBharat.
      </p>
      <Link href="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}
