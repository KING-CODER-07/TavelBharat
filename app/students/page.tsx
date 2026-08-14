import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './students.module.css';
import { MotionDiv, MotionSection, MotionH1, MotionP } from '../components/MotionDiv';

export const metadata = {
  title: 'Student Hub | TravelBharat',
  description: 'Academic resources, data, and statistics for tourism students.',
};

export default async function StudentsPage() {
  let totalStates = 0;
  let totalCities = 0;
  let totalPlaces = 0;
  let categories: any[] = [];
  let dbError = false;

  try {
    [totalStates, totalCities, totalPlaces, categories] = await Promise.all([
      prisma.state.count(),
      prisma.city.count(),
      prisma.place.count(),
      prisma.category.findMany({ include: { _count: { select: { places: true } } } })
    ]);
  } catch (error) {
    dbError = true;
    console.error("Database connection failed in StudentsPage:", error);
  }

  // Calculate percentages for the data visualization bars
  const maxPlaces = Math.max(...categories.map(cat => cat._count?.places || 0), 1);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <MotionH1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${styles.pageTitle} text-gradient-emerald`}
        >
          The Academic Heritage Fellowship &amp; Student Research Portal
        </MotionH1>
        <MotionP 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.pageDescription}
          style={{ fontSize: '1.08rem', color: 'var(--text-secondary)' }}
        >
          An open-access academic repository offering verifiable national tourism statistics, heritage classifications, and cultural research data for scholars and students.
        </MotionP>
      </header>

      {dbError && (
        <div className="error-banner" style={{ margin: '2rem auto', maxWidth: '800px', textAlign: 'center' }}>
          <p>Unable to connect to the statistics database. Showing cached/offline data.</p>
        </div>
      )}

      <MotionSection 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className={`${styles.sectionTitle} text-gradient-gold`}>Verified India Tourism Metrics</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalStates}</div>
            <div className={styles.statLabel}>Sovereign Regions</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalCities}</div>
            <div className={styles.statLabel}>Heritage Cities</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{totalPlaces}</div>
            <div className={styles.statLabel}>Sanctuary Sites</div>
          </div>
        </div>
      </MotionSection>

      <MotionSection 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className={`${styles.sectionTitle} text-gradient-sapphire`}>Heritage &amp; Theme Taxonomy Breakdown</h2>
        <div className={styles.dataModule}>
          {categories.length > 0 ? categories.map((cat, index) => {
            const percentage = Math.round((cat._count.places / maxPlaces) * 100);
            return (
              <div key={cat.id} className={styles.barContainer} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={styles.barHeader}>
                  <span>{cat.name}</span>
                  <span>{cat._count.places}</span>
                </div>
                <div className={styles.barTrack}>
                  <MotionDiv 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={styles.barFill} 
                  />
                </div>
              </div>
            );
          }) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No category data available</div>
          )}
        </div>
      </MotionSection>

      <MotionSection 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '4rem', textAlign: 'center', marginTop: '4rem' }}
      >
        <h2 className={styles.sectionTitle}>Open Data Access</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          To assist with your data modeling and project research, TravelBharat provides open access to our destination schemas.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link href="/search" className="btn btn-primary">
            Browse All Destinations
          </Link>
          <button className={`btn btn-secondary ${styles.pulseBtn}`} style={{ cursor: 'not-allowed' }} title="Coming soon in production">
            Download Raw Dataset (JSON)
          </button>
        </div>
      </MotionSection>
    </div>
  );
}
