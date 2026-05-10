"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 4001; // Use a different port to avoid conflicts
app.get('/', (req, res) => {
    res.send('Test Server is Alive!');
});
app.listen(PORT, () => {
    console.log(`🚀 Test Server running on http://localhost:${PORT}`);
});
