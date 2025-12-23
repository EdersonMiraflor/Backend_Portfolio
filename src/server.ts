// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import chatbotRoutes from "./routes/chatbot.routes";
import emailRoutes from "./routes/email.routes";

interface Config {
  port: number;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5000, // fallback kung walang PORT si Render
  nodeEnv: process.env.NODE_ENV || "production",
};

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Server Response: Server is running! Everything works successfully.");
  console.log("Log: Server is running Successfully!");
});

// API routes
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/email", emailRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode.`);
});

// simple logger  
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.originalUrl} UA="${req.get('user-agent')}"`);
  next();
});


export default config;
