require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(require('./middleware/logger'));
app.use(require('./middleware/auth'));

// Routes
app.use('/api/products', productRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Agri-Food Products API for Western Kenya - by Lilian Oyugi');
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
