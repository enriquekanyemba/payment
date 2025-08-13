import express from 'express';
import stripe from '../config/stripe.js';
import nodemailer from 'nodemailer';
import models from '../models/index.js'; // Sequelize models

const router = express.Router();

// Setup nodemailer transporter (example using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/confirm-payment', async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items.data.price.product'],
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Extract details
    const customerEmail = session.customer_details?.email;
    const lineItem = session.line_items.data[0];
    const packageName = lineItem.description || lineItem.price.product.name;
    const quantity = lineItem.quantity;
    const amountTotal = session.amount_total / 100;

    // Find or create customer
    let customer = await models.Customer.findOne({ where: { email: customerEmail } });
    if (!customer) {
      customer = await models.Customer.create({ name: 'Unknown', email: customerEmail }); 
      // You can change 'Unknown' to something better if you have more info
    }

    // Save booking to DB with status 'paid'
    const booking = await models.Booking.create({
      customerId: customer.customerId,
      packageId: 1, // Adjust this: you may want to fetch packageId by packageName or pass it via metadata
      numberOfPeople: quantity,
      totalPrice: amountTotal,
      status: 'paid',
    });

    // Save payment record
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
        <p><strong>Package:</strong> ${packageName}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total Paid:</strong> R${amountTotal.toFixed(2)}</p>
        <p><strong>Status:</strong> paid</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <br>
        <p>Payment successful! Thank you for your booking.</p>
      `,
    });

    res.json({ message: 'Payment confirmed, booking saved, and email sent', booking });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

export default router;
