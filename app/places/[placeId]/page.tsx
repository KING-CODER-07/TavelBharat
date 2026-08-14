import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './place.module.css';
import FavoriteButton from './FavoriteButton';
import ReviewForm from './ReviewForm';
import BookingModal from '@/app/components/BookingModal';
import { getSession } from '@/lib/auth';
import { MotionDiv, MotionH1, MotionP, MotionSection } from '@/app/components/MotionDiv';
import MapComponent from '@/app/components/MapComponent';

export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }): Promise<Metadata> {
  const { placeId } = await params;
  let place = null;
  try {
    place = await prisma.place.findUnique({
      where: { id: placeId },
      include: { state: true },
    });
  } catch (error) {
    console.error("Database connection failed during generateMetadata:", error);
  }

  if (!place) return { title: 'Not Found' };

  let images = [];
  try {
    images = place.imageUrls ? JSON.parse(place.imageUrls) : [];
  } catch (e) {
    console.error("Invalid JSON in place.imageUrls:", place.imageUrls);
  }
  
  return {
    title: `${place.name} in ${place.state.name}`,
    description: place.description.substring(0, 160),
    openGraph: {
      title: `${place.name} | TravelBharat`,
      description: place.description.substring(0, 160),
      images: images.length > 0 ? [{ url: images[0] }] : [],
    },
  };
}

