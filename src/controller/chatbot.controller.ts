import { Request, Response } from 'express';
import OpenAI from 'openai';
import { portfolioData } from '../model/portfolio_data';
import { promptInstruction } from '../model/prompt_instruction';

export const askModel = async (req: Request, res: Response) => {
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
  const client = new OpenAI({
    apiKey: HF_TOKEN,
    baseURL: 'https://router.huggingface.co/v1',
  });

  try {
    const { message } = req.body as { message?: string };
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: `${promptInstruction}\n\nHere is information about the portfolio owner:\n\n${portfolioData}` },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() ?? '(no reply)';
    return res.json({ reply });
  } catch (err: any) {
    console.error('HF Inference Providers error:', err?.response?.data || err?.message || err);
    return res.status(500).json({ error: 'Failed to reach the model' });
  }
};
