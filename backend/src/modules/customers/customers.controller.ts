import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.targetUserId;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const customers = await prisma.customer.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { sales: true }
        }
      }
    });

    // Calculate total spent for each customer
    const customersWithSpent = await Promise.all(customers.map(async (customer) => {
      const sales = await prisma.sale.findMany({
        where: { customer_id: customer.id },
        select: { total_amount: true }
      });
      const total_spent = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
      return {
        ...customer,
        total_spent
      };
    }));

    res.json(customersWithSpent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.targetUserId;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        user_id
      }
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.targetUserId;
    const { id } = req.params;

    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const customer = await prisma.customer.findFirst({
      where: { id, user_id },
      include: {
        sales: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};
