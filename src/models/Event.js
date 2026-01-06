import mongoose from "mongoose";

const AttendeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club", // Assuming a club organizes events
      required: true,
    },
    attendees: [AttendeeSchema],
    registrationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "finished", "canceled"],
      default: "upcoming",
    },
    imageUrl: {
      type: String,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);