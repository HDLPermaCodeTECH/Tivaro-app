import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';
import salesRoutes from './modules/sales/sales.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import receiptRoutes from './modules/receipts/receipt.routes';
import expenseRoutes from './modules/expenses/expenses.routes';
import customerRoutes from './modules/customers/customers.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import reportsRoutes from './modules/reports/reports.routes';
import supplierRoutes from './modules/suppliers/suppliers.routes';
import debtRoutes from './modules/debts/debts.routes';
import paymentRoutes from './modules/payments/payments.routes';
import { errorHandler } from './middleware/error.middleware';
import prisma from './config/prisma';
import { authenticateDev } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('public/uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/payments', paymentRoutes);

// Dev Routes
app.use('/api/dev', authenticateDev);
app.get('/api/dev/users', async (req, res) => {
  try {
    const users = await (prisma.user as any).findMany({
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        created_at: true,
        last_login_at: true,
        owner_id: true,
        is_suspended: true
      }
    });

    // Calculate real stats
    const totalUsers = await prisma.user.count({
      where: { role: 'ADMIN' }
    });
    const salesAggregate = await prisma.sale.aggregate({
      _sum: {
        total_amount: true
      }
    });

    // Active sessions (users active in the last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const activeSessions = await prisma.user.count({
      where: {
        last_login_at: {
          gte: fifteenMinutesAgo
        }
      }
    });

    res.json({ 
      success: true, 
      data: users,
      stats: {
        totalUsers,
        totalRevenue: salesAggregate._sum.total_amount || 0,
        activeSessions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// GET Revenue Chart Data (last 6 months)
app.get('/api/dev/revenue-chart', async (req, res) => {
  try {
    const months: { month: string; revenue: number; users: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const label = start.toLocaleString('en-PH', { month: 'short', year: '2-digit' });

      const revenueAgg = await prisma.sale.aggregate({
        _sum: { total_amount: true },
        where: { created_at: { gte: start, lte: end } }
      });

      const newUsers = await prisma.user.count({
        where: { created_at: { gte: start, lte: end }, role: 'ADMIN' }
      });

      months.push({
        month: label,
        revenue: Math.round((revenueAgg._sum.total_amount || 0) * 100) / 100,
        users: newUsers
      });
    }
    res.json({ success: true, data: months });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch chart data' });
  }
});

// GET Plan Distribution
app.get('/api/dev/plan-distribution', async (req, res) => {
  try {
    const [free, pro, enterprise] = await Promise.all([
      prisma.user.count({ where: { plan: 'FREE', role: 'ADMIN' } }),
      prisma.user.count({ where: { plan: 'PRO', role: 'ADMIN' } }),
      prisma.user.count({ where: { plan: 'ENTERPRISE', role: 'ADMIN' } }),
    ]);
    res.json({ success: true, data: [
      { name: 'FREE', value: free, color: '#64748b' },
      { name: 'PRO', value: pro, color: '#10b981' },
      { name: 'ENTERPRISE', value: enterprise, color: '#6366f1' },
    ]});
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET At-Risk Users (no login in 30+ days)
app.get('/api/dev/at-risk-users', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const atRisk = await (prisma.user as any).findMany({
      where: {
        role: 'ADMIN',
        OR: [
          { last_login_at: { lt: thirtyDaysAgo } },
          { last_login_at: null }
        ]
      },
      select: { id: true, email: true, name: true, plan: true, last_login_at: true },
      orderBy: { last_login_at: 'asc' },
      take: 10
    });
    res.json({ success: true, data: atRisk });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET Activity Feed (recent sign-ups + tickets)
app.get('/api/dev/activity-feed', async (req, res) => {
  try {
    const [recentUsers, recentTickets] = await Promise.all([
      (prisma.user as any).findMany({
        where: { role: 'ADMIN' },
        select: { id: true, name: true, email: true, plan: true, created_at: true },
        orderBy: { created_at: 'desc' },
        take: 5
      }),
      (prisma as any).message.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { created_at: 'desc' },
        take: 5
      })
    ]);

    const feed = [
      ...recentUsers.map((u: any) => ({ type: 'SIGNUP', label: `${u.name || u.email} signed up`, plan: u.plan, time: u.created_at })),
      ...recentTickets.map((m: any) => ({ type: 'TICKET', label: `${m.user?.name || m.user?.email || 'Unknown'} submitted a ticket`, status: m.status, time: m.created_at }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

    res.json({ success: true, data: feed });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// POST Broadcast Announcement
app.post('/api/dev/broadcast', async (req, res) => {
  const { title, content, type } = req.body;
  if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content required' });
  try {
    const announcement = await (prisma as any).announcement.create({
      data: { title, content, type: type || 'INFO' }
    });
    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET Latest Announcement (for users)
app.get('/api/announcements/latest', async (req, res) => {
  try {
    const announcement = await (prisma as any).announcement.findFirst({
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET Ticket Analytics
app.get('/api/dev/ticket-analytics', async (req, res) => {
  try {
    const statusCounts = await (prisma as any).message.groupBy({
      by: ['status'],
      _count: { _all: true }
    });
    
    const formattedData = statusCounts.map((item: any) => ({
      name: item.status,
      value: item._count._all,
      color: item.status === 'PENDING' ? '#ef4444' : 
             item.status === 'READ' ? '#fbbf24' : 
             item.status === 'RESOLVED' ? '#10b981' : '#64748b'
    }));
    
    res.json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET Top Users by Revenue
app.get('/api/dev/top-users', async (req, res) => {
  try {
    const topSales = await prisma.sale.groupBy({
      by: ['user_id'],
      _sum: { total_amount: true },
      orderBy: { _sum: { total_amount: 'desc' } },
      take: 5
    });

    const userIds = topSales.map(s => s.user_id);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, plan: true }
    });

    const data = topSales.map(s => {
      const user = users.find(u => u.id === s.user_id);
      return {
        id: s.user_id,
        name: user?.name || user?.email || 'Unknown',
        revenue: Math.round((s._sum.total_amount || 0) * 100) / 100,
        plan: user?.plan || 'FREE'
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET Platform Counters
app.get('/api/dev/platform-counters', async (req, res) => {
  try {
    const [totalProducts, totalCustomers, totalSales, totalExpenses] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.sale.count(),
      prisma.expense.count()
    ]);
    res.json({ success: true, data: { totalProducts, totalCustomers, totalSales, totalExpenses } });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GET Impersonate User
app.get('/api/dev/impersonate/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role, ownerId: user.owner_id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role, owner_id: user.owner_id } });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// POST Send Message to User
app.post('/api/dev/send-message', async (req, res) => {
  const { user_id, content } = req.body;
  if (!user_id || !content) return res.status(400).json({ success: false, message: 'User ID and content required' });
  try {
    const message = await (prisma as any).message.create({
      data: {
        user_id,
        content,
        status: 'PENDING'
      }
    });
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// POST Send Email
app.post('/api/dev/send-email', async (req, res) => {
  const { to, subject, content } = req.body;
  if (!to || !subject || !content) return res.status(400).json({ success: false, message: 'To, subject, and content required' });
  
  try {
    const hasResend = process.env.RESEND_API_KEY;
    const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    
    if (hasResend) {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      const response = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to,
        subject,
        html: `<p>${content}</p>`,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return res.json({ success: true, message: 'Email sent successfully via Resend' });
    } else if (hasSmtp) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Tivaro Dev" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text: content,
        html: `<p>${content}</p>`,
      });

      return res.json({ success: true, message: 'Email sent successfully via SMTP' });
    } else {
      console.log(`[SIMULATED EMAIL] To: ${to}, Subject: ${subject}`);
      return res.json({ success: true, message: 'Email simulated (No SMTP credentials configured)' });
    }
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Email Webhook (Receive)
app.post('/api/dev/email-webhook', async (req, res) => {
  const { sender, subject, body } = req.body;
  if (!sender || !body) return res.status(400).json({ success: false, message: 'Sender and body required' });
  
  try {
    console.log(`[RECEIVED EMAIL] From: ${sender}, Subject: ${subject}`);
    
    const user = await (prisma as any).user.findFirst({ where: { email: sender } });
    
    const message = await (prisma as any).message.create({
      data: {
        user_id: user ? user.id : 'external_sender',
        content: `[Email Subject: ${subject || 'No Subject'}] ${body}`,
        status: 'RECEIVED'
      }
    });
    
    res.json({ success: true, message });
  } catch (error: any) {
    console.error('Error receiving email webhook:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete User Route
app.delete('/api/dev/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Kunin muna lahat ng staff IDs ng admin na ito
    const staffs = await prisma.user.findMany({
      where: { owner_id: id },
      select: { id: true }
    });
    const staffIds = staffs.map(s => s.id);

    // Cascading Delete: Burahin lahat ng records na nakakabit sa user at sa kanyang staff
    await prisma.$transaction([
      // Burahin ang records ng staff muna
      prisma.debtPayment.deleteMany({ where: { cashier_id: { in: staffIds } } }),
      prisma.shiftReport.deleteMany({ where: { cashier_id: { in: staffIds } } }),
      
      // Burahin ang records ng Admin
      prisma.debtPayment.deleteMany({ where: { cashier_id: id } }),
      prisma.debtPayment.deleteMany({ where: { debt: { user_id: id } } }),
      prisma.debt.deleteMany({ where: { user_id: id } }),
      prisma.receipt.deleteMany({ where: { user_id: id } }),
      prisma.saleItem.deleteMany({ where: { sale: { user_id: id } } }),
      prisma.sale.deleteMany({ where: { user_id: id } }),
      prisma.product.deleteMany({ where: { user_id: id } }),
      prisma.expense.deleteMany({ where: { user_id: id } }),
      prisma.customer.deleteMany({ where: { user_id: id } }),
      prisma.supplier.deleteMany({ where: { user_id: id } }),
      prisma.shiftReport.deleteMany({ where: { OR: [{ admin_id: id }, { cashier_id: id }] } }),
      
      // Burahin ang mga Staff users
      prisma.user.deleteMany({ where: { id: { in: staffIds } } }),
      
      // Sa huli, burahin ang Admin
      prisma.user.delete({ where: { id } })
    ]);

    res.json({ success: true, message: 'User, staff, and all related records deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete user. Baka may error sa database constraints.' });
  }
});

// PUT Update User Plan
app.put('/api/dev/users/:id/plan', async (req, res) => {
  const { id } = req.params;
  const { plan } = req.body;
  try {
    console.log(`[DEV] Updating plan for user ${id} to ${plan}`);
    const updatedUser = await (prisma as any).user.update({
      where: { id },
      data: { plan }
    });
    console.log(`[DEV] Plan updated successfully for user ${id}`);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update plan' });
  }
});

// PUT Toggle User Suspension
app.put('/api/dev/users/:id/suspend', async (req, res) => {
  const { id } = req.params;
  const { is_suspended } = req.body;
  try {
    const updatedUser = await (prisma as any).user.update({
      where: { id },
      data: { is_suspended }
    });
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update suspension status' });
  }
});

// GET Messages for Dev Dashboard
app.get('/api/dev/messages', async (req, res) => {
  try {
    const messages = await (prisma as any).message.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// GET Single Message by ID
app.get('/api/dev/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const message = await (prisma as any).message.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } }
    });
    if (!message) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch ticket' });
  }
});

// DELETE Message
app.delete('/api/dev/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await (prisma as any).message.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete ticket' });
  }
});

// POST Message from Admin (Mock/Test)
app.post('/api/dev/messages', async (req, res) => {
  const { user_id, content, attachment } = req.body;
  try {
    const message = await (prisma as any).message.create({
      data: { user_id, content, attachment }
    });
    res.json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// POST Reply to Message
app.post('/api/dev/messages/:id/reply', async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  try {
    const message = await (prisma as any).message.update({
      where: { id },
      data: { 
        reply, 
        replied_at: new Date(),
        status: 'REPLIED'
      }
    });
    res.json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send reply' });
  }
});

// POST Update Message Status
app.post('/api/dev/messages/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const message = await (prisma as any).message.update({
      where: { id },
      data: { status }
    });
    res.json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// GET Messages for Specific User
app.get('/api/dev/messages/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await (prisma as any).message.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// Error Handler
app.use(errorHandler);

async function startServer() {
  try {
    console.log('⏳ Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Keep event loop alive
    setInterval(() => {
        console.log('💓 Heartbeat: Server is alive...');
    }, 10000);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
