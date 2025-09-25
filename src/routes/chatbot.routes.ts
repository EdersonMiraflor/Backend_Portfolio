import { Router } from 'express';
import { askModel } from '../controller/chatbot.controller';

const router = Router();
router.post('/ask', askModel);

export default router;
