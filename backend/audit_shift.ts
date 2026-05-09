import { PrismaClient } from './src/generated/client';
const prisma = new PrismaClient();

async function audit() {
  console.log('--- AUDIT START ---');
  
  // Find Lovely (Assuming Lovely is the name)
  const lovely = await prisma.user.findFirst({
    where: { name: { contains: 'Lovely' } }
  });

  if (!lovely) {
    console.log('Lovely not found');
    return;
  }

  console.log(`Cashier: ${lovely.name} (ID: ${lovely.id})`);

  // Find Sales today for Lovely
  const today = new Date();
  today.setHours(0,0,0,0);

  const sales = await prisma.sale.findMany({
    where: {
      cashier_id: lovely.id,
      created_at: { gte: today }
    },
    include: {
      debt: true,
      customer: true
    }
  });

  console.log(`Total Sales Found Today: ${sales.length}`);
  
  sales.forEach(s => {
    console.log(`- Sale ID: ${s.id.substring(0,8)}, Status: ${s.payment_status}, Total: ${s.total_amount}, Time: ${s.created_at.toISOString()}`);
    if (s.debt) {
        console.log(`  [DEBT FOUND] Customer: ${s.customer?.name || s.debt.customer_name}, Remaining: ${s.debt.remaining_amount}`);
    } else {
        console.log(`  [NO DEBT RECORD]`);
    }
  });

  console.log('--- AUDIT END ---');
}

audit().catch(console.error).finally(() => prisma.$disconnect());
