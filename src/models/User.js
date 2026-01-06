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
    amizone_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    course: {
      type: String,
      required: false, // Changed to false
      trim: true,
    },
    semester: {
      type: String,
      required: false, // Changed to false
      trim: true,
    },
    amity_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String], // Changed to an array of strings
      default: ["user"],
      enum: ["user", "student", "admin", "faculty", "project_mentor", "quiz_controller", "admin_project_coordinator"], // Updated enum values
    },
    clubs: [
      {
        club: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Club",
        },
        role: {
          type: String,
          enum: ["president", "vice-president", "secretary", "treasurer", "member"],
          default: "member",
        },
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
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
