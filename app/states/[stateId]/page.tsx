import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './state.module.css';

export async function generateMetadata({ params }: { params: Promise<{ stateId: string }> }): Promise<Metadata> {
  const { stateId } = await params;
  const state = await prisma.state.findUnique({
    where: { id: stateId }
  });

  if (!state) return { title: 'Not Found' };

  return {
    title: `Visit ${state.name}`,
    description: state.description || undefined,
    openGraph: {
      title: `${state.name} Tourism | TravelBharat`,
      description: state.description || undefined,
      images: state.imageUrl ? [{ url: state.imageUrl }] : [],
    },
  };
}

export default async function StatePage({ params }: { params: Promise<{ stateId: string }> }) {
  const { stateId } = await params;
  
  const state = await prisma.state.findUnique({
    where: { id: stateId },
    include: {
      places: {
        include: {
          category: true,
          city: true
        }
      }
    }
  });

  if (!state) {
    notFound();
  }

  return (
    <div>
      {/* State Header */}
      <section className={styles.stateHeader}>
        <div className={styles.stateHeaderBg}>
          {state.imageUrl && (
            <Image
              src={state.imageUrl}
              alt={state.name}
              fill
              className={styles.stateHeaderImage}
              sizes="100vw"
            />
          )}
        </div>
        <div className={`container ${styles.stateHeaderContent}`}>
          <h1 className={`animate-fade-up ${styles.stateTitle}`}>
            {state.name}
          </h1>
          <p className={`animate-fade-up ${styles.stateDescription}`}>
            {state.description}
          </p>
        </div>
      </section>

      {/* Places List */}
      <section className={`container ${styles.placesSection}`}>
        <div className={styles.placesHeader}>
          <h2 className={styles.placesTitle}>Top Destinations in {state.name}</h2>
        </div>

        {state.places.length === 0 ? (
          <p className={styles.noPlaces}>No destinations found for this state yet.</p>
        ) : (
          <div className={styles.placesGrid}>
            {state.places.map((place) => {
              let images = [];
              try {
                images = place.imageUrls ? JSON.parse(place.imageUrls) : [];
              } catch (e) {
                console.error("Invalid JSON in place.imageUrls:", place.imageUrls);
              }
              const mainImage = images.length > 0 ? images[0] : null;

              return (
                <Link href={`/places/${place.id}`} key={place.id} className={styles.placeLink}>
                  <div className={`card ${styles.placeCard}`}>
                    <div className={styles.placeImageContainer}>
                      {mainImage && (
                        <Image
                          src={mainImage}
                          alt={place.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                      <div className={styles.placeCategoryBadge}>
                        {place.category.name}
                      </div>
                    </div>
                    <div className={styles.placeContent}>
                      <div className={styles.placeNameRow}>
                        <h3 className={styles.placeName}>{place.name}</h3>
                      </div>
                      <p className={styles.placeCity}>
                        📍 {place.city?.name || state.name}
                      </p>
                      <p className={styles.placeDescription}>
                        {place.description.substring(0, 120)}...
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
