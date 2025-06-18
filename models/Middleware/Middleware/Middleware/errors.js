class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError
};
