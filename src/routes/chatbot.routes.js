"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatbot_controller_1 = require("../controller/chatbot.controller");
const router = (0, express_1.Router)();
router.post('/ask', chatbot_controller_1.askModel);
exports.default = router;
