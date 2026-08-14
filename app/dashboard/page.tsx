import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  let user = null;
  try {
    if (session.userId === '000000000000000000000000' || session.userId === 'master-admin-id') {
      user = {
        name: 'Super Admin',
        email: 'admin@travelbharat.com',
        role: 'ADMIN',
        favorites: [],
        bookings: []
      };
    } else {
      user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          favorites: true,
          bookings: {
            include: { place: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }
  } catch (error) {
    console.error("Database connection failed on dashboard:", error);
  }

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.welcomeText}>Welcome back, {user.name}! 👋</h1>
        <p className={styles.subtitle}>Manage your upcoming trips and favorite destinations.</p>
      </header>

      <div className={styles.dashboardGrid}>
        {/* Bookings Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Recent Bookings</h2>
          {user.bookings.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You haven't made any bookings yet.</p>
              <Link href="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Explore Places
              </Link>
            </div>
          ) : (
            <div className={styles.bookingsList}>
              {user.bookings.map(booking => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingHeader}>
                    <h3>{booking.place.name}</h3>
                    <span className={`${styles.statusBadge} ${booking.status === 'Pending' ? styles.pending : styles.confirmed}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className={styles.bookingType}>Type: <strong>{booking.type}</strong></p>
                  <p className={styles.bookingDate}>Requested on: {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Favorites Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Favorite Places</h2>
          {user.favorites.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You have no favorite destinations saved.</p>
            </div>
          ) : (
            <div className={styles.favoritesGrid}>
              {user.favorites.map(place => {
                const images = place.imageUrls ? JSON.parse(place.imageUrls) : [];
                const imageUrl = images[0] || '/images/default-place.jpg';
                return (
                  <Link href={`/places/${place.id}`} key={place.id} className={styles.favoriteCard}>
                    <div 
                      className={styles.favoriteImage}
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <div className={styles.favoriteInfo}>
                      <h4>{place.name}</h4>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
