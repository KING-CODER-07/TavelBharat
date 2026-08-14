'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createBooking(state: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'You must be logged in to book.' };

  const placeId = formData.get('placeId') as string;
  const type = formData.get('type') as string;
  const details = formData.get('details') as string;

  if (!placeId || !type || !details) return { error: 'Missing fields' };

  try {
    await prisma.booking.create({
      data: {
        type,
        details,
        userId: session.userId,
        placeId,
      }
    });
    
    // We would revalidate the admin dashboard here if needed
    return { success: true };
  } catch (e) {
    return { error: 'Failed to submit booking' };
  }
}
