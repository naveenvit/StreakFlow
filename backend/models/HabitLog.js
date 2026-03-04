const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema({
    habit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    completed: { type: Boolean, default: false },
}, { timestamps: true });

// Ensure a user can only have one log per habit per date
habitLogSchema.index({ habit_id: 1, user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitLog', habitLogSchema);
