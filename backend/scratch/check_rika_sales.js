const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find Rika
  const rika = await prisma.user.findFirst({
    where: { email: 'cashier2@tivaro.com' }
  });

  if (!rika) {
    console.log('Rika not found');
    return;
  }

  const sales = await prisma.sale.findMany({
    where: {
      cashier_id: rika.id,
      created_at: { gte: today }
    }
  });

  console.log(`Rika (ID: ${rika.id}) has ${sales.length} sales today.`);
  sales.forEach(s => {
    console.log(`- ID: ${s.id}, Amount: ${s.total_amount}, Time: ${s.created_at}`);
  });

  const total = sales.reduce((sum, s) => sum + s.total_amount, 0);
  console.log(`Total: ${total}`);
}

check();
