// src/models/FacultyCard.js
import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/* -------------------------------------------------------------------------- */
/* 🧩 Embedded Schemas */
/* -------------------------------------------------------------------------- */

/**
 * 🔹 Quiz Reference Schema — represents a quiz linked to a subject
 */
const QuizRefSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

/**
 * 🔹 Subject Reference Schema — references the main Subject model
 */
const SubjectRefSchema = new Schema(
  {
    subjectId: { // This will store the ObjectId of the Subject document
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    name: { // Added to store the subject's name
      type: String,
      required: true,
      trim: true,
    },
    quizzes: {
      type: [QuizRefSchema],
      default: [],
      validate: {
        validator: Array.isArray,
        message: 'Quizzes must be an array',
      },
    },
  },
  { _id: false }
);

/**
 * 🔹 Class Assignment Schema — which batches/sections a faculty handles
 */
const ClassAssignmentSchema = new Schema(
  {
    batch: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    section: {
      type: String,
      trim: true,
      default: '',
    },
    roomNumber: {
      type: String,
      trim: true,
      default: '',
    },
    subjects: {
      type: [SubjectRefSchema], // Changed to SubjectRefSchema
      default: [],
      validate: {
        validator: Array.isArray,
        message: 'Subjects must be an array',
      },
    },
  },
  { _id: false }
);

/* -------------------------------------------------------------------------- */
/* 🧠 Main FacultyCard Schema */
/* -------------------------------------------------------------------------- */

const FacultyCardSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
      // Removed default: uuidv4 - we set this manually from amiId
    },

    /**
     * 🔗 One-to-One link to Faculty document
     */
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
      unique: true, // ensures one FacultyCard per Faculty
      index: true, // ✅ keep only ONE index declaration
    },

    // 👨‍🏫 Core Information
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
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
    },

    // 🖼️ Profile Image
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },

    // 📚 Academic Assignments
    classAssignments: {
      type: [ClassAssignmentSchema],
      default: [],
    },

    // 🧾 Quizzes Created by Faculty
    quizzes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'QuizTemplate',
      },
    ],

    // 🏅 Metadata
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* -------------------------------------------------------------------------- */
/* ⚙️ Optimized Indexes */
/* -------------------------------------------------------------------------- */
// 🧠 Remove duplicates — keep only useful indexes
FacultyCardSchema.index({ department: 1 });
FacultyCardSchema.index({ position: 1 });
FacultyCardSchema.index({ 'classAssignments.batch': 1 });
// uuid index already defined in field definition with unique: true

/* -------------------------------------------------------------------------- */
/* 🧾 Helper Methods */
/* -------------------------------------------------------------------------- */

/**
 * Returns a sanitized JSON representation for API responses
 */
FacultyCardSchema.methods.toPublicJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj._id;
  delete obj.__v;
  if (obj.faculty?.password_hash) delete obj.faculty.password_hash;
  return obj;
};

/**
 * Auto-populate Faculty details on all find queries
 */
FacultyCardSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'faculty',
    select: 'name amity_email position roles isActive isVerified',
  });
  next();
});

/* -------------------------------------------------------------------------- */
/* ✅ Model Export */
/* -------------------------------------------------------------------------- */

const FacultyCard =
  mongoose.models.FacultyCard || mongoose.model('FacultyCard', FacultyCardSchema);

export default FacultyCard;
