import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'User',
      lastName: 'Example',
      role: 'CUSTOMER',
    },
  });

  const shop_owner = await prisma.user.upsert({
    where: { email: 'shop_owner@example.com' },
    update: {},
    create: {
      email: 'shop_owner@example.com',
      password: hashedPassword,
      firstName: 'Shop',
      lastName: 'Owner',
      role: 'SHOP_OWNER',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  console.log('create user', { user, shop_owner, admin });

  const category = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Books', slug: 'books' },
    { name: 'Clothing', slug: 'clothing' },
  ];
  for (const cat of category) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
  }

  console.log('created categories');
}

main()
  .catch((e) => {
    console.error('seeding failed');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
