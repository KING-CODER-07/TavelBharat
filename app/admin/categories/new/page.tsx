import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import styles from '../../admin.module.css';

export default function NewCategoryPage() {

  async function createCategory(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;

    await prisma.category.create({
      data: {
        name,
      }
    });

    revalidatePath('/admin/categories');
    revalidatePath('/');
    redirect('/admin/categories');
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.headerFlex}>
        <h1 className={`${styles.pageTitle} ${styles.noMarginBottom}`}>Add New Category</h1>
        <Link href="/admin/categories" className="btn btn-outline">
          &larr; Back to Categories
        </Link>
      </div>

      <div className={styles.formCard}>
        <form action={createCategory} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label htmlFor="name" className={styles.label}>Category Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="e.g., Heritage, Nature, Adventure" 
                required 
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href="/admin/categories" className="btn btn-outline" style={{ padding: '1rem 2.5rem' }}>
              Cancel
            </Link>
            <button type="submit" className={styles.submitBtn}>
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
