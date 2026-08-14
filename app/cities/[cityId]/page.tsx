import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './city.module.css';

export async function generateMetadata({ params }: { params: Promise<{ cityId: string }> }): Promise<Metadata> {
  const { cityId } = await params;
  const city = await prisma.city.findUnique({
    where: { id: cityId },
    include: { state: true }
  });

  if (!city) return { title: 'Not Found' };

  return {
    title: `Visit ${city.name}, ${city.state.name}`,
    description: `Explore the top tourist destinations and attractions in ${city.name}, ${city.state.name}.`,
    openGraph: {
      title: `${city.name} Tourism | TravelBharat`,
      description: `Explore the top tourist destinations and attractions in ${city.name}, ${city.state.name}.`
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ cityId: string }> }) {
  const { cityId } = await params;
  
  const city = await prisma.city.findUnique({
    where: { id: cityId },
    include: {
      state: true,
      places: {
        include: {
          category: true,
          city: true
        }
      }
    }
  });

  if (!city) {
    notFound();
  }

  // Find a hero image from one of the places in the city
  let heroImage = null;
  for (const place of city.places) {
    if (place.imageUrls) {
      try {
        const images = JSON.parse(place.imageUrls);
        if (images.length > 0) {
          heroImage = images[0];
          break;
        }
      } catch (e) {
        // Ignore parse error here
      }
    }
  }

  return (
    <div>
      {/* City Header */}
      <section className={styles.stateHeader}>
        <div className={styles.stateHeaderBg}>
          {heroImage && (
            <Image
              src={heroImage}
              alt={city.name}
              fill
              className={styles.stateHeaderImage}
              sizes="100vw"
            />
          )}
        </div>
        <div className={`container ${styles.stateHeaderContent}`}>
          <h1 className={`animate-fade-up ${styles.stateTitle}`}>
            {city.name}
          </h1>
          <p className={`animate-fade-up ${styles.stateDescription}`}>
            Explore the best destinations in {city.name}, {city.state.name}.
          </p>
        </div>
      </section>

      {/* Places List */}
      <section className={`container ${styles.placesSection}`}>
        <div className={styles.placesHeader}>
          <h2 className={styles.placesTitle}>Top Destinations in {city.name}</h2>
        </div>

        {city.places.length === 0 ? (
          <p className={styles.noPlaces}>No destinations found for this city yet.</p>
        ) : (
          <div className={styles.placesGrid}>
            {city.places.map((place) => {
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
                        📍 {place.city?.name || city.name}, {city.state.name}
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
