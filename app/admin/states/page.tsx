import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from '../admin.module.css';

export default async function AdminStatesPage() {
  const states = await prisma.state.findMany({
    include: {
      _count: {
        select: { places: true, cities: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.headerFlex}>
        <h1 className={`${styles.pageTitle} ${styles.noMarginBottom}`}>Manage States</h1>
        <Link href="/admin/states/new" className="btn btn-primary">
          + Add New State
        </Link>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Total Places</th>
              <th className={styles.th}>Added On</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {states.map((state) => (
              <tr key={state.id} className={styles.tr}>
                <td className={styles.td}>
                  <Link href={`/states/${state.id}`} className={styles.placeNameLink}>
                    {state.name}
                  </Link>
                </td>
                <td className={styles.td}>
                  <span className={styles.categoryBadge}>
                    {state._count.places}
                  </span>
                </td>
                <td className={styles.tdMuted}>
                  {state.createdAt.toLocaleDateString()}
                </td>
                <td className={styles.td}>
                  <Link href={`/admin/states/${state.id}/edit`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {states.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.emptyRow}>
                  No states found. Add your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
