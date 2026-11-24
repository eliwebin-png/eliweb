import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@eliweb.in';
  const password = process.env.ADMIN_PASSWORD || 'eliweb@admin2024';

  if (!password) {
    console.error('ADMIN_PASSWORD env var is required.');
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });

  if (existing) {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.adminUser.update({
      where: { email },
      data: { password: hashed },
    });
    console.log(`Admin user "${email}" password updated.`);
  } else {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.adminUser.create({
      data: { email, password: hashed },
    });
    console.log(`Admin user "${email}" created.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

