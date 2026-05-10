"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./generated/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'admin@tivaro.com';
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        console.log(`User found:`, user);
    }
    catch (error) {
        console.error('Failed to fetch user:', error);
    }
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
