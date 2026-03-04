const mongoose = require('mongoose');

const weeklyGoalSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: String, required: true },
    completed: { type: Boolean, default: false },
    week: { type: Number, required: true },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('WeeklyGoal', weeklyGoalSchema);
