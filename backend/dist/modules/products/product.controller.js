"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const zod_1 = require("zod");
const productSchema = zod_1.z.object({
    name: zod_1.z.string(),
    sku: zod_1.z.string().optional(),
    quantity: zod_1.z.coerce.number().int().default(0),
    unit: zod_1.z.string().default('pcs'),
    cost_price: zod_1.z.coerce.number().default(0),
    selling_price: zod_1.z.coerce.number().default(0),
    low_stock_threshold: zod_1.z.coerce.number().int().default(5),
    image_url: zod_1.z.string().optional(),
});
const getProducts = async (req, res, next) => {
    try {
        const products = await prisma_1.default.product.findMany({
            where: { user_id: req.user.targetUserId },
            include: { supplier: true },
            orderBy: { created_at: 'desc' },
        });
        res.json(products);
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res, next) => {
    try {
        if (req.user.role === 'STAFF')
            return res.status(403).json({ error: 'Staff cannot manage products.' });
        const data = productSchema.parse(req.body);
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.image_url;
        const product = await prisma_1.default.product.create({
            data: {
                ...data,
                image_url: imageUrl,
                user_id: req.user.targetUserId,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        if (req.user.role === 'STAFF')
            return res.status(403).json({ error: 'Staff cannot manage products.' });
        const { id } = req.params;
        const data = productSchema.partial().parse(req.body);
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.image_url;
        const product = await prisma_1.default.product.update({
            where: { id: id, user_id: req.user.targetUserId },
            data: {
                ...data,
                image_url: imageUrl,
            },
        });
        res.json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        if (req.user.role === 'STAFF')
            return res.status(403).json({ error: 'Staff cannot manage products.' });
        const { id } = req.params;
        await prisma_1.default.product.delete({
            where: { id: id, user_id: req.user.targetUserId },
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
