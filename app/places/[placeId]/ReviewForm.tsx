'use client';

import { useActionState, useEffect } from 'react';
import { addReview } from '@/app/actions/reviews';
import styles from './place.module.css';

export default function ReviewForm({ placeId, isLoggedIn }: { placeId: string, isLoggedIn: boolean }) {
  const [state, formAction, isPending] = useActionState(addReview, null);

  useEffect(() => {
    if (state?.success) {
      alert('Review submitted successfully!');
    }
  }, [state]);

  if (!isLoggedIn) {
    return (
      <div className={styles.loginPrompt}>
        <p>Please log in to leave a review.</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewFormContainer}>
      <h3 className={styles.reviewTitle}>Write a Review</h3>
      {state?.error && <div className={styles.errorMessage}>{state.error}</div>}
      
      <form action={formAction} className={styles.reviewForm}>
        <input type="hidden" name="placeId" value={placeId} />
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Rating</label>
          <select name="rating" className={styles.input} required defaultValue="5">
            <option value="5">⭐⭐⭐⭐⭐ (5) Excellent</option>
            <option value="4">⭐⭐⭐⭐ (4) Very Good</option>
            <option value="3">⭐⭐⭐ (3) Average</option>
            <option value="2">⭐⭐ (2) Poor</option>
            <option value="1">⭐ (1) Terrible</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Your Review</label>
          <textarea 
            name="comment" 
            className={styles.input} 
            rows={4} 
            placeholder="Share your experience at this destination..." 
            required 
          />
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary`} 
          disabled={isPending}
          style={{ width: '100%' }}
        >
          {isPending ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
