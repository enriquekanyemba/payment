import express from 'express';
import stripe from '../config/stripe.js';
import nodemailer from 'nodemailer';
import models from '../models/index.js'; // Sequelize models

const router = express.Router();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

router.post('/confirm-payment', async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) return res.status(400).json({ error: 'Session ID required' });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items.data.price.product'],
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const customerEmail = session.customer_details?.email;
    const bookingDate = session.metadata.bookingDate || new Date().toISOString().split('T')[0];
    const lineItem = session.line_items.data[0];
    const packageName = lineItem.description || lineItem.price.product.name;
    const quantity = lineItem.quantity;
    const amountTotal = session.amount_total / 100;

    // Find the package by name
    const tourPackage = await models.Package.findOne({ where: { packageName } });
    if (!tourPackage) return res.status(404).json({ error: 'Package not found' });

    // Find or create customer
    let customer = await models.Customer.findOne({ where: { email: customerEmail } });
    if (!customer) {
      customer = await models.Customer.create({ name: 'Unknown', email: customerEmail });
    }

    // Save booking
    const booking = await models.Booking.create({
      customerId: customer.customerId,
      packageId: tourPackage.packageId,
      numberOfPeople: quantity,
      totalPrice: amountTotal,
      status: 'paid',
      date: bookingDate, // Include booking date in DB
    });

    // Save payment
    await models.Payment.create({
      bookingId: booking.bookingId,
      stripePaymentId: session.payment_intent,
      amount: amountTotal,
      currency: session.currency,
      status: session.payment_status,
    });

    // Send confirmation email
    await transporter.sendMail({
      from: `"Cape Culture Tours" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: 'Booking Confirmation',
      html: `
        <h2>Booking Confirmation</h2>
        <p>Thank you for your booking!</p>
        <p><strong>Package:</strong> ${packageName}</p>
        <p><strong>Number of People:</strong> ${quantity}</p>
        <p><strong>Date:</strong> ${bookingDate} at 11:00 AM</p>
        <p><strong>Total Paid:</strong> R${amountTotal.toFixed(2)}</p>
        <p>We look forward to giving you the best cultural tour experience!</p>
      `,
    });

    res.json({ message: 'Payment confirmed, booking saved, and email sent', booking });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

export default router;
