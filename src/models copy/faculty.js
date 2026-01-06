// models/Faculty.js
const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '', // or default avatar URL if you want
  },
  subjects: {
    type: [String], // Array of strings
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: 'At least one subject required',
    },
  },
}, {
  timestamps: true, // Optional: createdAt and updatedAt fields
});

module.exports = mongoose.model('Faculty', FacultySchema);
