import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../config/prisma';
import { z } from 'zod';

const createDebtSchema = z.object({
  customer_id: z.string().optional(),
  customer_name: z.string().optional(),
  amount: z.number().positive(),
  due_date: z.string().optional(),
  notes: z.string().optional(),
  sale_id: z.string().optional(),
});

const paymentSchema = z.object({
  amount: z.number().positive(),
  payment_method: z.string().default('CASH'),
});

export const getDebts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user!.targetUserId;
    const debts = await prisma.debt.findMany({
      where: { user_id },
      include: {
        customer: { select: { name: true, phone: true } },
        payments: {
          include: {
            cashier: { select: { name: true } }
          },
          orderBy: { created_at: 'desc' }
        },
        sale: { include: { items: { include: { product: { select: { name: true } } } } } }
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(debts);
  } catch (error) {
    next(error);
  }
};

export const createDebt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = createDebtSchema.parse(req.body);
    const user_id = req.user!.targetUserId;

    const debt = await prisma.debt.create({
      data: {
        user_id,
        customer_id: data.customer_id,
        customer_name: data.customer_name,
        amount: data.amount,
        remaining_amount: data.amount,
        due_date: data.due_date ? new Date(data.due_date) : null,
        notes: data.notes,
        sale_id: data.sale_id,
        status: 'PENDING'
      },
    });

    res.status(201).json(debt);
  } catch (error) {
    next(error);
  }
};

export const addPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { amount, payment_method } = paymentSchema.parse(req.body);
    const user_id = req.user!.targetUserId;
    const cashier_id = req.user!.userId;

    const debt = await prisma.debt.findUnique({
      where: { id, user_id },
    });

    if (!debt) return res.status(404).json({ error: 'Debt not found' });

    const newRemaining = debt.remaining_amount - amount;
    const status = newRemaining <= 0 ? 'PAID' : 'PARTIAL';

    const result = await prisma.$transaction(async (tx: any) => {
      // Create payment record with cashier_id
      await tx.debtPayment.create({
        data: {
          debt_id: id,
          amount,
          payment_method,
          cashier_id
        },
      });

      // Update debt record
      const updatedDebt = await tx.debt.update({
        where: { id },
        data: {
          remaining_amount: Math.max(0, newRemaining),
          status,
        },
      });

      // SYNC WITH SALE: If fully paid and has sale_id, update sale status
      if (status === 'PAID' && debt.sale_id) {
        await tx.sale.update({
          where: { id: debt.sale_id },
          data: { payment_status: 'PAID' }
        });
      } else if (status === 'PARTIAL' && debt.sale_id) {
        await tx.sale.update({
          where: { id: debt.sale_id },
          data: { payment_status: 'PARTIAL' }
        });
      }

      return updatedDebt;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteDebt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    // RESTRICTION: Only ADMIN can delete debt records
    if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only admins can delete debt records. Please contact the owner.' });
    }

    const user_id = user.targetUserId;

    await prisma.debtPayment.deleteMany({ where: { debt_id: id } });
    await prisma.debt.delete({ where: { id, user_id } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
