import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import chatbotRoutes from './routes/chatbot.routes';
import emailRoutes from './routes/email.routes';


dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV || 'deployment',
};

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send("Server Response: Server is running! Everything works successfully");
  console.log("Log: Server is running Successfully!");
});

// API routes
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/email', emailRoutes);


// Debug SendGrid API key
// console.log('SENDGRID_API_KEY from env:', process.env.SENDGRID_API_KEY);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode.`);
});

export default config;
