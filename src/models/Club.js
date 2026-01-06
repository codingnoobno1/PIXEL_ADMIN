import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["president", "vice-president", "secretary", "treasurer", "member"],
    default: "member",
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
});

const ClubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    members: [MemberSchema],
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    facultyAdvisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming faculty are also users
    },
    logoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Club || mongoose.model("Club", ClubSchema);
