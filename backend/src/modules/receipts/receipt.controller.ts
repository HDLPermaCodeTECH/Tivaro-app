// Receipt Controller - Handles Sales Receipt Retrieval
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../config/prisma';

export const getReceipt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user_id = req.user!.targetUserId;

    const sale = await prisma.sale.findFirst({
      where: { id: id as string, user_id },
      include: {
        user: {
          select: {
            business_name: true,
            business_address: true,
            business_phone: true,
            business_logo: true,
            receipt_footer: true
          }
        },
        receipt: true,
        debt: {
            include: {
                payments: {
                    orderBy: { date: 'desc' }
                }
            }
        },
        customer: {
            select: { name: true }
        },
        cashier: {
          select: { name: true, email: true, role: true }
        },
        items: {
          include: {
            product: {
              select: { name: true }
            }
          }
        }
      },
    });

    if (!sale) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    res.json(sale);
  } catch (error) {
    next(error);
  }
};
