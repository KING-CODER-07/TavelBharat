import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import styles from '../admin.module.css';

export default async function AdminCitiesPage() {
  const cities = await prisma.city.findMany({
    include: {
      state: true,
      _count: {
        select: { places: true }
      }
    },
    orderBy: [
      { state: { name: 'asc' } },
      { name: 'asc' }
    ]
  });

  async function deleteCity(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    
    // Check if city has places
    const city = await prisma.city.findUnique({
      where: { id },
      include: { _count: { select: { places: true } } }
    });

    if (city && city._count.places > 0) {
      throw new Error("Cannot delete a city that has places assigned to it. Please reassign the places first.");
    }

    await prisma.city.delete({
      where: { id }
    });
    
    revalidatePath('/admin/cities');
    revalidatePath('/');
  }

  return (
    <div>
      <div className={styles.headerFlex}>
        <h1 className={`${styles.pageTitle} ${styles.noMarginBottom}`}>Manage Cities</h1>
        <Link href="/admin/cities/new" className="btn btn-primary">
          + Add City
        </Link>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>State</th>
              <th className={styles.th}>Places</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyRow}>
                  No cities found. Create one to get started!
                </td>
              </tr>
            ) : (
              cities.map(city => (
                <tr key={city.id} className={styles.tr}>
                  <td className={styles.td}>
                    <strong>{city.name}</strong>
                  </td>
                  <td className={styles.tdMuted}>{city.state.name}</td>
                  <td className={styles.tdMuted}>{city._count.places}</td>
                  <td className={styles.td}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/admin/cities/${city.id}/edit`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                        Edit
                      </Link>
                      <form action={deleteCity}>
                        <input type="hidden" name="id" value={city.id} />
                        <button 
                          type="submit" 
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: '#ef4444', borderColor: '#ef4444' }}
                          disabled={city._count.places > 0}
                          title={city._count.places > 0 ? "Cannot delete city with places" : "Delete city"}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
