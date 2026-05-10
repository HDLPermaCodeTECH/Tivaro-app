"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./config/prisma"));
async function main() {
    console.log('Searching for user Hebrey...');
    const users = await prisma_1.default.user.findMany({
        where: { name: { contains: 'Hebrey' } }
    });
    console.log('Users found:', users.map(u => ({ id: u.id, name: u.name, role: u.role })));
    if (users.length > 0) {
        const user_id = users[0].id;
        const sales = await prisma_1.default.sale.findMany({
            where: { user_id }
        });
        console.log(`Sales count for ${users[0].name}:`, sales.length);
        const saleItems = await prisma_1.default.saleItem.findMany({
            where: { sale: { user_id } },
            include: { product: true }
        });
        console.log(`Sale items count for ${users[0].name}:`, saleItems.length);
        if (saleItems.length > 0) {
            console.log('Sample Product Name:', saleItems[0].product?.name);
        }
    }
    else {
        console.log('No user found with name Hebrey');
        // Fallback: Check ALL sales to see who they belong to
        const allSales = await prisma_1.default.sale.findMany({ take: 5 });
        console.log('Sample sales in DB:', allSales.map(s => ({ id: s.id, user_id: s.user_id })));
    }
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
