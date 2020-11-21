
const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true },
  VIPDiscountPercentage: { type: Number, default: 0 },
  barcodeNumber: { type: String, required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'provider' },
});

module.exports = mongoose.model('product', productSchema);
