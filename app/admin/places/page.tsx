import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import styles from '../admin.module.css';
import DeleteForm from './DeleteForm';

export default async function AdminPlacesPage() {
  const places = await prisma.place.findMany({
    include: { state: true, category: true, city: true },
    orderBy: { createdAt: 'desc' }
  });

  async function deletePlace(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await prisma.place.delete({ where: { id } });
    revalidatePath('/admin/places');
    revalidatePath('/search');
    revalidatePath('/');
  }

  return (
    <div>
      <div className={styles.headerFlex}>
        <h1 className={`${styles.pageTitle} ${styles.noMarginBottom}`}>Manage Destinations</h1>
        <Link href="/admin/places/new" className="btn btn-primary">
          + Add New Destination
        </Link>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Category</th>
              <th className={styles.th}>Added On</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id} className={styles.tr}>
                <td className={styles.td}>
                  <Link href={`/places/${place.id}`} className={styles.placeNameLink}>
                    {place.name}
                  </Link>
                </td>
                <td className={styles.tdMuted}>
                  {place.city?.name ? `${place.city.name}, ` : ''}{place.state.name}
                </td>
                <td className={styles.td}>
                  <span className={styles.categoryBadge}>
                    {place.category.name}
                  </span>
                </td>
                <td className={styles.tdMuted}>
                  {place.createdAt.toLocaleDateString()}
                </td>
                <td className={styles.td} style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Link href={`/admin/places/${place.id}/edit`} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>
                      Edit
                    </Link>
                    <DeleteForm id={place.id} action={deletePlace} />
                  </div>
                </td>
              </tr>
            ))}
            {places.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.emptyRow}>
                  No destinations found. Add your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
