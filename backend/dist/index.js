"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const product_routes_1 = __importDefault(require("./modules/products/product.routes"));
const sales_routes_1 = __importDefault(require("./modules/sales/sales.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const receipt_routes_1 = __importDefault(require("./modules/receipts/receipt.routes"));
const expenses_routes_1 = __importDefault(require("./modules/expenses/expenses.routes"));
const customers_routes_1 = __importDefault(require("./modules/customers/customers.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
const reports_routes_1 = __importDefault(require("./modules/reports/reports.routes"));
const suppliers_routes_1 = __importDefault(require("./modules/suppliers/suppliers.routes"));
const debts_routes_1 = __importDefault(require("./modules/debts/debts.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('public/uploads'));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/sales', sales_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/receipts', receipt_routes_1.default);
app.use('/api/expenses', expenses_routes_1.default);
app.use('/api/customers', customers_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/reports', reports_routes_1.default);
app.use('/api/suppliers', suppliers_routes_1.default);
app.use('/api/debts', debts_routes_1.default);
// Error Handler
app.use(error_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
