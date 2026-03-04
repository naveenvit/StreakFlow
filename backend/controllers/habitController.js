const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

// @route GET /api/habits
const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ user_id: req.user.id });
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route POST /api/habits
const createHabit = async (req, res) => {
    try {
        const { habit_name } = req.body;
        if (!habit_name) {
            return res.status(400).json({ message: 'Please provide a habit name' });
        }

        const habit = await Habit.create({
            user_id: req.user.id,
            habit_name,
        });

        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route GET /api/habits/logs?year=2026&month=2
const getHabitLogs = async (req, res) => {
    try {
        const { year, month } = req.query;
        if (!year || !month) {
            return res.status(400).json({ message: 'Please provide year and month' });
        }

        // Format target matching: starts with YYYY-MM
        // e.g., "2026-02"
        const monthStr = month.toString().padStart(2, '0');
        const datePrefix = `${year}-${monthStr}`;

        const logs = await HabitLog.find({
            user_id: req.user.id,
            date: { $regex: `^${datePrefix}` }
        });

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route POST /api/habits/logs
// Toggle log completion
const toggleHabitLog = async (req, res) => {
    try {
        const { habit_id, date, completed } = req.body;

        let log = await HabitLog.findOne({
            habit_id,
            user_id: req.user.id,
            date,
        });

        if (log) {
            log.completed = completed;
            await log.save();
        } else {
            log = await HabitLog.create({
                habit_id,
                user_id: req.user.id,
                date,
                completed,
            });
        }

        res.status(200).json(log);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getHabits,
    createHabit,
    getHabitLogs,
    toggleHabitLog,
};
