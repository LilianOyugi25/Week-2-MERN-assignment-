const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { validateProduct } = require('../middleware/validation');

// Get all products with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const { category, inStock, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (inStock) filter.inStock = inStock === 'true';
    
    const products = await Product.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Product.countDocuments(filter);
    
    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products
    });
  } catch (err) {
    next(err);
  }
});

// Search products by name
router.get('/search', async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Name query parameter is required' });
    }
    
    const products = await Product.find({ 
      name: { $regex: name, $options: 'i' } 
    });
    
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// Get product statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: '$price' },
          averagePrice: { $avg: '$price' }
        }
      }
    ]);
    
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// Get single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Create new product
router.post('/', validateProduct, async (req, res, next) => {
  try {
    const product = new Product({
      ...req.body,
      region: 'Western Kenya' // Automatically set region
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// Update product
router.put('/:id', validateProduct, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Delete product
router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
