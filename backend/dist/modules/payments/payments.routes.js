"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payments_controller_1 = require("./payments.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Protect this route, only logged in users can create a session
router.post('/create-session', auth_middleware_1.authenticate, payments_controller_1.createCheckoutSession);
router.post('/create-subscription', auth_middleware_1.authenticate, payments_controller_1.createSubscription);
exports.default = router;
