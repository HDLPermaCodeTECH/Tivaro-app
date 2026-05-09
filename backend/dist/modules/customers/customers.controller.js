"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerById = exports.createCustomer = exports.getCustomers = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const getCustomers = async (req, res) => {
    try {
        const user_id = req.user?.targetUserId;
        if (!user_id)
            return res.status(401).json({ error: 'Unauthorized' });
        const customers = await prisma_1.default.customer.findMany({
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
            const sales = await prisma_1.default.sale.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};
exports.getCustomers = getCustomers;
const createCustomer = async (req, res) => {
    try {
        const user_id = req.user?.targetUserId;
        if (!user_id)
            return res.status(401).json({ error: 'Unauthorized' });
        const { name, email, phone, address } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const customer = await prisma_1.default.customer.create({
            data: {
                name,
                email,
                phone,
                address,
                user_id
            }
        });
        res.status(201).json(customer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create customer' });
    }
};
exports.createCustomer = createCustomer;
const getCustomerById = async (req, res) => {
    try {
        const user_id = req.user?.targetUserId;
        const { id } = req.params;
        if (!user_id)
            return res.status(401).json({ error: 'Unauthorized' });
        const customer = await prisma_1.default.customer.findFirst({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
};
exports.getCustomerById = getCustomerById;
