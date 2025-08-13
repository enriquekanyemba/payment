// utils/sendEmail.js
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

export default async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"Kappa Kulture" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  }

  const info = await transporter.sendMail(mailOptions)
  return info
}
