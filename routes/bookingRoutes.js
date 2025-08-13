import express from 'express';
import stripe from '../config/stripe.js';
import models from '../models/index.js';

const router = express.Router();

router.post('/bookings', async (req, res) => {
  try {
    const { full_name, email, phone, packageId, number_of_people, townId } = req.body;

    if (!full_name || !email || !packageId || !number_of_people) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const packageData = await models.Package.findByPk(packageId);
    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const totalPrice = packageData.price * number_of_people;

    let customer = await models.Customer.findOne({ where: { email } });
    if (!customer) {
      customer = await models.Customer.create({ name: full_name, email, cell: phone });
    }

    const booking = await models.Booking.create({
      customerId: customer.customerId,
      packageId,
      townId: townId || null,
      numberOfPeople: number_of_people,
      totalPrice,
      status: 'pending',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'zar',
            product_data: { name: packageData.packageName },
            unit_amount: Math.round(packageData.price * 100),
          },
          quantity: number_of_people,
        },
      ],
      metadata: { bookingId: booking.bookingId.toString() },
      success_url: `http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:8080/cancel`,
    });

    res.json({ checkoutUrl: session.url, bookingId: booking.bookingId });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
