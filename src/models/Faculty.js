// src/models/Faculty.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const FacultySchema = new Schema(
  {
    // 🧾 Basic Info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    // 🎓 Academic Position
    position: {
      type: String,
      enum: [
        'Dean',
        'Associate Dean',
        'Head of Department (HOD)',
        'Head of Section (HOS)',
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Lab Assistant',
        'Research Scholar',
        'Administrative Staff',
      ],
      required: [true, 'Position is required'],
      trim: true,
      index: true, // ✅ useful for filtering by role/position
    },

    // 👤 Roles (System)
    roles: {
      type: [String],
      enum: [
        'project_mentor',
        'quiz_controller',
        'admin_project_coordinator',
        'faculty_coordinator',
        'event_manager',
        'research_faculty',
      ],
      required: [true, 'At least one role is required'],
    },

    // ✉️ Contact Info
    amity_email: {
      type: String,
      required: [true, 'Amity email is required'],
      unique: true, // ✅ index automatically handled
      lowercase: true,
      trim: true,
      match: [/^[A-Za-z0-9._%+-]+@amity\.edu$/, 'Invalid Amity email format'],
    },

    amizone_id: {
      type: String,
      required: [true, 'Amizone ID is required'],
      unique: true, // ✅ index automatically handled
      trim: true,
    },

    // 🔒 Auth
    password_hash: {
      type: String,
      required: [true, 'Password hash is required'],
    },

    // 📘 Reference to FacultyCard
    facultyCard: {
      type: Schema.Types.ObjectId,
      ref: 'FacultyCard',
      default: null,
    },

    // 🧠 Meta & Access Control
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    leaderboardVisible: { type: Boolean, default: true },

    // Audit trail
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

// 🔐 Password Hash Middleware
FacultySchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

// 🔑 Compare Password
FacultySchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// 🧾 Safe JSON output (no password exposed)
FacultySchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password_hash;
  return obj;
};

// ✅ Prevent recompiling models in dev
export default mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema);
