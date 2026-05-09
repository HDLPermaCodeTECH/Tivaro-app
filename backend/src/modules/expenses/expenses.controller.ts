import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../config/prisma';
import { z } from 'zod';

const expenseSchema = z.object({
  description: z.string(),
  amount: z.number().positive(),
  category: z.string().default('General'),
  date: z.string().optional(),
});

export const getExpenses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { user_id: req.user!.targetUserId },
      orderBy: { created_at: 'desc' },
    });
    res.json(expenses as any[]);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role === 'STAFF') return res.status(403).json({ error: 'Staff cannot manage expenses.' });
    const data = expenseSchema.parse(req.body);
    const expense = await prisma.expense.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        user_id: req.user!.targetUserId,
      },
    });
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role === 'STAFF') return res.status(403).json({ error: 'Staff cannot manage expenses.' });
    const { id } = req.params;
    const data = expenseSchema.partial().parse(req.body);
    const expense = await prisma.expense.update({
      where: { id: id as string, user_id: req.user!.targetUserId },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
    res.json(expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role === 'STAFF') return res.status(403).json({ error: 'Staff cannot manage expenses.' });
    const { id } = req.params;
    await prisma.expense.delete({
      where: { id: id as string, user_id: req.user!.targetUserId },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
