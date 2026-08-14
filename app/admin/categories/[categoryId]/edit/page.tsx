import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import styles from '../../../admin.module.css';

export default async function EditCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    notFound();
  }

  async function updateCategory(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
      }
    });

    revalidatePath('/admin/categories');
    revalidatePath(`/categories/${categoryId}`);
    revalidatePath('/');
    redirect('/admin/categories');
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.headerFlex}>
        <h1 className={`${styles.pageTitle} ${styles.noMarginBottom}`}>Edit Category</h1>
        <Link href="/admin/categories" className="btn btn-outline">
          &larr; Back to Categories
        </Link>
      </div>

      <div className={styles.formCard}>
        <form action={updateCategory} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label htmlFor="name" className={styles.label}>Category Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={category.name}
                required 
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href="/admin/categories" className="btn btn-outline" style={{ padding: '1rem 2.5rem' }}>
              Cancel
            </Link>
            <button type="submit" className={styles.submitBtn}>
              Update Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
