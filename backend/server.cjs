const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const profileRoutes = require('./routes/profile_routes.cjs');



dotenv.config();

require('./config/firebaseAdmin.cjs');

const authRoutes = require('./routes/authroutes.cjs');
const orderRoutes = require('./routes/order_routes.cjs');

const User = require('./models/User.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/profile', profileRoutes);


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
