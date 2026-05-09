import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma';
import { z } from 'zod';

const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_person: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const getSuppliers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user?.userId;
    const suppliers = await prisma.supplier.findMany({
      where: { user_id },
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    });
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user?.userId;
    const data = supplierSchema.parse(req.body);

    const supplier = await prisma.supplier.create({
      data: {
        ...data,
        user_id
      }
    });

    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user?.userId;
    const id = req.params.id as string;
    const data = supplierSchema.parse(req.body);

    const supplier = await prisma.supplier.update({
      where: { id, user_id },
      data
    });

    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = (req as any).user?.userId;
    const id = req.params.id as string;

    await prisma.supplier.delete({
      where: { id, user_id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
