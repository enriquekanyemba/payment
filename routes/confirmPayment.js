import express from 'express';
import stripe from '../config/stripe.js';
import models from '../models/index.js';
import sendEmail from '../utils/sendEmail.js';  // import your email utility

const router = express.Router();

router.get('/payment-confirm', async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    // Retrieve Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const bookingId = session.metadata.bookingId;

    // Check if payment already saved
    const existingPayment = await models.Payment.findOne({
      where: { stripePaymentId: session.payment_intent }
    });

    if (!existingPayment) {
      // Save payment record
      await models.Payment.create({
        bookingId,
        stripePaymentId: session.payment_intent,
        amount: session.amount_total / 100,
        currency: session.currency,
        status: session.payment_status,
      });
    }

    // Update booking status
    await models.Booking.update(
      { status: 'paid' },
      { where: { bookingId } }
    );

    // Get booking with associated Package and Customer
    const booking = await models.Booking.findOne({
      where: { bookingId },
      include: [
        { model: models.Package, attributes: ['packageName', 'price'] },
        { model: models.Customer, attributes: ['name', 'email'] }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Prepare and send confirmation email
    const customerEmail = booking.Customer.email;
    const customerName = booking.Customer.name;
    const packageName = booking.Package.packageName;
    const totalPrice = booking.totalPrice;

    const emailSubject = 'Booking Confirmation - Cape Route Tours';
    const emailHtml = `
      <h1>Thank you for your booking, ${customerName}!</h1>
      <p>You have successfully booked the <strong>${packageName}</strong> package.</p>
      <p><strong>Total Paid:</strong> R${Number(totalPrice).toFixed(2)}</p>
      <p>We look forward to hosting you!</p>
    `;

    await sendEmail(customerEmail, emailSubject, emailHtml);

    res.json({ booking, message: 'Payment confirmed and email sent' });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

export default router;
