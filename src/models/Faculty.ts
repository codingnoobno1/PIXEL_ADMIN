// src/models/Faculty.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Faculty Document Interface
 * (represents a single Faculty record in MongoDB)
 */
export interface IFaculty extends Document {
  name: string;
  position:
    | 'Dean'
    | 'Associate Dean'
    | 'Head of Department (HOD)'
    | 'Head of Section (HOS)'
    | 'Professor'
    | 'Associate Professor'
    | 'Assistant Professor'
    | 'Lab Assistant'
    | 'Research Scholar'
    | 'Administrative Staff';
  roles: (
    | 'project_mentor'
    | 'quiz_controller'
    | 'admin_project_coordinator'
    | 'faculty_coordinator'
    | 'event_manager'
    | 'research_faculty'
  )[];
  amity_email: string;
  amizone_id: string;
  password: string;
  facultyCard?: mongoose.Types.ObjectId | null;
  lastLogin?: Date | null;
  loginCount?: number;
  isActive: boolean;
  isVerified: boolean;
  leaderboardVisible: boolean;
  createdBy?: mongoose.Types.ObjectId | null;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;

  // 🔐 Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  toSafeObject(): Record<string, unknown>;
}

/**
 * Faculty Model Interface
 * (represents the overall model with methods like find, create, etc.)
 */
export interface IFacultyModel extends Model<IFaculty> {}

/**
 * Faculty Schema Definition
 */
const FacultySchema = new Schema<IFaculty>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
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
      index: true,
    },
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
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one role must be provided',
      },
    },
    amity_email: {
      type: String,
      required: [true, 'Amity email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[A-Za-z0-9._%+-]+@amity\.edu$/, 'Invalid Amity email format'],
    },
    amizone_id: {
      type: String,
      required: [true, 'Amizone ID is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    facultyCard: {
      type: Schema.Types.ObjectId,
      ref: 'FacultyCard',
      default: null,
    },
    lastLogin: { type: Date, default: null },
    loginCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    leaderboardVisible: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true }
);

/**
 * 🔐 Auto-hash password before saving
 */
FacultySchema.pre<IFaculty>('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

/**
 * 🔑 Compare Password (login check)
 */
FacultySchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * 🧾 Safe object without password
 */
FacultySchema.methods.toSafeObject = function (): Record<string, unknown> {
  const obj = this.toObject({ virtuals: true });
  delete (obj as any).password;
  return obj;
};

/**
 * ✅ Prevent model recompilation during hot reload
 */
const Faculty: IFacultyModel =
  (mongoose.models.Faculty as IFacultyModel) ||
  mongoose.model<IFaculty, IFacultyModel>('Faculty', FacultySchema);

export default Faculty;
