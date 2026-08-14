import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import styles from './profile.module.css';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.userId }
    });
  } catch (error) {
    console.error("Failed to load profile:", error);
  }

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className={styles.profileContainer}>
      <header className={styles.profileHeader}>
        <h1 className={styles.pageTitle}>Profile Settings</h1>
        <p className={styles.subtitle}>Update your personal information and preferences.</p>
      </header>

      <div className={`card ${styles.profileFormCard}`}>
        <form action="/api/profile" method="POST" className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Full Name</label>
            <input 
              type="text" 
              id="name"
              name="name" 
              defaultValue={user.name} 
              className={`input-field ${styles.input}`}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              defaultValue={user.email} 
              className={`input-field ${styles.input}`}
              disabled
              title="Email cannot be changed"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>New Password (Optional)</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              placeholder="Leave blank to keep current password"
              className={`input-field ${styles.input}`}
            />
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
