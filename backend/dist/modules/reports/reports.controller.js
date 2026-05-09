"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyShiftStats = exports.getShiftReports = exports.createShiftReport = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const createShiftReport = async (req, res, next) => {
    try {
        const cashier_id = req.user.userId;
        const admin_id = req.user.targetUserId;
        if (req.user.role !== 'STAFF') {
            return res.status(403).json({ error: 'Only staff can end shifts and send reports.' });
        }
        const user = await prisma_1.default.user.findUnique({ where: { id: cashier_id } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Find the end time of the last report to determine where to start
        const lastReport = await prisma_1.default.shiftReport.findFirst({
            where: { cashier_id, admin_id },
            orderBy: { end_time: 'desc' }
        });
        // We look back at least to the start of today, or the last report time
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startTime = lastReport ? lastReport.end_time : startOfToday;
        console.log(`[ShiftReport] Generating report for ${user.name}. StartTime: ${startTime.toISOString()}`);
        // Fetch All Activity for this shift
        const [sales, payments] = await Promise.all([
            prisma_1.default.sale.findMany({
                where: {
                    cashier_id,
                    user_id: admin_id,
                    created_at: { gte: startTime }
                },
                include: {
                    debt: { select: { remaining_amount: true, customer_name: true } },
                    customer: { select: { name: true } }
                }
            }),
            prisma_1.default.debtPayment.findMany({
                where: {
                    cashier_id,
                    debt: { user_id: admin_id },
                    created_at: { gte: startTime }
                },
                include: {
                    debt: { select: { customer_name: true } }
                }
            })
        ]);
        console.log(`[ShiftReport] Found ${sales.length} sales and ${payments.length} payments.`);
        const total_sales = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
        const total_collections = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const total_transactions = sales.length;
        // Prepare JSON data for detailed view
        // Note: We include ALL sales that are not PAID (UNPAID or PARTIAL)
        const unpaidSales = sales.filter(s => s.payment_status !== 'PAID').map(s => ({
            customer: s.customer?.name || s.debt?.customer_name || 'Walk-in',
            total: s.total_amount,
            remaining: s.debt?.remaining_amount || 0,
            status: s.payment_status
        }));
        const collections = payments.map(p => ({
            customer: p.debt?.customer_name || 'Walk-in',
            amount: p.amount,
            time: p.created_at
        }));
        const report = await prisma_1.default.shiftReport.create({
            data: {
                admin_id,
                cashier_id,
                total_sales,
                total_collections,
                total_transactions,
                unpaid_sales_json: JSON.stringify(unpaidSales),
                collections_json: JSON.stringify(collections),
                start_time: startTime,
                end_time: new Date(),
            }
        });
        res.status(201).json(report);
    }
    catch (error) {
        console.error('[ShiftReport Error]', error);
        next(error);
    }
};
exports.createShiftReport = createShiftReport;
const getShiftReports = async (req, res, next) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const reports = await prisma_1.default.shiftReport.findMany({
            where: { admin_id: req.user.userId },
            include: {
                cashier: { select: { name: true, email: true } }
            },
            orderBy: { created_at: 'desc' },
        });
        // Parse JSON data for frontend convenience
        const parsedReports = reports.map(r => ({
            ...r,
            unpaid_sales: r.unpaid_sales_json ? JSON.parse(r.unpaid_sales_json) : [],
            collections: r.collections_json ? JSON.parse(r.collections_json) : []
        }));
        res.json(parsedReports);
    }
    catch (error) {
        next(error);
    }
};
exports.getShiftReports = getShiftReports;
const getMyShiftStats = async (req, res, next) => {
    try {
        const cashier_id = req.user.userId;
        const admin_id = req.user.targetUserId;
        const lastReport = await prisma_1.default.shiftReport.findFirst({
            where: { cashier_id, admin_id },
            orderBy: { end_time: 'desc' }
        });
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startTime = lastReport ? lastReport.end_time : startOfToday;
        const [sales, payments] = await Promise.all([
            prisma_1.default.sale.findMany({
                where: { cashier_id, user_id: admin_id, created_at: { gte: startTime } }
            }),
            prisma_1.default.debtPayment.findMany({
                where: { cashier_id, created_at: { gte: startTime } }
            })
        ]);
        const total_sales = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
        const total_collections = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const total_transactions = sales.length;
        res.json({
            total_sales,
            total_collections,
            total_transactions,
            start_time: startTime,
            sales,
            payments
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyShiftStats = getMyShiftStats;
