'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addReview(state: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: 'You must be logged in to leave a review.' };
  }

  const placeId = formData.get('placeId') as string;
  const ratingStr = formData.get('rating') as string;
  const comment = formData.get('comment') as string;

  if (!placeId || !ratingStr || !comment) {
    return { error: 'Please fill out all fields.' };
  }

  const rating = parseInt(ratingStr, 10);
  if (rating < 1 || rating > 5) {
    return { error: 'Rating must be between 1 and 5.' };
  }

  try {
    await prisma.review.create({
      data: {
        userId: session.userId,
        placeId,
        rating,
        comment,
      },
    });

    revalidatePath(`/places/${placeId}`);
    return { success: true };
  } catch (error) {
    return { error: 'An error occurred while submitting your review.' };
  }
}
