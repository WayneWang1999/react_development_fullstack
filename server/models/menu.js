const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  menu_images_url: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'},
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);