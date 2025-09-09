import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

import User from '../models/User.js';
import Student from '../models/Student.js';
import { sendEmail } from '../utils/sendEmail.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'student').default('student'),
  course: Joi.string().allow('', null),
});

router.post('/signup', async (req, res) => {
  try {
    const { value, error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { name, email, password, role, course } = value;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const user = await User.create({ name, email, password: hashed, role, isVerified: false, verificationToken });

    if (role === 'student') {
      await Student.create({ userId: user._id, name, email, course: course || 'MERN Bootcamp' });
    }

    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Welcome ${name}!</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">Verify Email</a></p>`,
    });

    return res.status(201).json({ message: 'Signup successful. Please verify your email.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/login', async (req, res) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
});

const forgotSchema = Joi.object({ email: Joi.string().email().required() });
router.post('/forgot-password', async (req, res) => {
  try {
    const { value, error } = forgotSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { email } = value;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If that email exists, a reset link was sent' });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: email,
      subject: 'Password Reset',
      html: `<p>Reset your password using this link (valid for 10 minutes):</p><p><a href="${resetUrl}">Reset Password</a></p>`,
    });
    return res.json({ message: 'Reset link sent if email exists' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

const resetSchema = Joi.object({ token: Joi.string().required(), password: Joi.string().min(6).required() });
router.post('/reset-password', async (req, res) => {
  try {
    const { value, error } = resetSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { token, password } = value;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const user = await User.findOne({ _id: decoded.id, resetPasswordToken: token, resetPasswordExpire: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

const changeSchema = Joi.object({ oldPassword: Joi.string().required(), newPassword: Joi.string().min(6).required() });
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { value, error } = changeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { oldPassword, newPassword } = value;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Old password incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;


