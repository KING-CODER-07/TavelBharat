import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import styles from '../../../admin.module.css';

export default async function EditCityPage({ params }: { params: Promise<{ cityId: string }> }) {
  const { cityId } = await params;
  
  const [city, states] = await Promise.all([
    prisma.city.findUnique({
      where: { id: cityId }
    }),
    prisma.state.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  if (!city) {
    notFound();
  }

  async function updateCity(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;
    const stateId = formData.get('stateId') as string;

    await prisma.city.update({
      where: { id: cityId },
      data: {
        name,
        stateId
      }
    });

    revalidatePath('/admin/cities');
    revalidatePath(`/cities/${cityId}`);
    revalidatePath('/');
    redirect('/admin/cities');
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.headerFlex}>
        <h1 className={`${styles.pageTitle} ${styles.noMarginBottom}`}>Edit City</h1>
        <Link href="/admin/cities" className="btn btn-outline">
          &larr; Back to Cities
        </Link>
      </div>

      <div className={styles.formCard}>
        <form action={updateCity} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label htmlFor="name" className={styles.label}>City Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={city.name}
                required 
              />
            </div>
            <div className={styles.formCol}>
              <label htmlFor="stateId" className={styles.label}>State</label>
              <select id="stateId" name="stateId" defaultValue={city.stateId} required>
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
              Update City
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
