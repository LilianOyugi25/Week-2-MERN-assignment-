const { 
  NotFoundError, 
  ValidationError 
} = require('../errors');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: err.message });
  }
  
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong on the server' 
  });
};

module.exports = { errorHandler };
