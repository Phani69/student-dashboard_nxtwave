import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    course: { type: String, required: true },
    enrollmentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);


