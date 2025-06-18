const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Cereals', 
      'Dairy', 
      'Vegetables', 
      'Fruits', 
      'Legumes', 
      'Tubers',
      'Poultry',
      'Livestock'
    ]
  },
  inStock: {
    type: Boolean,
    default: true
  },
  region: {
    type: String,
    default: 'Western Kenya'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
