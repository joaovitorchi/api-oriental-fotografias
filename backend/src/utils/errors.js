class AppError extends Error {
    constructor(message, details = {}) {
      super(message);
      this.name = this.constructor.name;
      this.details = details;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class ValidationError extends AppError {
    constructor(message, errors = []) {
      super(message || 'Dados inválidos');
      this.errors = errors;
      this.statusCode = 422;
      this.code = 'VALIDATION_ERROR';
    }
  }
  
  class UnauthorizedError extends AppError {
    constructor(message = 'Não autorizado') {
      super(message);
      this.statusCode = 401;
      this.code = 'UNAUTHORIZED';
    }
  }
  
  class ForbiddenError extends AppError {
    constructor(message = 'Acesso proibido') {
      super(message);
      this.statusCode = 403;
      this.code = 'FORBIDDEN';
    }
  }
  
  class NotFoundError extends AppError {
    constructor(message = 'Recurso não encontrado') {
      super(message);
      this.statusCode = 404;
      this.code = 'NOT_FOUND';
    }
  }
  
  class ConflictError extends AppError {
    constructor(message = 'Conflito') {
      super(message);
      this.statusCode = 409;
      this.code = 'CONFLICT';
    }
  }
  
  class RateLimitError extends AppError {
    constructor(message = 'Muitas requisições') {
      super(message);
      this.statusCode = 429;
      this.code = 'RATE_LIMIT_EXCEEDED';
    }
  }
  
  module.exports = {
    AppError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    RateLimitError
  };