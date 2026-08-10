import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const router = express.Router();

const toUserResponse = (user) => {
  const userResponse = user.toObject();
  delete userResponse.password;
  return userResponse;
};

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const verifyGoogleCredential = async (credential) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('Google sign-in is not configured');
  }
  const googleClient = new OAuth2Client(clientId);
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });
  return ticket.getPayload();
};


// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, role } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone: phone || undefined,
      role: role || 'user'
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      token: signToken(user),
      user: toUserResponse(user),
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({
        error: 'This account uses Google sign-in. Please continue with Google.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: signToken(user),
      user: toUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Continue with Google
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    let payload;
    try {
      payload = await verifyGoogleCredential(credential);
    } catch (error) {
      if (error.message === 'Google sign-in is not configured') {
        return res.status(500).json({ error: error.message });
      }
      throw error;
    }
    if (!payload?.email || !payload?.sub) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }
    if (payload.email_verified === false) {
      return res.status(401).json({ error: 'Google email is not verified' });
    }

    const email = String(payload.email).toLowerCase().trim();
    const googleId = String(payload.sub);
    const displayName =
      String(payload.name || '').trim() ||
      [payload.given_name, payload.family_name].filter(Boolean).join(' ').trim() ||
      'Google User';

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      let changed = false;
      if (!user.googleId) {
        user.googleId = googleId;
        changed = true;
      }
      if (!user.password && user.authProvider !== 'google') {
        user.authProvider = 'google';
        changed = true;
      }
      if (changed) await user.save();
    } else {
      user = await User.create({
        name: displayName,
        email,
        googleId,
        authProvider: 'google',
        role: 'user',
      });
    }

    return res.json({
      message: 'Google login successful',
      token: signToken(user),
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error('Google auth error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(401).json({ error: 'Google authentication failed' });
  }
});


// Admin-only login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({
      message: 'Admin login successful',
      token: signToken(user),
      user: toUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
