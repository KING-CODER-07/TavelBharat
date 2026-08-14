import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { hashPassword } from '@/lib/password';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;

    const updateData: any = { name };

    if (password && password.trim().length > 0) {
      updateData.password = hashPassword(password);
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: updateData
    });

    return NextResponse.redirect(new URL('/dashboard', req.url));
  } catch (error) {
    console.error("Profile update failed:", error);
    return NextResponse.redirect(new URL('/profile?error=update_failed', req.url));
  }
}
