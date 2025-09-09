import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';

import Student from '../models/Student.js';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

const studentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  course: Joi.string().min(2).required(),
  enrollmentDate: Joi.date().optional(),
});

// GET /api/students - admin: all with pagination, student: own only
router.get('/', requireAuth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        Student.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Student.countDocuments(),
      ]);
      return res.json({ items, total, page, pages: Math.ceil(total / limit) });
    } else {
      const item = await Student.findOne({ userId: req.user.id });
      return res.json({ items: item ? [item] : [], total: item ? 1 : 0, page: 1, pages: 1 });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/students - admin only
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { value, error } = studentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const { name, email, course, enrollmentDate } = value;

    // Ensure user exists (student role), create if needed
    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + '!A1';
      const hashed = await bcrypt.hash(randomPassword, 10);
      user = await User.create({ name, email, password: hashed, role: 'student', isVerified: true });
    } else if (user.role !== 'student') {
      return res.status(400).json({ message: 'Email belongs to a non-student user' });
    }

    // Create or upsert student profile for this user
    const existingStudent = await Student.findOne({ userId: user._id });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student profile already exists for this user' });
    }
    const created = await Student.create({ userId: user._id, name, email, course, enrollmentDate });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/students/:id - admin any; student own only
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { value, error } = studentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    let updates = value;
    let filter = { _id: id };
    if (req.user.role === 'student') {
      filter = { _id: id, userId: req.user.id };
      // Students cannot change enrollmentDate
      const { name, email, course } = value;
      updates = { name, email, course };
    }
    const updated = await Student.findOneAndUpdate(filter, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Student not found or not permitted' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/students/:id - admin only
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;


