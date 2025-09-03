import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Custom error class
export class ApiError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Too many requests') {
    super(message, 429);
  }
}

// Error logging utility
const logError = (error: AppError, req: Request): void => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  console.error(`[${timestamp}] ERROR:`, {
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
    request: {
      method,
      url,
      ip,
      userAgent,
      body: method !== 'GET' ? req.body : undefined
    }
  });
};

// Development error response
const sendErrorDev = (error: AppError, res: Response): void => {
  res.status(error.statusCode || 500).json({
    error: {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      isOperational: error.isOperational
    }
  });
};

// Production error response
const sendErrorProd = (error: AppError, res: Response): void => {
  // Operational errors: send message to client
  if (error.isOperational) {
    res.status(error.statusCode || 500).json({
      error: {
        message: error.message,
        statusCode: error.statusCode
      }
    });
  } else {
    // Programming errors: don't leak details
    console.error('NON-OPERATIONAL ERROR:', error);
    
    res.status(500).json({
      error: {
        message: 'Something went wrong on our end. Please try again later.',
        statusCode: 500
      }
    });
  }
};

// Handle specific database errors
const handleDatabaseError = (error: any): ApiError => {
  // Supabase/PostgreSQL specific errors
  if (error.code || (error as any).code) {
    const code = error.code || (error as any).code;
    switch (code) {
      case '23505': // Unique violation
        return new ConflictError('Resource already exists');
      case '23503': // Foreign key violation
        return new ValidationError('Referenced resource does not exist');
      case '23502': // Not null violation
        return new ValidationError('Required field is missing');
      case '22001': // String data right truncation
        return new ValidationError('Data too long for field');
      case 'PGRST301': // Row not found
        return new NotFoundError('Resource not found');
      case 'PGRST116': // No rows found
        return new NotFoundError('No data found');
      default:
        return new ApiError('Database operation failed', 500);
    }
  }

  // Generic database errors
  if (error.message) {
    if (error.message.includes('duplicate key')) {
      return new ConflictError('Resource already exists');
    }
    if (error.message.includes('not found')) {
      return new NotFoundError('Resource not found');
    }
  }

  return new ApiError('Database error occurred', 500);
};

// Main error handling middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let err = error as AppError;

  // Set default values
  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational !== undefined ? err.isOperational : false;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    err = new ValidationError(error.message);
  } else if (error.name === 'JsonWebTokenError') {
    err = new AuthenticationError('Invalid token');
  } else if (error.name === 'TokenExpiredError') {
    err = new AuthenticationError('Token expired');
  } else if (error.name === 'CastError') {
    err = new ValidationError('Invalid data format');
  } else if (error.message.includes('PGRST') || (error as any).code) {
    err = handleDatabaseError(error);
  }

  // Log error
  logError(err, req);

  // Send response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Graceful shutdown handler
export const handleUncaughtException = (): void => {
  process.on('uncaughtException', (error: Error) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(error.name, error.message, error.stack);
    process.exit(1);
  });
};

export const handleUnhandledRejection = (): void => {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error('Reason:', reason);
    console.error('Promise:', promise);
    process.exit(1);
  });
};