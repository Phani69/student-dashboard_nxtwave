import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  if (String(process.env.DISABLE_EMAIL).toLowerCase() === 'true') {
    console.log('[EMAIL:DISABLED]', { to, subject });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `MERN Guardian Wings <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}


