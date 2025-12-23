import { Request, Response } from 'express';
import axios from 'axios';

export const sendEmail = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Get Formspree endpoint from environment variables (loaded at runtime)
  const FORMSPREE_ENDPOINT = process.env.FORMSPREE;

  if (!FORMSPREE_ENDPOINT) {
    console.error('Missing environment variable: FORMSPREE');
    return res.status(500).json({ error: 'Server configuration error: FORMSPREE endpoint is not configured.' });
  }

  try {
    // Forward the request to Formspree
    const response = await axios.post(FORMSPREE_ENDPOINT, {
      name,
      email,
      subject: `Portfolio Contact: ${subject} from ${name} (${email})`,
      message: `
        Hello Ederson, You've received a new message from your portfolio contact form:

        Name: ${name}
        Email: ${email}
        Subject: ${subject}

        Message: ${message}

        ---
        This is an automated message from Ederson's Portfolio.
        This Email is sent by: ${email}
      `.trim(),
      _replyto: email, // Formspree uses _replyto for reply-to functionality
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Formspree returns 200 on success
    if (response.status === 200 || response.status === 201) {
      res.status(200).json({ message: 'Email sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send email.' });
    }
  } catch (error) {
    console.error('Error sending email to Formspree:', error);
    
    // Handle axios errors with more detail
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data;
      const errorMessage = errorData?.error || errorData?.message || error.message || 'Failed to send email.';
      
      console.error('Formspree API Error Details:', {
        status,
        statusText: error.response?.statusText,
        data: errorData,
        url: error.config?.url,
      });
      
      res.status(status).json({ error: errorMessage });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Failed to send email.' });
    }
  }
};

