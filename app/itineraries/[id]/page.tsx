import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import ItineraryBuilder from './ItineraryBuilder';
import styles from '../../page.module.css';

export default async function ItineraryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  
  if (!session) redirect('/sign-in');

  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
    include: {
      days: {
        orderBy: { dayNumber: 'asc' },
        include: {
          items: {
            include: {
              place: {
                include: { state: true, city: true, category: true }
              }
            }
          }
        }
      }
    }
  });

  if (!itinerary) notFound();
  if (itinerary.userId !== session.userId) redirect('/itineraries');

  // Also fetch the user's favorites so they can easily add them to the itinerary
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      favorites: {
        include: { state: true, city: true }
      }
    }
  });

  const favorites = user?.favorites || [];

  return (
    <div className={`container ${styles.statesSection}`} style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/itineraries" style={{ color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '0.5rem', display: 'inline-block' }}>
            &larr; Back to Trips
          </Link>
          <h1 className={styles.sectionTitlePrimary} style={{ margin: 0 }}>{itinerary.title}</h1>
        </div>
      </div>

      <ItineraryBuilder itinerary={itinerary} favorites={favorites} />
    </div>
  );
}
