'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(placeId: string) {
  const session = await getSession();
  if (!session) {
    return { error: 'You must be logged in to favorite a place.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { favorites: true },
    });

    if (!user) {
      return { error: 'User not found.' };
    }

    const isFavorited = user.favorites.some((place) => place.id === placeId);

    if (isFavorited) {
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          favorites: {
            disconnect: { id: placeId },
          },
        },
      });
    } else {
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          favorites: {
            connect: { id: placeId },
          },
        },
      });
    }

    revalidatePath(`/places/${placeId}`);
    revalidatePath('/favorites');
    return { success: true, isFavorited: !isFavorited };
  } catch (error) {
    return { error: 'An error occurred while updating favorites.' };
  }
}
