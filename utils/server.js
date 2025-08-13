import express from 'express';
import cors from 'cors';
import confirmPaymentRoutes from './routes/confirmPayment.js'; // or whatever file you put the above code in

import bookingRoutes from './routes/bookingRoutes.js';
import checkoutSessionRoutes from './routes/checkoutSession.js';
import paymentRoutes from './routes/paymentRoutes.js';  // Import payment routes

import models from './models/index.js';  // Sequelize models and instance

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api', bookingRoutes);
app.use('/api', checkoutSessionRoutes);
app.use('/api', paymentRoutes);  // Add payment routes
app.use('/api', confirmPaymentRoutes);

// Sync database and start server
models.sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to sync database:', err);
  });
