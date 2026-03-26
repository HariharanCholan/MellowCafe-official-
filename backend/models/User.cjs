const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: { type: String, default: '' },
  role: { type: String, default: 'user' }
});

module.exports = mongoose.model('User', UserSchema);
