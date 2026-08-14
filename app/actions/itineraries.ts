'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createItinerary(state: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  const title = formData.get('title') as string;
  if (!title) return { error: 'Title is required' };

  try {
    const itinerary = await prisma.itinerary.create({
      data: {
        title,
        userId: session.userId,
        days: {
          create: [{ dayNumber: 1 }]
        }
      }
    });
    revalidatePath('/itineraries');
    return { success: true, itineraryId: itinerary.id };
  } catch (e) {
    return { error: 'Failed to create itinerary' };
  }
}

export async function addDay(itineraryId: string, currentDays: number) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  try {
    await prisma.itineraryDay.create({
      data: {
        dayNumber: currentDays + 1,
        itineraryId,
      }
    });
    revalidatePath(`/itineraries/${itineraryId}`);
    return { success: true };
  } catch (e) {
    return { error: 'Failed to add day' };
  }
}

export async function addPlaceToDay(dayId: string, placeId: string, time?: string) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  try {
    const day = await prisma.itineraryDay.findUnique({
      where: { id: dayId },
      include: { itinerary: true }
    });
    
    if (day?.itinerary.userId !== session.userId) return { error: 'Unauthorized' };

    await prisma.itineraryItem.create({
      data: {
        dayId,
        placeId,
        time: time || '10:00 AM'
      }
    });
    revalidatePath(`/itineraries/${day.itineraryId}`);
    return { success: true };
  } catch (e) {
    return { error: 'Failed to add place' };
  }
}

export async function removePlaceFromDay(itemId: string, itineraryId: string) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  try {
    await prisma.itineraryItem.delete({
      where: { id: itemId }
    });
    revalidatePath(`/itineraries/${itineraryId}`);
    return { success: true };
  } catch (e) {
    return { error: 'Failed to remove place' };
  }
}
