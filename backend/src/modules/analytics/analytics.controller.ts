import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { endOfDay, startOfDay } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.targetUserId;
    
    // LOG TO FILE FOR DEBUGGING
    const logPath = path.join(__dirname, '../../../crm_debug.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] CRM Access - user_id: ${user_id}\n`);

    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const now = new Date();
    // 1. Revenue Trends (All days of the current month)
    const [sales, debtPayments] = await Promise.all([
      prisma.sale.findMany({
        where: { user_id },
        include: { debt: { select: { remaining_amount: true } } }
      }),
      prisma.debtPayment.findMany({
        where: { debt: { user_id } },
        select: { created_at: true, amount: true }
      })
    ]);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const trendsMap: Record<string, number> = {};
    
    // Initialize all days of the month with 0
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      trendsMap[dateStr] = 0;
    }

    // Fill with actual sales data (Cash received at time of sale)
    sales.forEach(sale => {
      const dateStr = sale.created_at.toISOString().split('T')[0];
      const remainingDebt = sale.debt?.remaining_amount || 0;
      const cashRevenue = Number(sale.total_amount) - Number(remainingDebt);
      
      if (trendsMap[dateStr] !== undefined) {
        trendsMap[dateStr] += cashRevenue;
      }
    });

    // Add Debt Payments (Cash received later)
    debtPayments.forEach(payment => {
      const dateStr = payment.created_at.toISOString().split('T')[0];
      if (trendsMap[dateStr] !== undefined) {
        trendsMap[dateStr] += Number(payment.amount);
      }
    });

    const revenueTrends = Object.keys(trendsMap).map(date => ({
      date,
      revenue: trendsMap[date]
    })).sort((a, b) => a.date.localeCompare(b.date));

    // 2. Top Products (Exact same logic as Dashboard)
    const saleItems = await prisma.saleItem.findMany({
      where: { sale: { user_id } },
      include: { product: { select: { name: true } } }
    });

    const productSales: Record<string, { name: string, quantity: number, revenue: number }> = {};
    saleItems.forEach((item: any) => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = { name: item.product.name, quantity: 0, revenue: 0 };
      }
      productSales[item.product_id].quantity += item.quantity;
      productSales[item.product_id].revenue += (item.quantity * item.price); // Using actual sale price
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 3. Top Customers
    const customers = await prisma.customer.findMany({
      where: { user_id },
      include: { sales: { select: { total_amount: true } } }
    });

    const topCustomers = customers.map(customer => {
      const total_spent = customer.sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        total_spent // Fixed key: must be 'total_spent'
      };
    }).sort((a, b) => b.total_spent - a.total_spent).slice(0, 5);

    res.json({ revenueTrends, topProducts, topCustomers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export const getPLReport = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.targetUserId;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const { start_date, end_date } = req.query;
    const now = new Date();
    
    // Default to current month
    const start = start_date ? startOfDay(new Date(start_date as string)) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = end_date ? endOfDay(new Date(end_date as string)) : endOfDay(now);

    // 1. CASH REVENUE (PAID SALES + DEBT COLLECTIONS)
    const [paidSales, debtPayments, allSalesForCOGS, expenses] = await Promise.all([
        prisma.sale.findMany({ 
          where: { user_id, payment_status: 'PAID', created_at: { gte: start, lte: end } },
          select: { total_amount: true }
        }),
        prisma.debtPayment.findMany({ 
          where: { debt: { user_id }, created_at: { gte: start, lte: end } },
          select: { amount: true }
        }),
        prisma.sale.findMany({ 
          where: { user_id, created_at: { gte: start, lte: end } }, 
          include: { items: { include: { product: true } } } 
        }),
        prisma.expense.findMany({ 
          where: { user_id, date: { gte: start, lte: end } } 
        })
    ]);

    const totalCashFromSales = paidSales.reduce((sum, s) => sum + Number(s.total_amount), 0);
    const totalCashFromCollections = debtPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalRevenue = totalCashFromSales + totalCashFromCollections;

    let totalCOGS = 0;
    allSalesForCOGS.forEach(sale => {
      sale.items.forEach((item: any) => {
        const cost = item.product?.cost_price || 0;
        totalCOGS += (item.quantity * cost);
      });
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;

    // Restore Expense Breakdown for Pie Chart
    const expenseBreakdown: Record<string, number> = {};
    expenses.forEach(e => {
      expenseBreakdown[e.category] = (expenseBreakdown[e.category] || 0) + Number(e.amount);
    });

    res.json({
      totalRevenue,
      totalCOGS,
      totalExpenses,
      grossProfit,
      netProfit,
      grossMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
      netMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      expenseBreakdown: Object.keys(expenseBreakdown).map(category => ({
        category,
        amount: expenseBreakdown[category]
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate P&L' });
  }
};
