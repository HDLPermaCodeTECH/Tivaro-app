import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@tivaro.com';
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { plan: 'ENTERPRISE' },
    });
    console.log(`Updated user:`, user.email, `Plan:`, user.plan);
  } catch (error) {
    console.error('Failed to update user:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
