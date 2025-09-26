"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chatbot_routes_1 = __importDefault(require("./routes/chatbot.routes"));
const email_routes_1 = __importDefault(require("./routes/email.routes"));
dotenv_1.default.config();
const config = {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV || 'deployment',
};
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.get('/', (req, res) => {
    res.send("Server Response: Server is running! Everything works successfully");
    console.log("Log: Server is running Successfully!");
});
// API routes
app.use('/api/chatbot', chatbot_routes_1.default);
app.use('/api/email', email_routes_1.default);
// Debug SendGrid API key
// console.log('SENDGRID_API_KEY from env:', process.env.SENDGRID_API_KEY);
// Start server
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode.`);
});
exports.default = config;
