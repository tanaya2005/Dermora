/**
 * Middleware to check if user has required role
 * Must be used after authenticate middleware
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Convenience middleware for specific roles
export const adminOnly = requireRole('ADMIN');
export const sellerOnly = requireRole('SELLER', 'ADMIN');
export const buyerOnly = requireRole('BUYER', 'SELLER', 'ADMIN');
