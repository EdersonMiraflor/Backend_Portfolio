"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askModel = void 0;
const openai_1 = __importDefault(require("openai"));
const portfolio_data_1 = require("../model/portfolio_data");
const prompt_instruction_1 = require("../model/prompt_instruction");
const askModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY || '';
    const HF_MODEL = process.env.HF_MODEL || ''; // Now explicitly requires .env or will be empty
    // const HF_PROVIDER = process.env.HF_PROVIDER || 'hf'; // Removed as it's not needed for the model string
    // Model string for the OpenAI client (just the model ID)
    const MODEL = HF_MODEL;
    // Ensure token is available
    if (!HF_TOKEN) {
        console.error('❌ Hugging Face API key is not set.');
        return res.status(500).json({ error: 'Hugging Face API key is not configured on the server.' });
    }
    // OpenAI client pointed at HF router
    // (Changing model scenario) #2. Change the baseURL according to what model you have
    const client = new openai_1.default({
        apiKey: HF_TOKEN,
        baseURL: 'https://router.huggingface.co/v1',
    });
    try {
        const { message } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const completion = yield client.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: `${prompt_instruction_1.promptInstruction}\n\nHere is information about the portfolio owner:\n\n${portfolio_data_1.portfolioData}` },
                { role: 'user', content: message },
            ],
            temperature: 0.7,
        });
        const reply = (_e = (_d = (_c = (_b = (_a = completion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : '(no reply)';
        return res.json({ reply });
    }
    catch (err) {
        console.error('HF Inference Providers error:', ((_f = err === null || err === void 0 ? void 0 : err.response) === null || _f === void 0 ? void 0 : _f.data) || (err === null || err === void 0 ? void 0 : err.message) || err);
        return res.status(500).json({ error: 'Failed to reach the model' });
    }
});
exports.askModel = askModel;
