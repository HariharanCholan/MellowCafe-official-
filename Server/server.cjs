const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const path = require('path'); // ✅ ADD THIS
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});
const profileRoutes = require('./routes/profile_routes.cjs');
const authRoutes = require('./routes/authroutes.cjs');
const orderRoutes = require('./routes/order_routes.cjs');
const paymentRoutes = require('./routes/paymentRoutes.cjs'); // ✅ ADD THIS

dotenv.config();

require('./config/firebaseAdmin.cjs');

const User = require('./models/User.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));


// ✅ ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payment', paymentRoutes); // ✅ ADD THIS


// ✅ SERVE INVOICE FILES (VERY IMPORTANT)
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));


// Default admin
async function createDefaultAdmin() {
  const bcrypt = require('bcrypt');
  const admin = await User.findOne({ email: 'admin01@example.com' });

  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin01@example.com',
      phone: '',
      password: hashed,
      role: 'admin'
    });
    console.log("Default Admin Created");
  }
}

createDefaultAdmin();

app.listen(PORT, () => console.log(`Server running on ${PORT}`));