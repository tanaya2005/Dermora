import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Register new user
 * POST /auth/signup
 */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role, profileImage, phone, address, bankAccount } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Name, email, and password are required' 
      });
    }

    // Validate role
    const validRoles = ['ADMIN', 'SELLER', 'BUYER', 'DERMATOLOGIST'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be ADMIN, SELLER, BUYER, or DERMATOLOGIST' 
      });
    }

    // Validate seller-specific fields
    if (role === 'SELLER') {
      if (!phone || !address || !bankAccount) {
        return res.status(400).json({
          error: 'Phone, address, and bank account details are required for sellers'
        });
      }
      if (!bankAccount.accountNumber || !bankAccount.ifscCode || !bankAccount.accountHolderName || !bankAccount.bankName) {
        return res.status(400).json({
          error: 'Complete bank account details are required for sellers'
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'BUYER',
      profileImage: profileImage || null,
    };

    // Add seller-specific data if role is SELLER
    if (role === 'SELLER') {
      userData.phone = phone;
      userData.address = address;
      userData.bankAccount = bankAccount;
    }

    // Create user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken({ userId: user._id, role: user.role });

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      emailVerified: user.emailVerified,
      skinProfile: user.skinProfile,
      phone: user.phone,
      address: user.address,
      bankAccount: user.bankAccount,
    };

    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ userId: user._id, role: user.role });

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      emailVerified: user.emailVerified,
      skinProfile: user.skinProfile,
    };

    res.json({ user: userResponse, token });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 * GET /auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
