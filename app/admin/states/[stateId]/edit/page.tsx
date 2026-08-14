import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import styles from '../../../admin.module.css';
import ImagePreviewInput from '@/components/admin/ImagePreviewInput';

export default async function EditStatePage({ params }: { params: Promise<{ stateId: string }> }) {
  const { stateId } = await params;
  
  const state = await prisma.state.findUnique({
    where: { id: stateId }
  });

  if (!state) {
    notFound();
  }

  async function updateState(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;

    await prisma.state.update({
      where: { id: stateId },
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
      <h1 className={styles.pageTitle}>Edit State</h1>
      
      <div className={styles.formCard}>
        <form action={updateState} className={styles.form}>
          
          <div>
            <label className={styles.label}>State Name *</label>
            <input type="text" name="name" defaultValue={state.name} required className="input-field" placeholder="e.g. Kerala" />
          </div>

          <div>
            <label className={styles.label}>Description *</label>
            <textarea name="description" defaultValue={state.description || ''} required className="input-field" rows={4} placeholder="Describe the state..."></textarea>
          </div>

          <div>
            <label className={styles.label}>Header Image URL</label>
            <ImagePreviewInput name="imageUrl" defaultValue={state.imageUrl || ''} />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
              Update State
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
