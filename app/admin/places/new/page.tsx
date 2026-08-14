import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import styles from '../../admin.module.css';
import MultiImageInput from '@/components/admin/MultiImageInput';

export default async function NewPlacePage() {
  const [states, categories] = await Promise.all([
    prisma.state.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  async function addPlace(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const stateId = formData.get('stateId') as string;
    const categoryId = formData.get('categoryId') as string;
    const cityName = formData.get('cityName') as string;
    const imageUrlsRaw = formData.get('imageUrls') as string;
    const bestTimeToVisit = formData.get('bestTimeToVisit') as string;
    const entryFees = formData.get('entryFees') as string;
    const timings = formData.get('timings') as string;

    // Handle City creation or lookup
    let cityId: string | null = null;
    if (cityName) {
      let city = await prisma.city.findFirst({
        where: { name: cityName, stateId }
      });
      if (!city) {
        city = await prisma.city.create({
          data: { name: cityName, stateId }
        });
      }
      cityId = city.id;
    }

    await prisma.place.create({
      data: {
        name,
        description,
        stateId,
        categoryId,
        cityId,
        imageUrls: imageUrlsRaw && imageUrlsRaw !== '[]' ? imageUrlsRaw : null,
        bestTimeToVisit,
        entryFees,
        timings
      }
    });

    redirect('/admin');
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.pageTitle}>Add New Destination</h1>
      
      <div className={styles.formCard}>
        <form action={addPlace} className={styles.form}>
          
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.label}>Place Name *</label>
              <input type="text" name="name" required className="input-field" placeholder="e.g. Taj Mahal" />
            </div>
            <div className={styles.formCol}>
              <label className={styles.label}>City Name</label>
              <input type="text" name="cityName" className="input-field" placeholder="e.g. Agra" />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.label}>State *</label>
              <select name="stateId" required className="input-field">
                <option value="">Select a State</option>
                {states.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.formCol}>
              <label className={styles.label}>Category *</label>
              <select name="categoryId" required className="input-field">
                <option value="">Select a Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={styles.label}>Description *</label>
            <textarea name="description" required className="input-field" rows={5} placeholder="Describe the place..."></textarea>
          </div>

          <div>
            <label className={styles.label}>Image URLs</label>
            <MultiImageInput defaultUrls={[]} />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.label}>Best Time to Visit</label>
              <input type="text" name="bestTimeToVisit" className="input-field" placeholder="e.g. Oct to Mar" />
            </div>
            <div className={styles.formCol}>
              <label className={styles.label}>Timings</label>
              <input type="text" name="timings" className="input-field" placeholder="e.g. 6 AM to 6 PM" />
            </div>
            <div className={styles.formCol}>
              <label className={styles.label}>Entry Fees</label>
              <input type="text" name="entryFees" className="input-field" placeholder="e.g. ₹50" />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
              Save Destination
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
