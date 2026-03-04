const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    habit_name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
