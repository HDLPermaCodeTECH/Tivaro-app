import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../config/prisma';
import { z } from 'zod';

const saleItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

const createSaleSchema = z.object({
  items: z.array(saleItemSchema),
  total_amount: z.number().positive(),
  amount_paid: z.number().nonnegative().default(0), // New: Track initial cash given
  customer_id: z.string().optional(),
  customer_name: z.string().optional(),
  payment_status: z.enum(['PAID', 'UNPAID', 'PARTIAL']).default('PAID'),
  due_date: z.string().optional(),
});

export const createSale = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { items, total_amount, amount_paid, customer_id, customer_name, payment_status, due_date } = createSaleSchema.parse(req.body);
    const user_id = req.user!.targetUserId;
    const cashier_id = req.user!.userId;

    const result = await prisma.$transaction(async (tx: any) => {
      const saleItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.product_id, user_id },
        });

        if (!product || product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product?.name || 'Unknown'}`);
        }

        await tx.product.update({
          where: { id: item.product_id },
          data: { quantity: { decrement: item.quantity } },
        });

        saleItemsData.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          cost_price: product.cost_price || 0,
        });
      }

      const sale = await tx.sale.create({
        data: {
          user_id,
          cashier_id,
          customer_id,
          total_amount,
          payment_status,
          items: {
            create: saleItemsData,
          },
        },
      });

      // Handle Debt & Initial Payment
      if (payment_status === 'UNPAID' || payment_status === 'PARTIAL') {
        const debt = await tx.debt.create({
          data: {
            user_id,
            customer_id,
            customer_name: customer_name || (customer_id ? null : 'Walk-in Customer'),
            amount: total_amount,
            remaining_amount: total_amount - amount_paid,
            due_date: due_date ? new Date(due_date) : null,
            sale_id: sale.id,
            status: (total_amount - amount_paid) <= 0 ? 'PAID' : (amount_paid > 0 ? 'PARTIAL' : 'PENDING')
          }
        });

        // Record the initial payment if any
        if (amount_paid > 0) {
          await tx.debtPayment.create({
            data: {
              debt_id: debt.id,
              amount: amount_paid,
              payment_method: 'CASH',
              cashier_id: cashier_id // Added this for accountability
            }
          });
        }
        
        // Sync back to sale if the initial payment actually covered it (rare but possible)
        if ((total_amount - amount_paid) <= 0) {
            await tx.sale.update({
                where: { id: sale.id },
                data: { payment_status: 'PAID' }
            });
        }
      }

      await tx.receipt.create({
        data: {
          sale_id: sale.id,
          user_id,
        },
      });

      return sale;
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSales = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sales = await prisma.sale.findMany({
      where: { user_id: req.user!.targetUserId },
      include: {
        cashier: {
          select: { name: true, email: true, role: true }
        },
        receipt: true,
        customer: {
          select: { name: true }
        },
        debt: {
          select: { customer_name: true, status: true, remaining_amount: true }
        },
        items: {
          include: {
            product: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(sales);
  } catch (error) {
    next(error);
  }
};
