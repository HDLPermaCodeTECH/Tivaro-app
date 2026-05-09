"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSuppliers = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const zod_1 = require("zod");
const supplierSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    contact_person: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
const getSuppliers = async (req, res, next) => {
    try {
        const user_id = req.user?.userId;
        const suppliers = await prisma_1.default.supplier.findMany({
            where: { user_id },
            include: { _count: { select: { products: true } } },
            orderBy: { name: 'asc' }
        });
        res.json(suppliers);
    }
    catch (error) {
        next(error);
    }
};
exports.getSuppliers = getSuppliers;
const createSupplier = async (req, res, next) => {
    try {
        const user_id = req.user?.userId;
        const data = supplierSchema.parse(req.body);
        const supplier = await prisma_1.default.supplier.create({
            data: {
                ...data,
                user_id
            }
        });
        res.status(201).json(supplier);
    }
    catch (error) {
        next(error);
    }
};
exports.createSupplier = createSupplier;
const updateSupplier = async (req, res, next) => {
    try {
        const user_id = req.user?.userId;
        const { id } = req.params;
        const data = supplierSchema.parse(req.body);
        const supplier = await prisma_1.default.supplier.update({
            where: { id, user_id },
            data
        });
        res.json(supplier);
    }
    catch (error) {
        next(error);
    }
};
exports.updateSupplier = updateSupplier;
const deleteSupplier = async (req, res, next) => {
    try {
        const user_id = req.user?.userId;
        const { id } = req.params;
        await prisma_1.default.supplier.delete({
            where: { id, user_id }
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSupplier = deleteSupplier;
