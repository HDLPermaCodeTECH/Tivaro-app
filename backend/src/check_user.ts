import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@tivaro.com';
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    console.log(`User found:`, user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
