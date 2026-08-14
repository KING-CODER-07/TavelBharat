import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import CustomIndiaMap from '../components/CustomIndiaMap';
import MapTicker from '../components/MapTicker';
import { MotionDiv, MotionH1, MotionP, MotionSection } from './components/MotionDiv';
import GlobalSearchBar from './components/GlobalSearchBar';
import TestimonialMarquee from './components/TestimonialMarquee';

export default async function Home() {
  let states: any[] = [];
  let featuredPlaces: any[] = [];
  let offbeatPlaces: any[] = [];
  let categories: any[] = [];
  let itineraries: any[] = [];
  let placesCount = 0;
  let citiesCount = 0;

  try {
    [states, featuredPlaces, offbeatPlaces, categories, itineraries, placesCount, citiesCount] = await Promise.all([
      prisma.state.findMany({
        include: {
          _count: {
            select: { places: true, cities: true }
          }
        }
      }),
      prisma.place.findMany({
        take: 6,
        include: {
          state: true,
          category: true,
          city: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.place.findMany({
        where: { isOffbeat: true },
        take: 4,
        include: { state: true, category: true, city: true }
      }),
      prisma.category.findMany(),
      prisma.itinerary.findMany({
        take: 3,
        include: {
          days: true,
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.place.count(),
      prisma.city.count()
    ]);
  } catch (error) {
    console.error("Database connection failed during SSR. Rendering fallback empty states.");
  }

  // Fallback itineraries if none exist in database yet
  const sampleItineraries = [
    {
      id: 'sample-1',
      title: '7-Day Golden Triangle Luxury Trail',
      desc: 'Experience the regal palaces of Jaipur, the iconic Taj Mahal in Agra, and historic Old Delhi with private luxury transport.',
      daysCount: 7,
      category: 'Heritage & Royalty'
    },
    {
      id: 'sample-2',
      title: '10-Day Ladakh Himalayan Adventure',
      desc: 'Journey across Pangong Tso, Nubra Valley, and ancient monasteries surrounded by the dramatic snow-capped Himalayas.',
      daysCount: 10,
      category: 'Adventure & Nature'
    },
    {
      id: 'sample-3',
      title: '5-Day Kerala Backwaters & Spice Odyssey',
      desc: 'Cruise peacefully on a private luxury houseboat through Alleppey backwaters and explore Munnar aromatic tea plantations.',
      daysCount: 5,
      category: 'Wellness & Leisure'
    }
  ];

  const displayedItineraries = itineraries.length > 0 ? itineraries.map((it: any) => ({
    id: it.id,
    title: it.title,
    desc: `Handcrafted ${it.days?.length || 5}-day trail planned by ${it.user?.name || 'TravelBharat Concierge'}.`,
    daysCount: it.days?.length || 5,
    category: 'Verified Trail'
  })) : sampleItineraries;

  return (
    <div>
      {/* Hero Section */}
      <MotionSection 
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={styles.heroBg} />
        <div className={styles.heroMesh} />
        <div className={`container ${styles.heroContent}`}>
          <MotionH1 
            className={`${styles.heroTitle} text-gradient-emerald`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          >
            Discover the Eternal Soul of Incredible India
          </MotionH1>
          <MotionP 
            className={styles.heroSubtitle}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Embark on bespoke luxury journeys across 20 sovereign states and 60 sanctuary destinations — handcrafted for discerning explorers, scholars, and cultural seekers.
          </MotionP>
          
          <MotionDiv 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', marginTop: '2rem' }}
          >
            <div style={{ background: 'var(--glass-bg)', padding: '0.5rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(16px)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-glow)' }}>
              <GlobalSearchBar />
            </div>

            {/* Category Quick Chips */}
            <div className={styles.categoryChips}>
              {categories.slice(0, 6).map((cat: any) => (
                <Link key={cat.id} href={`/categories/${cat.id}`} className={styles.categoryChip}>
                  <span>✨</span> {cat.name}
                </Link>
              ))}
            </div>
          </MotionDiv>

          {/* Hero Live Stats Bar */}
          <MotionDiv 
            className={styles.statBar}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className={styles.statPill}>
              <span className={styles.statIcon}>✨</span>
              <span>{placesCount > 0 ? `${placesCount}+` : '60'} Sanctuary Destinations</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statIcon}>📍</span>
              <span>{states.length > 0 ? states.length : '20'} Sovereign States &amp; UTs</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statIcon}>🏙️</span>
              <span>{citiesCount > 0 ? `${citiesCount}+` : '35+'} Heritage Cities</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statIcon}>⭐</span>
              <span>4.9/5 Elite Explorer Rating</span>
            </div>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* How TravelBharat Works - 3 Step Walkthrough */}
      <section className={styles.stepsSection}>
        <div className="container">
          <MotionDiv 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`${styles.sectionTitlePrimary} text-gradient-gold`}>The Art of TravelBharat Discovery</h2>
            <p className={styles.sectionDesc}>From royal Rajasthani fortresses to tranquil Himalayan monasteries, we transform how you experience India&apos;s heritage.</p>
          </MotionDiv>

          <div className={styles.stepsGrid}>
            <div className={`${styles.stepCard} animate-fade-up`}>
              <span className={styles.stepNumber}>01</span>
              <h3 className={`${styles.stepTitle} text-gradient-emerald`}>Curate Your Horizon</h3>
              <p className={styles.stepDesc}>
                Explore 20 states and 5 curated themes using our interactive India map, real-time command search, and architectural galleries.
              </p>
            </div>
            <div className={`${styles.stepCard} animate-fade-up`} style={{ animationDelay: '150ms' }}>
              <span className={styles.stepNumber}>02</span>
              <h3 className={`${styles.stepTitle} text-gradient-sapphire`}>Handcraft Your Trail</h3>
              <p className={styles.stepDesc}>
                Bookmark sacred sanctuaries, customize day-by-day royal expeditions, and collaborate with your travel companions in real time.
              </p>
            </div>
            <div className={`${styles.stepCard} animate-fade-up`} style={{ animationDelay: '300ms' }}>
              <span className={styles.stepNumber}>03</span>
              <h3 className={`${styles.stepTitle} text-gradient-coral`}>Embark With Distinction</h3>
              <p className={styles.stepDesc}>
                Journey with verified local guides, luxury boutique stays, transparent concierge pricing, and 24/7 dedicated AI travel support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Places Section */}
      <section className={`container ${styles.featuredSection}`}>
        <MotionDiv 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`${styles.sectionTitle} text-gradient-emerald`}>Sanctuary Destinations &amp; Royal Refuges</h2>
          <p className={styles.sectionDesc}>An exclusive portfolio of India&apos;s most breathtaking architectural wonders and pristine natural retreats.</p>
        </MotionDiv>

        <div className={styles.placesGrid}>
          {featuredPlaces.map((place, index) => {
            let images = [];
            try {
              images = place.imageUrls ? JSON.parse(place.imageUrls) : [];
            } catch (e) {}
            const mainImage = images.length > 0 ? images[0] : null;
            
            // Bento logic: first is hero, next is wide, rest are standard
            let bentoClass = styles.bentoStandard;
            if (index === 0) bentoClass = styles.bentoHero;
            else if (index === 1 || index === 4) bentoClass = styles.bentoWide;

            return (
              <Link href={`/places/${place.id}`} key={place.id} className={`animate-fade-up ${bentoClass}`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`card ${styles.cardContainer}`} style={{ position: 'relative', overflow: 'hidden' }}>
                  <div className={styles.placeImageContainer}>
                    {mainImage && (
                      <Image src={mainImage} alt={place.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
                    )}
                    <div className={styles.categoryBadge} style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 3 }}>
                      {place.category.name}
                    </div>
                    <div className={styles.cardRating}>
                      ★ 4.9 • Best Seller
                    </div>
                  </div>
                  
                  {/* Hover reveal content */}
                  <div className={styles.cardContentHover}>
                    <h3 className={styles.cardTitle} style={{ color: 'white' }}>{place.name}</h3>
                    <p className={styles.cardLocation} style={{ color: '#E2E8F0' }}>
                      📍 {place.city?.name}, {place.state.name}
                    </p>
                    <p className={styles.cardDesc} style={{ color: '#CBD5E1', display: index === 0 ? 'block' : 'none' }}>
                      {place.description.substring(0, 120)}...
                    </p>
                    <div className={styles.exploreBtn}>
                      Explore Destination &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Handcrafted Itineraries Preview Section */}
      <section className={styles.itinerarySection}>
        <div className="container">
          <MotionDiv 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`${styles.sectionTitlePrimary} text-gradient-gold`}>Signature Curated Expeditions</h2>
            <p className={styles.sectionDesc}>Masterpiece multi-day itineraries crafted by royal historians, wildlife naturalists, and luxury travel curators.</p>
          </MotionDiv>

          <div className={styles.itineraryGrid}>
            {displayedItineraries.map((itin: any, index: number) => (
              <Link href={itin.id.startsWith('sample') ? '/itineraries' : `/itineraries/${itin.id}`} key={itin.id}>
                <div className={styles.itineraryCard}>
                  <div>
                    <span className={styles.itineraryBadge}>{itin.daysCount} Days &bull; {itin.category}</span>
                    <h3 className={styles.itineraryTitle}>{itin.title}</h3>
                    <p className={styles.itineraryDesc}>{itin.desc}</p>
                  </div>
                  <div className={styles.exploreLink}>
                    Explore This Expedition &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link href="/itineraries" className="btn btn-primary">
              Discover All Signature Trails &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Hidden Gems Section */}
      {offbeatPlaces.length > 0 && (
        <section className={`container ${styles.statesSection}`} style={{ backgroundColor: 'var(--bg-card)', padding: '4rem 2rem', borderRadius: 'var(--radius-xl)' }}>
          <MotionDiv 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitlePrimary}>Hidden Gems</h2>
            <p className={styles.sectionDesc}>Discover untouched and lesser-known destinations away from the crowds.</p>
          </MotionDiv>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {offbeatPlaces.map((place, index) => {
              let images = [];
              try {
                images = place.imageUrls ? JSON.parse(place.imageUrls) : [];
              } catch (e) {
                console.error("Invalid JSON in place.imageUrls:", place.imageUrls);
              }
              const mainImage = images.length > 0 ? images[0] : null;
              return (
                <Link href={`/places/${place.id}`} key={place.id}>
                  <MotionDiv 
                    className={`card ${styles.cardContainer}`} 
                    style={{ height: '100%', perspective: '1000px' }}
                    whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5, boxShadow: 'var(--shadow-glow-accent)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className={styles.placeImageContainer} style={{ height: '150px' }}>
                      {mainImage && (
                        <Image src={mainImage} alt={place.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 250px" />
                      )}
                      <div className={styles.categoryBadge} style={{ backgroundColor: 'var(--accent)' }}>
                        Offbeat
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{place.name}</h3>
                      <p className={styles.cardLocation} style={{ fontSize: '0.9rem' }}>
                        📍 {place.city?.name}, {place.state.name}
                      </p>
                    </div>
                  </MotionDiv>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* States Section */}
      <section id="states" className={`container ${styles.statesSection}`}>
        <MotionDiv 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`${styles.sectionTitlePrimary} text-gradient-sapphire`}>The Sovereign States &amp; Kingdoms of Bharat</h2>
          <p className={styles.sectionDesc}>Click any region on our interactive map or directory to immerse yourself in its timeless heritage and architectural wonders.</p>
        </MotionDiv>

        {/* Interactive Map */}
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <MapTicker states={states as any} />
          <CustomIndiaMap dbStates={states as any} />
        </MotionDiv>

        <div className={styles.carousel}>
          {states.map((state) => (
            <div key={state.id} className={styles.carouselItemLarge}>
              <Link href={`/states/${state.id}`} className={styles.cardLink}>
                <div className={`card ${styles.cardContainer}`}>
                  <div className={styles.stateImageContainer}>
                    {state.imageUrl && (
                      <Image
                        src={state.imageUrl}
                        alt={state.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 300px"
                        priority={true}
                      />
                    )}
                    <div className={styles.countBadge}>
                      {state._count.places} Sanctuaries
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{state.name}</h3>
                      <p className={styles.cardDesc}>
                        {state.description?.substring(0, 100)}...
                      </p>
                      <div className={styles.exploreLink}>
                        Discover Territory &rarr;
                      </div>
                    </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Carousel Section */}
      <section className={`container ${styles.statesSection} ${styles.categoriesSection}`}>
        <MotionDiv 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`${styles.sectionTitlePrimary} text-gradient-coral`}>Curated Travel Themes &amp; Royal Interests</h2>
          <p className={styles.sectionDesc}>From UNESCO World Heritage fortresses to spiritual Himalayan ghats — explore by your personal passion.</p>
        </MotionDiv>

        <MotionDiv 
          className={`carousel ${styles.carouselPadding}`}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {categories.map((cat) => (
            <div key={cat.id} className={`carousel-item ${styles.categoryCarouselItem}`}>
              <Link href={`/categories/${cat.id}`} className={styles.cardLink}>
                <div className={`card ${styles.cardContainer} ${styles.categoryCard}`}>
                  <h3 className={styles.categoryTitle}>{cat.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </MotionDiv>
      </section>

      {/* Testimonials Section */}
      <section className={styles.statesSection} style={{ overflow: 'hidden' }}>
        <MotionDiv 
          className={`container ${styles.sectionHeader}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`${styles.sectionTitlePrimary} text-gradient-gold`}>Words From Our Elite Explorers</h2>
          <p className={styles.sectionDesc}>Read authentic reflections from scholars, diplomats, and travelers who have experienced TravelBharat&apos;s signature hospitality.</p>
        </MotionDiv>
        
        <TestimonialMarquee />
      </section>

      {/* Trust Indicators Section */}
      <section className={styles.trustSection}>
        <div className={`container ${styles.trustGrid}`}>
          <div className={`${styles.trustCard} animate-slide-in-left`}>
            <span className={styles.trustIcon}>💎</span>
            <h3 className="text-gradient-emerald">Bespoke Sanctuary Standards</h3>
            <p>Every palace stay, boutique retreat, and naturalist expedition is rigorously vetted to guarantee uncompromising luxury.</p>
          </div>
          <div className={`${styles.trustCard} animate-fade-up ${styles.delay200}`}>
            <span className={styles.trustIcon}>🛡️</span>
            <h3 className="text-gradient-sapphire">Sovereign &amp; Institutional Trust</h3>
            <p>Partnered with India&apos;s leading cultural ministries, academic fellowships, and luxury corporate delegations.</p>
          </div>
          <div className={`${styles.trustCard} animate-slide-in-right ${styles.delay400}`}>
            <span className={styles.trustIcon}>🎧</span>
            <h3 className="text-gradient-coral">24/7 Royal Concierge</h3>
            <p>Our dedicated travel historians and AI travel advisors remain at your service at every mile of your Indian odyssey.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={`animate-fade-up ${styles.ctaTitle} text-gradient-emerald`}>Ready to Handcraft Your Indian Odyssey?</h2>
          <p className={`animate-fade-up ${styles.ctaDesc} ${styles.delay200}`}>Connect with your dedicated TravelBharat Private Concierge to begin tailoring your unforgettable expedition.</p>
          <div className={`animate-fade-up ${styles.animationDelay400}`}>
            <Link href="/contact" className={`btn btn-secondary ${styles.btnLarge}`}>
              Request Private Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

