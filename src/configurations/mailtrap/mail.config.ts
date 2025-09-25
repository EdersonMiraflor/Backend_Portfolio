
import nodemailer from 'nodemailer';

const createTransport = () => {
  return nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    secure: false, // Use 'true' if your host offers TLS/SSL, 'false' for STARTTLS or no encryption.
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export default createTransport;
