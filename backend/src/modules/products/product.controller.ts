import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../config/prisma';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string(),
  sku: z.string().optional(),
  quantity: z.coerce.number().int().default(0),
  unit: z.string().default('pcs'),
  cost_price: z.coerce.number().default(0),
  selling_price: z.coerce.number().default(0),
  low_stock_threshold: z.coerce.number().int().default(5),
  image_url: z.string().optional(),
});

export const getProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      where: { user_id: req.user!.targetUserId },
      include: { supplier: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role === 'STAFF') return res.status(403).json({ error: 'Staff cannot manage products.' });
    const data = productSchema.parse(req.body);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.image_url;
    const product = await prisma.product.create({
      data: {
        ...data,
        image_url: imageUrl,
        user_id: req.user!.targetUserId,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role === 'STAFF') return res.status(403).json({ error: 'Staff cannot manage products.' });
    const { id } = req.params;
    const data = productSchema.partial().parse(req.body);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.image_url;
    const product = await prisma.product.update({
      where: { id: id as string, user_id: req.user!.targetUserId },
      data: {
        ...data,
        image_url: imageUrl,
      },
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role === 'STAFF') return res.status(403).json({ error: 'Staff cannot manage products.' });
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: id as string, user_id: req.user!.targetUserId },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
