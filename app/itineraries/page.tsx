import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import CreateItineraryForm from './CreateItineraryForm';
import styles from '../page.module.css';

const FEATURED_TRAILS = [
  {
    id: 'trail-1',
    title: 'Golden Triangle Royal Heritage Circuit',
    days: '7 Days &bull; Delhi &rarr; Agra &rarr; Jaipur',
    desc: 'Experience the grandeur of Mughal forts, the iconic Taj Mahal, and pink palaces of Rajasthan.',
    tag: 'Heritage & Culture',
    image: '/images/destinations/rajasthan.jpg',
    color: '#F59E0B'
  },
  {
    id: 'trail-2',
    title: 'Himalayan High Altitude Expedition',
    days: '10 Days &bull; Leh &rarr; Nubra Valley &rarr; Pangong',
    desc: 'Cross the world highest motorable passes and camp by crystal blue glacial lakes.',
    tag: 'Adventure & Mountains',
    image: '/images/destinations/ladakh.jpg',
    color: '#3B82F6'
  },
  {
    id: 'trail-3',
    title: 'God Own Country Serenity & Backwaters',
    days: '6 Days &bull; Kochi &rarr; Munnar &rarr; Alleppey',
    desc: 'Misty tea gardens, spice plantations, and luxurious houseboat cruises on tranquil canals.',
    tag: 'Nature & Relaxation',
    image: '/images/destinations/kerala.jpg',
    color: '#10B981'
  },
  {
    id: 'trail-4',
    title: 'Spiritual Ganga & Ghats Pilgrimage',
    days: '5 Days &bull; Haridwar &rarr; Rishikesh &rarr; Varanasi',
    desc: 'Witness divine evening Ganga Aartis, ancient ashrams, and serene riverside yoga rituals.',
    tag: 'Spiritual & Wellness',
    image: '/images/destinations/uttarakhand.jpg',
    color: '#8B5CF6'
  }
];

export default async function ItinerariesPage() {
  const session = await getSession();

  let user = null;
  if (session) {
    try {
      user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          itineraries: {
            include: { _count: { select: { days: true } } },
            orderBy: { updatedAt: 'desc' }
          }
        }
      });
    } catch (e) {
      console.error("Failed to fetch user itineraries:", e);
    }
  }

  return (
    <div className={`container ${styles.statesSection}`} style={{ minHeight: 'calc(100vh - 80px)', paddingBottom: '4rem' }}>
      <div className={`animate-fade-up ${styles.sectionHeader}`}>
        <h1 className={`${styles.sectionTitlePrimary} text-gradient-gold`}>Signature Curated Expeditions &amp; Royal Trails</h1>
        <p className={styles.sectionDesc}>Immerse yourself in masterpiece journeys handcrafted by royal historians and wildlife naturalists, or engineer your own bespoke Indian expedition.</p>
      </div>

      {/* Featured Signature Trails Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 className="text-gradient-emerald" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🌟</span> The TravelBharat Masterpiece Collection
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {FEATURED_TRAILS.map(trail => (
            <div key={trail.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
                <img src={trail.image} alt={trail.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', color: trail.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.15)' }}>
                  {trail.tag}
                </div>
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }} dangerouslySetInnerHTML={{ __html: trail.days }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{trail.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{trail.desc}</p>
                </div>
                <Link href="/search" className="btn btn-outline" style={{ marginTop: '1.25rem', width: '100%', textAlign: 'center', fontSize: '0.85rem' }}>
                  Discover This Sanctuary Trail &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Itineraries Section */}
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '3rem' }}>
        <h2 className="text-gradient-sapphire" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🗺️</span> Your Private Expedition Vault
        </h2>

        {!user ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(16px)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>Sign in to unlock your private expedition vault and bookmark sanctuaries</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              Create day-by-day schedules, add verified destinations, and sync across your devices.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/sign-in" className="btn btn-primary">Sign In to Plan</Link>
              <Link href="/sign-up" className="btn btn-outline">Create Free Account</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
            <div className="card animate-slide-in-left" style={{ padding: '1.5rem', height: 'fit-content' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Create New Trip</h3>
              <CreateItineraryForm />
            </div>

            <div>
              {user.itineraries.length === 0 ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p className={styles.textMuted} style={{ marginBottom: '1rem' }}>You haven't created any custom itineraries yet.</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Use the form on the left to start planning your first trip!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                  {user.itineraries.map((trip) => (
                    <Link href={`/itineraries/${trip.id}`} key={trip.id} className="card animate-fade-up" style={{ padding: '1.5rem', display: 'block' }}>
                      <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{trip.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {trip._count.days} Days Planned
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1rem' }}>
                        Last updated: {new Date(trip.updatedAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
