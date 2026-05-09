// Auth Controller - Handles User and Staff Authentication
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '../../middleware/auth.middleware';

const registerSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  name: z.string().optional(),
});

const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().optional(),
  business_name: z.string().optional(),
  business_address: z.string().optional(),
  business_phone: z.string().optional(),
  business_logo: z.string().optional(),
  receipt_footer: z.string().optional(),
  daily_goal: z.number().optional(),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        last_login_at: new Date()
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role, ownerId: user.owner_id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role, owner_id: user.owner_id },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is suspended
    if ((user as any).is_suspended) {
      return res.status(403).json({ error: 'Ang iyong account ay suspended. Mangyaring makipag-ugnayan sa support.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login for shift tracking
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { last_login_at: new Date() }
    });

    const token = jwt.sign(
      { userId: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role, ownerId: updatedUser.owner_id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, plan: updatedUser.plan, role: updatedUser.role, owner_id: updatedUser.owner_id },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await (prisma.user as any).findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, plan: true, role: true,
        owner_id: true, is_suspended: true,
        business_name: true, business_address: true, business_phone: true,
        business_logo: true, receipt_footer: true, daily_goal: true
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const getShiftSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const shiftStart = user.last_login_at || new Date(new Date().setHours(0,0,0,0));

        const [sales, payments] = await Promise.all([
            prisma.sale.findMany({
                where: {
                    cashier_id: userId,
                    created_at: { gte: shiftStart }
                },
                include: {
                    debt: { select: { remaining_amount: true, status: true, customer_name: true } },
                    customer: { select: { name: true } }
                }
            }),
            prisma.debtPayment.findMany({
                where: {
                    debt: { user_id: req.user!.targetUserId },
                    created_at: { gte: shiftStart }
                    // Note: Ideally we track which staff recorded the payment too.
                    // For now, we fetch all payments created since shift start.
                },
                include: {
                    debt: { select: { customer_name: true } }
                }
            })
        ]);

        const totalSalesVolume = sales.reduce((acc, s) => acc + s.total_amount, 0);
        const cashSales = sales.filter(s => s.payment_status === 'PAID').reduce((acc, s) => acc + s.total_amount, 0);
        const totalCollections = payments.reduce((acc, p) => acc + p.amount, 0);
        
        // Total cash that should be in the drawer for this user
        const totalCashOnHand = cashSales + totalCollections;

        const unpaidSales = sales.filter(s => s.payment_status !== 'PAID').map(s => ({
            customer: s.customer?.name || s.debt?.customer_name || 'Walk-in',
            total: s.total_amount,
            remaining: s.debt?.remaining_amount || 0
        }));

        res.json({
            shiftStart,
            totalSalesVolume,
            cashSales,
            totalCollections,
            totalCashOnHand,
            unpaidSales,
            recentPayments: payments.map(p => ({
                customer: p.debt.customer_name,
                amount: p.amount,
                date: p.created_at
            }))
        });
    } catch (error) {
        next(error);
    }
};

export const upgrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user?.userId;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.update({
      where: { id: user_id },
      data: { plan: 'PRO' }
    });

    res.json({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role, owner_id: user.owner_id }
    });
  } catch (error) {
    next(error);
  }
};

export const createStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = (req as any).user;
    if (admin.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can create staff accounts.' });
    }

    const adminUser = await prisma.user.findUnique({ where: { id: admin.userId }, include: { _count: { select: { staff: true } } } });
    if (!adminUser) return res.status(404).json({ error: 'Admin not found' });

    // Enforce limits
    if (adminUser.plan === 'FREE' && adminUser._count.staff >= 1) {
      return res.status(403).json({ error: 'FREE plan limited to 1 staff account. Please upgrade to PRO.' });
    }
    if (adminUser.plan === 'PRO' && adminUser._count.staff >= 2) {
      return res.status(403).json({ error: 'PRO plan limited to 2 staff accounts. Please upgrade to Ultimate.' });
    }

    const { email, password, name } = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const staff = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'STAFF',
        owner_id: admin.userId
      }
    });

    res.status(201).json({
      staff: { id: staff.id, email: staff.email, name: staff.name, role: staff.role }
    });
  } catch (error) {
    next(error);
  }
};

export const getStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = (req as any).user;
    if (admin.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const staff = await prisma.user.findMany({
      where: { owner_id: admin.userId, role: 'STAFF' },
      select: { id: true, email: true, name: true, created_at: true, last_login_at: true },
      orderBy: { created_at: 'desc' }
    });
    
    res.json(staff);
  } catch (error) {
    next(error);
  }
};

export const deleteStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = (req as any).user;
    if (admin.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const id = req.params.id as string;

    // Verify the staff belongs to this admin
    const staff = await prisma.user.findFirst({
      where: { id, owner_id: admin.userId, role: 'STAFF' }
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff account not found or unauthorized' });
    }

    // Delete the staff account
    await prisma.user.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = (req as any).user;
    if (admin.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const id = req.params.id as string;
    const { email, password, name } = updateProfileSchema.parse(req.body);

    // Verify the staff belongs to this admin
    const staff = await prisma.user.findFirst({
      where: { id, owner_id: admin.userId, role: 'STAFF' }
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff account not found or unauthorized' });
    }

    const updateData: any = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedStaff = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true }
    });

    res.json(updatedStaff);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const user_id = user?.userId;
    const target_id = user?.targetUserId; // The owner's ID
    
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const { 
      email, password, name, 
      business_name, business_address, business_phone, 
      business_logo, receipt_footer, daily_goal
    } = updateProfileSchema.parse(req.body);

    // 1. Handle Personal Info Updates (Updates current user's record)
    const personalData: any = {};
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: user_id } }
      });
      if (existing) return res.status(400).json({ error: 'Email already in use.' });
      personalData.email = email;
    }
    if (name) personalData.name = name;
    if (password) personalData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user_id },
      data: personalData,
      select: { 
        id: true, email: true, name: true, role: true, plan: true, owner_id: true,
        business_name: true, business_address: true, business_phone: true, 
        business_logo: true, receipt_footer: true, daily_goal: true
      }
    });

    // 2. Handle Business Info Updates (ONLY ADMIN can change, updates owner's record)
    if (user.role === 'ADMIN') {
        const businessData: any = {};
        if (business_name) businessData.business_name = business_name;
        if (business_address) businessData.business_address = business_address;
        if (business_phone) businessData.business_phone = business_phone;
        if (business_logo) businessData.business_logo = business_logo;
        if (receipt_footer) businessData.receipt_footer = receipt_footer;
        if (daily_goal !== undefined) businessData.daily_goal = daily_goal;

        if (Object.keys(businessData).length > 0) {
            const updatedOwner = await prisma.user.update({
                where: { id: target_id },
                data: businessData,
                select: { 
                    business_name: true, business_address: true, business_phone: true, 
                    business_logo: true, receipt_footer: true, daily_goal: true
                }
            });
            // Merge business data into response
            Object.assign(updatedUser, updatedOwner);
        }
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Multer config for logo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const mime = allowed.test(file.mimetype);
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (mime && ext) return cb(null, true);
    cb(new Error('Only images (jpg, png, webp) are allowed'));
  }
});

export const uploadLogo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (user.role !== 'ADMIN') return res.status(403).json({ error: 'Only admins can upload business logos.' });

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    const logo_url = `http://localhost:4000/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: user.targetUserId },
      data: { business_logo: logo_url },
      select: { id: true, business_logo: true }
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