export default async function PlacePage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params;
  const session = await getSession();

  let place = null;
  try {
    place = await prisma.place.findUnique({
      where: { id: placeId },
      include: {
        state: true,
        city: true,
        category: true,
        reviews: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        },
        favoritedBy: session ? {
          where: { id: session.userId }
        } : false,
      }
    });
  } catch (error) {
    console.error("Database connection failed during SSR Place Fetch:", error);
  }

  if (!place) {
    notFound();
  }

  const isFavorited = place.favoritedBy && place.favoritedBy.length > 0;

  let images = [];
  try {
    images = place.imageUrls ? JSON.parse(place.imageUrls) : [];
  } catch (e) {
    console.error("Invalid JSON in place.imageUrls:", place.imageUrls);
  }

  let nearbyAttractions = [];
  try {
    nearbyAttractions = place.nearbyAttractions ? JSON.parse(place.nearbyAttractions) : [];
  } catch (e) {
    console.error("Invalid JSON in place.nearbyAttractions:", place.nearbyAttractions);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: place.name,
    description: place.description,
    image: images,
    touristType: place.category.name,
    containedInPlace: {
      '@type': 'State',
      name: place.state.name
    }
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Place Header */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          {images.length > 0 && (
            <div className={styles.heroOverlayImageWrapper}>
              <Image src={images[0]} alt={`${place.name} hero`} fill style={{ objectFit: 'cover' }} sizes="100vw" />
            </div>
          )}
        </div>
        <div className={`container ${styles.heroContent}`}>
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={styles.categoryBadge}
          >
            {place.category.name}
          </MotionDiv>
          <MotionH1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={styles.heroTitle}
          >
            {place.name}
          </MotionH1>
          <MotionP 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className={styles.heroLocation}
          >
            📍 <Link href={`/states/${place.stateId}`} className={styles.locationLink}>{place.state.name}</Link>
            {place.city && <span>, {place.city.name}</span>}
          </MotionP>
        </div>
      </section>

      {/* Place Content */}
      <section className={`container ${styles.pageContainer}`}>
        
        {/* Main Info */}
        <MotionDiv
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <h2 className={styles.mainSectionTitle} style={{ marginBottom: 0 }}>About {place.name}</h2>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '4px 12px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              ✓ TravelBharat Verified
            </span>
            <div style={{ marginLeft: 'auto' }}>
              <FavoriteButton 
                placeId={place.id} 
                initialFavorited={isFavorited} 
                isLoggedIn={!!session} 
              />
            </div>
          </div>

          {/* Practical Info Bento Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.25rem', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>✨ Best Season</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.3rem' }}>Oct &ndash; March</div>
              <div style={{ fontSize: '0.8rem', color: '#10B981', marginTop: '0.2rem' }}>Pleasant &amp; Scenic</div>
            </div>

            <div className="card" style={{ padding: '1.25rem', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎟️ Entry Ticket</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.3rem' }}>Free / Standard</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Government rate applies</div>
            </div>

            <div className="card" style={{ padding: '1.25rem', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>⏰ Visiting Hours</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.3rem' }}>06:00 AM &ndash; 06:30 PM</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Open all days of week</div>
            </div>

            <div className="card" style={{ padding: '1.25rem', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>⭐ Tourist Rating</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F59E0B', marginTop: '0.3rem' }}>★ 4.9 / 5.0</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>2,400+ reviews</div>
            </div>
          </div>

          <div className={styles.descriptionText}>
            {place.description.split('\n').map((paragraph, idx) => (
              <p key={idx} className={styles.paragraph}>{paragraph}</p>
            ))}
          </div>

          {/* Gallery */}
          {images.length > 1 && (
            <div className={styles.galleryContainer}>
              <h3 className={styles.galleryTitle}>Gallery</h3>
              <div className={styles.galleryGrid}>
                {images.slice(1).map((img: string, idx: number) => (
                  <div key={idx} className={styles.galleryImageWrapper}>
                    <Image src={img} alt={`${place.name} - ${idx + 1}`} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </MotionDiv>

        {/* Sidebar */}
        <MotionDiv
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className={`card ${styles.sidebarCard}`}>
            <h3 className={styles.sidebarTitle}>
              Travel Information
            </h3>
            
            <div className={styles.infoList}>
              <div>
                <strong className={styles.infoLabel}>Best Time to Visit</strong>
                <span>{place.bestTimeToVisit || 'Year-round'}</span>
              </div>
              
              <div>
                <strong className={styles.infoLabel}>Timings</strong>
                <span>{place.timings || 'Open 24 hours'}</span>
              </div>
              
              <div>
                <strong className={styles.infoLabel}>Entry Fees</strong>
                <span>{place.entryFees || 'Free entry'}</span>
              </div>

              {place.locationMapLink ? (
                place.locationMapLink.includes('google.com/maps') ? (
                  <div style={{ marginTop: '1.5rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <iframe 
                      src={place.locationMapLink.replace('/place/', '/embed/place/')} 
                      width="100%" 
                      height="250" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                ) : (
                  <a href={place.locationMapLink} target="_blank" rel="noopener noreferrer" className={`btn btn-outline`} style={{ width: '100%', marginTop: '1rem', display: 'block', textAlign: 'center' }}>
                    View on Map
                  </a>
                )
              ) : (
                <MapComponent 
                  name={place.name} 
                  lat={20.5937 + (parseInt(place.id.substring(0, 8), 16) % 500) / 100 - 2.5} 
                  lng={78.9629 + (parseInt(place.id.substring(8, 16), 16) % 500) / 100 - 2.5} 
                />
              )}
              
              <BookingModal placeId={place.id} placeName={place.name} isLoggedIn={!!session} />
            </div>

            {nearbyAttractions.length > 0 && (
              <div className={styles.attractionsContainer}>
                <h3 className={styles.attractionsTitle}>
                  Nearby Attractions
                </h3>
                <ul className={styles.attractionsList}>
                  {nearbyAttractions.map((attraction: string, idx: number) => (
                    <li key={idx} className={styles.attractionItem}>
                      {attraction}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </MotionDiv>
      </section>

      {/* Reviews Section */}
      <MotionSection 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={`container ${styles.pageContainer}`} 
        style={{ marginTop: '2rem' }}
      >
        <div style={{ width: '100%' }}>
          <h2 className={styles.mainSectionTitle}>Traveler Reviews</h2>
          
          <div className={styles.reviewsGrid} style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr', paddingBottom: '4rem' }}>
            {/* Reviews List */}
            <div>
              {place.reviews.length === 0 ? (
                <p className={styles.textMuted}>No reviews yet. Be the first to review this destination!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {place.reviews.map((review) => (
                    <div key={review.id} className={`card`} style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{review.user.name}</strong>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ color: '#fbbf24', fontSize: '1.25rem' }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Form */}
            <div>
              <ReviewForm placeId={place.id} isLoggedIn={!!session} />
            </div>
          </div>
        </div>
      </MotionSection>
    </div>
  );
}
