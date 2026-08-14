import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import styles from './states.module.css';

export default async function StatesPage() {
  const states = await prisma.state.findMany({
    include: {
      _count: {
        select: { places: true }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} text-gradient-sapphire`}>The Sovereign States &amp; Union Territories of Bharat</h1>
        <p className={styles.subtext} style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
          From the regal palaces of Rajasthan and misty Himalayan passes of Ladakh to the tropical backwaters of Kerala — explore India&apos;s 20 sovereign regions.
        </p>
      </div>

      <div className={styles.grid}>
        {states.map((state) => (
          <Link href={`/states/${state.id}`} key={state.id} className={styles.cardLink}>
            <div className={`card ${styles.card}`}>
              <div className={styles.cardImageWrapper}>
                {state.imageUrl && (
                  <Image
                    src={state.imageUrl}
                    alt={state.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                {/* Overlay gradient */}
                <div className={styles.overlay} />

                <div className={styles.stateInfo}>
                  <h3 className={styles.stateName}>{state.name}</h3>
                  <p className={styles.stateCount}>
                    {state._count.places} Sanctuary Destinations
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
