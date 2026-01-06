import mongoose, { Schema } from 'mongoose';

// Question schema for quiztemplate
const QuestionSchema = new Schema({
  type: { type: String, required: true }, // 'mcq', 'fillup', 'truefalse', etc.
  text: { type: String, required: true },
  options: [String], // for MCQ
  answer: Schema.Types.Mixed, // string, boolean, array, etc.
  // Add more fields as needed for other types
}, { _id: false });

const QuizTemplateSchema = new Schema({
  title: { type: String, required: true },
  batch: { type: String, required: true },
  subject: { type: String, required: true },
  quizType: { type: String, required: true }, // e.g., 'midsem', 'surprise'
  questions: { type: [QuestionSchema], required: true },
  faculty: { type: Schema.Types.ObjectId, ref: 'FacultyCard', required: true },
  createdAt: { type: Date, default: Date.now },
});

const QuizTemplate = mongoose.models.QuizTemplate || mongoose.model('QuizTemplate', QuizTemplateSchema);
export default QuizTemplate;
