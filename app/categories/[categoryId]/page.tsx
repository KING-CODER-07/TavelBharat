import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './category.module.css';

const categoryStyles: Record<string, string> = {
  'Heritage': 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  'Nature': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'Religious': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  'Adventure': 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
  'Cultural': 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
};

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      places: {
        include: {
          state: true,
          city: true
        }
      }
    }
  });

  if (!category) {
    notFound();
  }

  const background = categoryStyles[category.name] || 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';

  return (
    <div>
      {/* Header */}
      <section 
        className={styles.heroSection}
        style={{ background }}
      >
        <div className={`container ${styles.heroContent}`}>
          <h1 className={`animate-fade-up ${styles.heroTitle}`}>
            {category.name} Destinations
          </h1>
          <p className={`animate-fade-up ${styles.heroSubtitle}`}>
            Explore {category.places.length} amazing spots across India
          </p>
        </div>
      </section>

      {/* Places Grid */}
      <section className={`container ${styles.pageContainer}`}>
        {category.places.length === 0 ? (
          <p className={styles.emptyState}>No destinations found for this category yet.</p>
        ) : (
          <div className={styles.grid}>
            {category.places.map((place) => {
              let images = [];
              try {
                images = place.imageUrls ? JSON.parse(place.imageUrls) : [];
              } catch (e) {
                console.error("Invalid JSON in place.imageUrls:", place.imageUrls);
              }
              const mainImage = images.length > 0 ? images[0] : null;

              return (
                <Link href={`/places/${place.id}`} key={place.id} className={styles.cardLink}>
                  <div className={`card ${styles.cardContainer}`}>
                    <div className={styles.imageContainer}>
                      {mainImage && (
                        <Image
                          src={mainImage}
                          alt={place.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                      <div className={styles.stateBadge}>
                        {place.state.name}
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{place.name}</h3>
                      <p className={styles.cardLocation}>
                        📍 {place.city?.name || place.state.name}
                      </p>
                      <p className={styles.cardDesc}>
                        {place.description.substring(0, 100)}...
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
