const mongoose = require('mongoose');

const monthlyGoalSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: String, required: true },
    completed: { type: Boolean, default: false },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('MonthlyGoal', monthlyGoalSchema);
