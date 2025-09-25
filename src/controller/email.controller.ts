import { Request, Response } from 'express';
import sgMail, { ResponseError } from '@sendgrid/mail';

export const sendEmail = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Ensure environment variables are defined
  const toEmail = process.env.YOUR_EMAIL;
  const fromEmail = process.env.SENDER_EMAIL;
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!toEmail || !fromEmail || !apiKey) {
    console.error('Missing environment variables: YOUR_EMAIL, SENDER_EMAIL, or SENDGRID_API_KEY');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // Set API key dynamically
  sgMail.setApiKey(apiKey);

  try {
    const msg: sgMail.MailDataRequired = {
      to: toEmail,
      from: fromEmail,
      replyTo: { email },
      subject: `Portfolio Contact: ${subject} from ${name} (${email})`,
      html: `
        <p>Hello Ederson,</p>
        <p>You’ve received a new message from your portfolio contact form:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          This is an automated message from Ederson's Portfolio. 
          <a href="https://yourportfolio.com/unsubscribe" target="_blank">Unsubscribe</a> (optional for contact inquiries).
        </p>
        <p style="font-size: 10px; color: #999;">
          Sent by Ederson Miraflor | miraflorederson@gmail.com | Philippines
        </p>
      `,
    };

    await sgMail.send(msg);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    // Type assertion for SendGrid ResponseError
    const sendGridError = error as ResponseError;
    console.error('Error sending email:', sendGridError.response ? sendGridError.response.body : sendGridError);
    res.status(500).json({ error: 'Failed to send email.' });
  }
};