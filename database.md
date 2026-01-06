# Database Documentation

This document outlines the database structure for the project.

## Databases

We use multiple database types in this project:

- **MongoDB (NoSQL)**: Used as the primary database for most application data. Connection is handled via Mongoose.
- **SQL (Relational)**: An SQL database (like MSSQL, PostgreSQL or MySQL) can be used for specific relational data.

## Files

- **`database.sql`**: Contains the SQL schema for the relational database.
- **`database.js`**: Provides a centralized module for database connections (MongoDB and SQL).
- **`src/models`**: Contains all the Mongoose models for MongoDB.
- **`src/lib/dbConnect.js`**: Mongoose connection helper.
- **`src/lib/mongo.js`**: MongoDB native driver connection helper.
- **`src/lib/db.js`**: MSSQL connection helper.

## Data Models

Here are the Mongoose models corresponding to the SQL tables.

### `base_user` model (`src/models/base_user.js`)

```javascript
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs"; // Import bcryptjs

const BaseUserSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "student", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving the user document
BaseUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Proceed with the save operation
  } catch (err) {
    next(err); // Pass error to next middleware
  }
});

// Method to compare passwords (useful for login)
BaseUserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.BaseUser || mongoose.model("BaseUser", BaseUserSchema);
```

### `faculty` model (`src/models/faculty.js`)

```javascript
// models/Faculty.js
import mongoose from 'mongoose';

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['project_mentor', 'quiz_controllers'],
    required: true,
  },
  amity_email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  amizone_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password_hash: {
    type: String,
    required: true,
  },

  subjectsTaught: [
    {
      subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
      sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
    }
  ],

  // 🆕 Quizzes created by this faculty
  quizzesCreated: [{
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    isReusable: { type: Boolean, default: true } // allows reuse by other faculties
  }],

  // 🆕 Optional: show leaderboard control (visibility by default)
  leaderboardVisible: {
    type: Boolean,
    default: true,
  },

}, { timestamps: true });

export default mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema);
```

### `student` model (`src/models/User.js`)

This model appears to be used for students.

```javascript
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "student", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
```
