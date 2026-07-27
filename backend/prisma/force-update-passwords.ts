import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Force updating all user passwords in Neon PostgreSQL to plain text...');

  // Update admins
  await prisma.user.updateMany({
    where: {
      role: { in: [Role.SUPER_ADMIN, Role.PENGURUS, Role.PENGASUH] },
    },
    data: {
      passwordHash: 'AdminSmart123!',
    },
  });

  // Update santris
  await prisma.user.updateMany({
    where: {
      role: Role.SANTRI,
    },
    data: {
      passwordHash: 'SantriSmart123!',
    },
  });

  const allUsers = await prisma.user.findMany({
    select: { id: true, username: true, passwordHash: true, role: true },
  });

  console.log('✅ Current Users in Neon DB after forced update:');
  console.table(allUsers);
}

main()
  .catch((e) => {
    console.error('❌ Error updating passwords:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
