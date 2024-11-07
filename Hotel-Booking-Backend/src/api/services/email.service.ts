import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import path from 'path';

export const sendConfirmationEmail = async (email: string, userId: string) => {
  const port = process.env.SECRET_MAIL_KEY;
  const token = jwt.sign({ userId }, port!, { expiresIn: '1h' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'noreply.fifthpocket@gmail.com',
    to: email,
    subject: 'Email Confirmation',
    attachments: [
      {
        filename: 'LogoPW1.png',
        path: 'logo.png',
        cid: 'logo',
      },
    ],

    html: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Conferma la tua email</title>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background-color: #1f1f1f; /* Dark background */
        color: #d1d5db; /* Light text color */
        margin: 0;
        padding: 0;
      }

      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #2d2d2d; /* Darker container */
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        text-align: center;
      }

      h1 {
        font-size: 24px;
        color: #d6efe2; /* Primary color */
        margin-bottom: 20px;
      }

      p {
        font-size: 16px;
        line-height: 1.5;
        color: #5ec597; /* Text color */
        margin: 20px 0;
      }

      .btn-confirm {
        display: inline-block;
        padding: 10px 20px;
        font-size: 18px;
        color: #ffffff; /* White text */
        background-color: #5ec597; /* Button background color */
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        transition: background-color 0.3s ease;
      }

      .btn-confirm:hover {
        background-color: #4b5563; /* Darker on hover */
      }

      .footer {
        text-align: center;
        font-size: 14px;
        color: #9ca3af;
        margin-top: 20px;
      }

      .logo {
        margin-bottom: 20px;
      }

      .logo img {
        max-width: 150px;
        height: auto;
        border-radius: 20%;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="logo">
        <img src="cid:logo" alt="Logo" />
      </div>

      <h1>Conferma la tua email</h1>

      <p>Ciao,</p>

      <p>
        Grazie per esserti registrato al nostro servizio. Per completare la tua
        registrazione e attivare il tuo account, ti preghiamo di confermare il
        tuo indirizzo email cliccando sul pulsante qui sotto.
      </p>

      <a href="https://tropical-hotels.vercel.app/email-confirmed?token=${token}" class="btn-confirm">
        Completa Registrazione
      </a>

      <p>Se non hai richiesto questo account, puoi ignorare questa email.</p>

      <div class="footer">
        <p>Grazie,<br />Il Team di Tropical</p>
      </div>
    </div>
  </body>
</html>`,
  };

  await transporter.sendMail(mailOptions);
};
