import express, { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';
import { generateToken, hashPassword, comparePassword, authenticateToken, requireAdmin } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticationError, ConflictError, NotFoundError } from '../middleware/errorHandler';
import { authLimiter, criticalLimiter } from '../middleware/rateLimiter';
import Joi from 'joi';

const router = express.Router();

// Register admin user (should be restricted in production)
router.post('/register', authLimiter, validate(schemas.register), asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      name,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      role: role || 'user',
      is_active: true,
      email_verified: false
    })
    .select('id, name, email, role, is_active, created_at')
    .single();

  if (error) {
    throw new Error(`User creation failed: ${error.message}`);
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  // Set httpOnly cookie
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at
      }
    }
  });
}));

// Login with rate limiting
router.post('/login', criticalLimiter, validate(schemas.login), asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Get user with password
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, email, password_hash, role, is_active, login_attempts, locked_until')
    .eq('email', email.toLowerCase());

  if (error) {
    console.error('Database error during login:', error);
    throw new AuthenticationError('Invalid email or password');
  }

  if (!users || users.length === 0) {
    throw new AuthenticationError('Invalid email or password');
  }

  const user = users[0];

  // Check if account is active
  if (!user.is_active) {
    throw new AuthenticationError('Account is deactivated. Please contact support.');
  }

  // Check if account is locked
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    throw new AuthenticationError('Account is temporarily locked due to multiple failed login attempts');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    // Increment login attempts
    const loginAttempts = (user.login_attempts || 0) + 1;
    const lockUntil = loginAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null; // Lock for 30 minutes after 5 attempts

    await supabase
      .from('users')
      .update({
        login_attempts: loginAttempts,
        locked_until: lockUntil,
        last_failed_login: new Date().toISOString()
      })
      .eq('id', user.id);

    throw new AuthenticationError('Invalid email or password');
  }

  // Reset login attempts on successful login
  await supabase
    .from('users')
    .update({
      login_attempts: 0,
      locked_until: null,
      last_login: new Date().toISOString()
    })
    .eq('id', user.id);

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  // Set httpOnly cookie
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.is_active
      },
      token: token // Include token in response for API client
    }
  });
}));

// Get current user profile
router.get('/me', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthenticationError('User not authenticated');
  }

  // Get user details from database
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, role, is_active, created_at, last_login')
    .eq('id', req.user.id)
    .single();

  if (error || !user) {
    throw new NotFoundError('User not found');
  }

  if (!user.is_active) {
    throw new AuthenticationError('Account is deactivated');
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    }
  });
}));

// Logout - clear cookie
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('authToken');
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// Password reset request with rate limiting
router.post('/forgot-password', authLimiter, validate(Joi.object({ email: Joi.string().email().required() })), asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  // Check if user exists
  const { data: user } = await supabase
    .from('users')
    .select('id, email, name')
    .eq('email', email.toLowerCase())
    .single();

  // Always return success to prevent email enumeration
  res.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.'
  });

  // If user exists, you would send an email here
  if (user) {
    // TODO: Implement email sending with reset token
    console.log(`Password reset requested for user: ${user.email}`);
  }
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  // This would validate an existing token and issue a new one
  res.json({
    success: true,
    message: 'Token refresh endpoint - implementation needed'
  });
}));

export default router;