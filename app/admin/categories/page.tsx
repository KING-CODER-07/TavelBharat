import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import styles from '../admin.module.css';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { places: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  async function deleteCategory(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    
    // Check if category has places
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { places: true } } }
    });

    if (category && category._count.places > 0) {
      throw new Error("Cannot delete a category that has places assigned to it. Please reassign the places first.");
    }

    await prisma.category.delete({
      where: { id }
    });
    
    revalidatePath('/admin/categories');
    revalidatePath('/');
  }

  return (
    <div>
      <div className={styles.headerFlex}>
        <h1 className={`${styles.pageTitle} ${styles.noMarginBottom}`}>Manage Categories</h1>
        <Link href="/admin/categories/new" className="btn btn-primary">
          + Add Category
        </Link>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Places</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className={styles.emptyRow}>
                  No categories found. Create one to get started!
                </td>
              </tr>
            ) : (
              categories.map(category => (
                <tr key={category.id} className={styles.tr}>
                  <td className={styles.td}>
                    <strong>{category.name}</strong>
                  </td>
                  <td className={styles.tdMuted}>{category._count.places}</td>
                  <td className={styles.td}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/admin/categories/${category.id}/edit`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                        Edit
                      </Link>
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={category.id} />
                        <button 
                          type="submit" 
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: '#ef4444', borderColor: '#ef4444' }}
                          disabled={category._count.places > 0}
                          title={category._count.places > 0 ? "Cannot delete category with places" : "Delete category"}
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
