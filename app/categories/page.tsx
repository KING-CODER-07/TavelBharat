import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './categories.module.css';

// Map specific categories to relevant background gradients
const categoryStyles: Record<string, string> = {
  'Heritage': 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  'Nature': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'Religious': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  'Adventure': 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
  'Cultural': 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
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
    <div className={`container ${styles.pageContainer}`}>
      <div className={styles.header}>
        <h1 className={`${styles.title} text-gradient-coral`}>The TravelBharat Royal Themes &amp; Sanctuary Catalogs</h1>
        <p className={styles.subtitle} style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
          Whether your passion lies in UNESCO World Heritage fortresses, untouched Himalayan wildlife, or sacred spiritual ghats — handpick your next Indian expedition.
        </p>
      </div>

      <div className={styles.grid}>
        {categories.map((category) => {
          const background = categoryStyles[category.name] || 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
          
          return (
            <Link href={`/categories/${category.id}`} key={category.id} className={styles.cardLink}>
              <div 
                className={`card ${styles.categoryCard}`} 
                style={{ background }}
              >
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{category.name}</h2>
                  <p className={styles.cardCount}>
                    {category._count.places} Curated Sanctuaries
                  </p>
                </div>
                {/* Subtle overlay effect */}
                <div className={styles.cardOverlay} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
