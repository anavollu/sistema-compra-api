
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  cpf: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ['cashier', 'manager', 'customer'],
  },
  isVIP: { type: Boolean, default: false },
  identity: { type: String, required: true },
  address: { type: String, required: true },
  points: { type: Number, default: 0 },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive'],
  },
});

module.exports = mongoose.model('user', userSchema);
