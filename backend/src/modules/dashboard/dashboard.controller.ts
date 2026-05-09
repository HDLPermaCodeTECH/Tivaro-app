import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../config/prisma';

export const getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user!.targetUserId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [user, totalProducts, allProducts, paidSalesToday, recentSales, saleItems, debts, recentPayments, debtPaymentsToday] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user_id },
        select: { daily_goal: true }
      }),
      prisma.product.count({ where: { user_id } }),
      prisma.product.findMany({ where: { user_id } }),
      // FULLY PAID SALES TODAY
      prisma.sale.findMany({
        where: {
          user_id,
          payment_status: 'PAID',
          created_at: { gte: today }
        },
        select: { total_amount: true }
      }),
      // RECENT SALES FOR FEED
      prisma.sale.findMany({
        where: { user_id },
        orderBy: { created_at: 'desc' },
        take: 50,
        include: { 
          receipt: true,
          cashier: { select: { name: true, email: true } },
          customer: { select: { name: true } },
          debt: { select: { customer_name: true, status: true, remaining_amount: true } }
        }
      }),
      prisma.saleItem.findMany({
        where: {
          sale: { user_id }
        },
        include: {
          product: { select: { name: true } }
        }
      }),
      // OUTSTANDING DEBTS SUMMARY
      prisma.debt.findMany({
        where: { user_id, status: { not: 'PAID' } },
        select: { remaining_amount: true }
      }),
      // RECENT PAYMENTS FOR FEED
      prisma.debtPayment.findMany({
        where: { debt: { user_id } },
        orderBy: { created_at: 'desc' },
        take: 50,
        include: {
          cashier: { select: { name: true, email: true } }, // ADDED THIS
          debt: {
            include: {
              customer: { select: { name: true } }
            }
          }
        }
      }),
      // ALL CASH PAYMENTS/COLLECTIONS TODAY
      prisma.debtPayment.findMany({
        where: {
          debt: { user_id },
          created_at: { gte: today }
        },
        select: { amount: true }
      })
    ]);

    // Combined Activity Feed
    const activityFeed = [
      ...recentSales.map(s => ({
        id: s.id,
        type: 'SALE',
        amount: s.total_amount,
        status: s.payment_status,
        date: s.created_at,
        cashier: s.cashier?.name || s.cashier?.email.split('@')[0] || 'Admin',
        customer: s.customer?.name || s.debt?.customer_name || 'Walk-in',
        reference_id: s.id.substring(0, 8).toUpperCase(),
        // Add info for partial status
        remaining_amount: s.debt?.remaining_amount
      })),
      ...recentPayments.map(p => ({
        id: p.id,
        type: 'PAYMENT',
        amount: p.amount,
        status: 'PAID',
        date: p.created_at,
        cashier: p.cashier?.name || p.cashier?.email.split('@')[0] || 'Admin', // UPDATED THIS
        customer: p.debt.customer?.name || p.debt.customer_name || 'Unknown',
        reference_id: p.debt_id.substring(0, 8).toUpperCase()
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Top Products
    const productSales: Record<string, { name: string, quantity: number, revenue: number }> = {};
    saleItems.forEach((item: any) => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = { name: item.product.name, quantity: 0, revenue: 0 };
      }
      productSales[item.product_id].quantity += item.quantity;
      productSales[item.product_id].revenue += (item.quantity * item.price);
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const lowStockItems = (allProducts as any[]).filter((p: any) => p.quantity <= p.low_stock_threshold).length;
    
    // CONSISTENT CASH LOGIC
    const totalPaidSalesToday = (paidSalesToday as any[]).reduce((acc: number, sale: any) => acc + Number(sale.total_amount), 0);
    const totalCollectionsToday = (debtPaymentsToday as any[]).reduce((acc: number, payment: any) => acc + Number(payment.amount), 0);
    
    const totalRevenueToday = totalPaidSalesToday + totalCollectionsToday;
    const totalOutstandingDebts = debts.reduce((acc: number, debt: any) => acc + debt.remaining_amount, 0);

    res.json({
      totalProducts,
      lowStockItems,
      totalSalesToday: totalRevenueToday,
      activityFeed,
      topProducts,
      totalDebts: totalOutstandingDebts,
      dailyGoal: user?.daily_goal || 0
    });
  } catch (error) {
    next(error);
  }
};
