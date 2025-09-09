import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'admin@example.com';
    let admin = await User.findOne({ email });
    if (!admin) {
      const password = await bcrypt.hash('admin123', 10);
      admin = await User.create({ name: 'Admin', email, password, role: 'admin', isVerified: true });
      console.log('Admin user created:', email);
    } else {
      console.log('Admin user already exists:', email);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();


