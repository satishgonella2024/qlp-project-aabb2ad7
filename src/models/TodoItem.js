const mongoose = require('mongoose');

const TodoItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const TodoItem = mongoose.model('TodoItem', TodoItemSchema);

module.exports = TodoItem;