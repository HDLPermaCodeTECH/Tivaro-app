import { PrismaClient } from './src/generated/client';
const prisma = new PrismaClient();

async function auditAll() {
  console.log('--- GLOBAL REVENUE AUDIT (CASH-BASED) ---');
  
  const today = new Date();
  today.setHours(0,0,0,0);

  // 1. All Paid Sales
  const paidSales = await prisma.sale.findMany({
    where: { payment_status: 'PAID', created_at: { gte: today } }
  });

  // 2. All Debt Payments (Collections + Downpayments)
  const payments = await prisma.debtPayment.findMany({
    where: { created_at: { gte: today } }
  });

  // 3. All Unpaid/Partial Sales (Accrual check)
  const allSales = await prisma.sale.findMany({
    where: { created_at: { gte: today } }
  });

  const totalPaidSales = paidSales.reduce((sum, s) => sum + s.total_amount, 0);
  const totalCollections = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalAccrualSales = allSales.reduce((sum, s) => sum + s.total_amount, 0);

  console.log(`TOTAL ACCRUAL (Lahat ng Benta kahit utang): ₱${totalAccrualSales}`);
  console.log(`--- CASH-BASED BREAKDOWN ---`);
  console.log(`- Cash from FULL Sales: ₱${totalPaidSales}`);
  console.log(`- Cash from Collections/Downpayments: ₱${totalCollections}`);
  console.log(`TOTAL CASH REVENUE: ₱${totalPaidSales + totalCollections}`);

  console.log('--- INDIVIDUAL SALES ---');
  allSales.forEach(s => {
    console.log(`[${s.payment_status}] ID: ${s.id.substring(0,8)}, Total: ${s.total_amount}`);
  });

  console.log('--- AUDIT END ---');
}

auditAll().catch(console.error).finally(() => prisma.$disconnect());
