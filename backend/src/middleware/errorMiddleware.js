/**
 * Global error handling middleware
 * Catches all errors and returns consistent error responses
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({ 
      error: 'Resource already exists',
      field: err.meta?.target?.[0] 
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' });
  }

  // Validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: err.errors 
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Middleware for handling 404 routes
 */
export const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};
