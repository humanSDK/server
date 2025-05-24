// lib/mail.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const confirmUrl = `${process.env.BASE_URL}/verify?token=${token}`

  await transporter.sendMail({
    from: '"My App" <no-reply@myapp.com>',
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmUrl}">here</a> to confirm your email.</p>`,
  });
}
