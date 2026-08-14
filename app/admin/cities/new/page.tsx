import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import styles from '../../admin.module.css';

export default async function NewCityPage() {
  const states = await prisma.state.findMany({
    orderBy: { name: 'asc' }
  });

  async function createCity(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;
    const stateId = formData.get('stateId') as string;

    await prisma.city.create({
      data: {
        name,
        stateId
      }
    });

    revalidatePath('/admin/cities');
    revalidatePath('/');
    redirect('/admin/cities');
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.headerFlex}>
        <h1 className={`${styles.pageTitle} ${styles.noMarginBottom}`}>Add New City</h1>
        <Link href="/admin/cities" className="btn btn-outline">
          &larr; Back to Cities
        </Link>
      </div>

      <div className={styles.formCard}>
        <form action={createCity} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label htmlFor="name" className={styles.label}>City Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="e.g., Jaipur, Mumbai" 
                required 
              />
            </div>
            <div className={styles.formCol}>
              <label htmlFor="stateId" className={styles.label}>State</label>
              <select id="stateId" name="stateId" required>
                <option value="">Select a State</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href="/admin/cities" className="btn btn-outline" style={{ padding: '1rem 2.5rem' }}>
              Cancel
            </Link>
            <button type="submit" className={styles.submitBtn}>
              Create City
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
