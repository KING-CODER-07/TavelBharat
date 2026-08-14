import { prisma } from './lib/prisma';
import { hashPassword } from './lib/password';

async function seedAdmin() {
  const adminEmail = 'admin@travelbharat.com';
  const adminExists = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!adminExists) {
    const hashedPassword = hashPassword('admin1234');
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('Admin user created: admin@travelbharat.com / admin1234');
  } else {
    console.log('Admin user already exists.');
  }
}

seedAdmin()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
