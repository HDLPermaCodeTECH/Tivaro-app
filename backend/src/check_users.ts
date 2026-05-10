import prisma from './config/prisma';

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:", users);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
