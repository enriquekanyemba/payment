import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/bookingRoutes.js';
import checkoutSessionRoutes from './routes/checkoutSession.js';
import paymentRoutes from './routes/paymentRoutes.js';
import confirmPaymentRoutes from './routes/confirmPayment.js';
import models from './models/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register all routes under /api
app.use('/api', bookingRoutes);
app.use('/api', checkoutSessionRoutes);
app.use('/api', paymentRoutes);
app.use('/api', confirmPaymentRoutes);

models.sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ Failed to sync database:', err));
