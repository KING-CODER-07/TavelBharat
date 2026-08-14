import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminContainer}>
      {/* Admin Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Admin Dashboard</h2>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLinkActive}>
            Dashboard
          </Link>
          <Link href="/admin/places" className={styles.navLink}>
            Manage Places
          </Link>
          <Link href="/admin/states" className={styles.navLink}>
            Manage States
          </Link>
          <Link href="/admin/cities" className={styles.navLink}>
            Manage Cities
          </Link>
          <Link href="/admin/categories" className={styles.navLink}>
            Manage Categories
          </Link>
        </nav>
      </aside>

      {/* Admin Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
