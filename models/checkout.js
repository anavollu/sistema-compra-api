const mongoose = require('mongoose');

const { Schema } = mongoose;

const checkoutSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  checkoutItems: [new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    discount: { type: Number, required: true },
  })],
  expendedPoints: { type: Number, default: 0 },
  pixUrl: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  discount: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      'pending', 'paid', 'canceled', 'refunded',
    ],
    required: true,
  },
});

module.exports = mongoose.model('checkout', checkoutSchema);
