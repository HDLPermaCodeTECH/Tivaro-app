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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("./auth.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/upgrade', auth_middleware_1.authenticate, authController.upgrade);
router.put('/profile', auth_middleware_1.authenticate, authController.updateProfile);
router.post('/logo', auth_middleware_1.authenticate, authController.upload.single('logo'), authController.uploadLogo);
router.post('/staff', auth_middleware_1.authenticate, authController.createStaff);
router.get('/staff', auth_middleware_1.authenticate, authController.getStaff);
router.put('/staff/:id', auth_middleware_1.authenticate, authController.updateStaff);
router.delete('/staff/:id', auth_middleware_1.authenticate, authController.deleteStaff);
router.get('/shift-summary', auth_middleware_1.authenticate, authController.getShiftSummary);
exports.default = router;
