"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// Load .env file
dotenv.config({ path: path.join(__dirname, '../.env') });
const secretKey = process.env.PAYMONGO_SECRET_KEY;
if (!secretKey) {
    console.error('PAYMONGO_SECRET_KEY is not set');
    process.exit(1);
}
const authHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64');
async function createPlan() {
    try {
        const response = await axios_1.default.post('https://api.paymongo.com/v1/subscriptions/plans', {
            data: {
                attributes: {
                    name: 'Tivaro PRO Plan',
                    description: 'Monthly subscription for Tivaro PRO features',
                    amount: 49900, // ₱499.00 in cents
                    currency: 'PHP',
                    interval: 'monthly',
                    interval_count: 1
                }
            }
        }, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': authHeader
            }
        });
        console.log('Plan Created Successfully!');
        console.log('Plan ID:', response.data.data.id);
        console.log('Full Response:', JSON.stringify(response.data, null, 2));
    }
    catch (error) {
        console.error('Error creating plan:', error.response?.data || error.message);
    }
}
createPlan();
