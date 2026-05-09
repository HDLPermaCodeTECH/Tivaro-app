import { PrismaClient } from './src/generated/client';
const prisma = new PrismaClient();

async function repair() {
  console.log('--- REPAIRING SHIFT REPORTS ---');
  
  const reports = await prisma.shiftReport.findMany({
    where: {
        unpaid_sales_json: null
    }
  });

  console.log(`Found ${reports.length} reports to repair.`);

  for (const report of reports) {
    const startTime = report.start_time;
    const endTime = report.end_time;
    const cashier_id = report.cashier_id;

    if (!startTime || !endTime) {
        console.log(`Skipping report ${report.id} due to missing start or end time.`);
        continue;
    }

    const sales = await prisma.sale.findMany({
      where: {
        cashier_id,
        created_at: { gte: startTime, lte: endTime }
      },
      include: {
        debt: { select: { remaining_amount: true, customer_name: true } },
        customer: { select: { name: true } }
      }
    });

    const payments = await prisma.debtPayment.findMany({
        where: {
            cashier_id,
            created_at: { gte: startTime, lte: endTime }
        },
        include: {
            debt: { select: { customer_name: true } }
        }
    });

    const unpaidSales = sales.filter(s => s.payment_status !== 'PAID').map((s: any) => ({
        customer: s.customer?.name || s.debt?.customer_name || 'Walk-in',
        total: s.total_amount,
        remaining: s.debt?.remaining_amount || 0,
        status: s.payment_status
    }));

    const collections = payments.map((p: any) => ({
        customer: p.debt?.customer_name || 'Walk-in',
        amount: p.amount,
        time: p.created_at
    }));

    await prisma.shiftReport.update({
      where: { id: report.id },
      data: {
        unpaid_sales_json: JSON.stringify(unpaidSales),
        collections_json: JSON.stringify(collections),
        total_collections: payments.reduce((sum, p) => sum + p.amount, 0)
      }
    });

    console.log(`Repaired Report ID: ${report.id.substring(0,8)} - Added ${unpaidSales.length} debts.`);
  }

  console.log('--- REPAIR COMPLETE ---');
}

repair().catch(console.error).finally(() => prisma.$disconnect());
