import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../page.module.css';

export default async function FavoritesPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      favorites: {
        include: {
          state: true,
          city: true,
          category: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/sign-in');
  }

  const { favorites } = user;

  return (
    <div className={`container ${styles.statesSection}`} style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className={`animate-fade-up ${styles.sectionHeader}`}>
        <h1 className={styles.sectionTitlePrimary}>My Favorites</h1>
        <p className={styles.sectionDesc}>Your curated list of top travel destinations in India.</p>
      </div>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }} className="animate-fade-up delay-200">
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            You haven't saved any destinations yet.
          </p>
          <Link href="/#states" className="btn btn-primary">
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className={styles.placesGrid}>
          {favorites.map((place, index) => {
            let images = [];
            try {
              images = place.imageUrls ? JSON.parse(place.imageUrls) : [];
            } catch (e) {
              console.error("Invalid JSON in place.imageUrls:", place.imageUrls);
            }
            const mainImage = images.length > 0 ? images[0] : null;

            return (
              <Link 
                href={`/places/${place.id}`} 
                key={place.id} 
                className="animate-fade-up" 
                style={{ animationDelay: `${(index % 6) * 150}ms` }}
              >
                <div className={`card ${styles.cardContainer}`}>
                  <div className={styles.placeImageContainer}>
                    {mainImage && (
                      <Image 
                        src={mainImage} 
                        alt={place.name} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        sizes="(max-width: 768px) 100vw, 33vw" 
                      />
                    )}
                    <div className={styles.categoryBadge}>
                      {place.category.name}
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{place.name}</h3>
                    <p className={styles.cardLocation}>
                      📍 {place.city?.name}, {place.state.name}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
