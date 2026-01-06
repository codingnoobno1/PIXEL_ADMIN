// models/QuizResult.js
import mongoose from 'mongoose';

const QuestionResultSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedAnswer: mongoose.Schema.Types.Mixed,
  isCorrect: Boolean,
  timeTaken: Number // in seconds
}, { _id: false });

const QuizResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  totalScore: Number,
  totalTime: Number,
  questionResults: [QuestionResultSchema],
}, { timestamps: true });

export default mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);
