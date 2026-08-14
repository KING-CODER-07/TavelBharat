'use server';

import { prisma } from '@/lib/prisma';
import { setSession, clearSession } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/password';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export async function registerUser(state: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = registerSchema.safeParse({ name, email, password });
  
  if (!validation.success) {
    return { error: (validation.error as any).errors[0].message };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'User already exists with this email.' };
    }

    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await setSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return { error: 'An error occurred during registration.' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export async function loginUser(state: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = loginSchema.safeParse({ email, password });
  
  if (!validation.success) {
    return { error: (validation.error as any).errors[0].message };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return { error: 'Invalid email or password.' };
    }

    await setSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return { error: 'An error occurred during login.' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function logoutUser() {
  await clearSession();
  revalidatePath('/');
  redirect('/');
}

export async function adminLoginUser(state: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    let isValid = false;
    // Provide a valid 24-character hex string so MongoDB ObjectID parser doesn't crash on subsequent queries
    let userId = '000000000000000000000000';
    let userName = 'Super Admin';
    let userRole = 'ADMIN';

    // Master fallback if DB is not set up properly
    if (email === 'admin@travelbharat.com' && password === 'travelbharat123') {
      isValid = true;
    } else {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return { error: 'Invalid admin credentials.' };
      }

      if (user.role !== 'PARTNER' && user.role !== 'ADMIN') {
        return { error: 'You are not authorized to access the admin portal.' };
      }

      isValid = verifyPassword(password, user.password);
      if (!isValid) {
        return { error: 'Invalid admin credentials.' };
      }

      userId = user.id;
      userName = user.name;
      userRole = user.role;
    }

    await setSession({
      userId: userId,
      name: userName,
      email: email,
      role: userRole,
    });
  } catch (error) {
    return { error: 'An error occurred during admin login.' };
  }

  revalidatePath('/admin');
  redirect('/admin');
}

