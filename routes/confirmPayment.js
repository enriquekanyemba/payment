import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import models from '../models/index.js';
import sendEmail from '../utils/sendEmail.js';
import generateInvoice from '../utils/generateInvoice.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

const { Booking, Customer, Package, Payment } = models;

router.get('/payment-confirm', async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'Session ID required' });

  try {
    // 1️⃣ Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // 2️⃣ Get or create customer
    const email = session.customer_details?.email;
    const name = session.customer_details?.name || 'Guest';
    if (!email) return res.status(400).json({ error: 'Customer email missing' });

    let customer = await Customer.findOne({ where: { email } });
    if (!customer) customer = await Customer.create({ name, email });

    // 3️⃣ Determine package
    const packageId = parseInt(session.metadata?.packageId) || 1;
    const tourPackage = await Package.findByPk(packageId);
    if (!tourPackage) return res.status(404).json({ error: 'Package not found' });

    // 4️⃣ Create booking
    const bookingDate = session.metadata?.date || new Date().toISOString().split('T')[0];
    const numberOfPeople = parseInt(session.metadata?.quantity) || 1;
    const totalPrice = session.amount_total / 100;

    const booking = await Booking.create({
      customerId: customer.customerId,
      packageId,
      numberOfPeople,
      totalPrice,
      status: 'paid',
      date: bookingDate
    });

    // 5️⃣ Record payment
    const existingPayment = await Payment.findOne({ where: { stripePaymentId: session.payment_intent } });
    if (!existingPayment) {
      await Payment.create({
        bookingId: booking.bookingId,
        stripePaymentId: session.payment_intent,
        amount: totalPrice,
        currency: session.currency,
        status: session.payment_status
      });
    }

    // 6️⃣ Generate invoice PDF
    const invoicePath = generateInvoice({
      id: booking.bookingId,
      customerName: customer.name,
      customerEmail: customer.email,
      packageName: tourPackage.packageName,
      amount: totalPrice
    });

    // 7️⃣ Send email with invoice
    const emailHtml = `
      <h1>Thank you for your booking, ${customer.name}!</h1>
      <p>You booked: <strong>${tourPackage.packageName}</strong></p>
      <p>Total Paid: R${totalPrice.toFixed(2)}</p>
      <p>Date & Time: ${bookingDate} at 11:00 AM</p>
      <p>Meeting Point: Cape of Good Hope (Central Pick-Up Point)</p>
      <hr/>
      <p>Please bring your Passport or Driving Licence.</p>
      <p>Official emails only: <strong>@caperoutetours.co.za</strong></p>
    `;

    await sendEmail(customer.email, 'Booking Confirmed - Cape Route Tours', emailHtml, 'Cape Route Tours', [
      { filename: `invoice-${booking.bookingId}.pdf`, path: invoicePath }
    ]);

    // 8️⃣ Return booking with associated customer & package
    const fullBooking = await Booking.findByPk(booking.bookingId, {
      include: [
        { model: Customer, attributes: ['name', 'email', 'cell'] },
        { model: Package, attributes: ['packageName'] }
      ]
    });

    res.json({ booking: fullBooking, message: 'Payment confirmed and invoice sent via email' });

  } catch (err) {
    console.error('❌ Confirm payment error:', err);
    res.status(500).json({ error: err.message || 'Failed to confirm payment' });
  }
});

export default router;
