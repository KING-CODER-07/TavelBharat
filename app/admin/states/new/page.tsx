import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import styles from '../../admin.module.css';
import ImagePreviewInput from '@/components/admin/ImagePreviewInput';

export default async function NewStatePage() {
  async function addState(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;

    await prisma.state.create({
      data: {
        name,
        description,
        imageUrl: imageUrl || null
      }
    });

    redirect('/admin/states');
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.pageTitle}>Add New State</h1>
      
      <div className={styles.formCard}>
        <form action={addState} className={styles.form}>
          
          <div>
            <label className={styles.label}>State Name *</label>
            <input type="text" name="name" required className="input-field" placeholder="e.g. Kerala" />
          </div>

          <div>
            <label className={styles.label}>Description *</label>
            <textarea name="description" required className="input-field" rows={4} placeholder="Describe the state..."></textarea>
          </div>

          <div>
            <label className={styles.label}>Header Image URL</label>
            <ImagePreviewInput name="imageUrl" />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
              Save State
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
