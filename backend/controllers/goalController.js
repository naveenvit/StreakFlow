const WeeklyGoal = require('../models/WeeklyGoal');
const MonthlyGoal = require('../models/MonthlyGoal');

// @route GET /api/goals/weekly?year=2026&month=2&week=1
const getWeeklyGoals = async (req, res) => {
    try {
        const { year, month, week } = req.query;

        let query = { user_id: req.user.id };
        if (year) query.year = parseInt(year);
        if (month) query.month = parseInt(month);
        if (week) query.week = parseInt(week);

        const goals = await WeeklyGoal.find(query);
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route POST /api/goals/weekly
const createWeeklyGoal = async (req, res) => {
    try {
        const { goal, week, month, year } = req.body;

        if (!goal || !week || !month || !year) {
            return res.status(400).json({ message: 'Please provide all details' });
        }

        const newGoal = await WeeklyGoal.create({
            user_id: req.user.id,
            goal,
            week,
            month,
            year,
        });

        res.status(201).json(newGoal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route PUT /api/goals/weekly/:id
const toggleWeeklyGoal = async (req, res) => {
    try {
        const goal = await WeeklyGoal.findById(req.params.id);
        if (!goal || goal.user_id.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        goal.completed = !goal.completed;
        await goal.save();

        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route GET /api/goals/monthly?year=2026&month=2
const getMonthlyGoals = async (req, res) => {
    try {
        const { year, month } = req.query;
        let query = { user_id: req.user.id };
        if (year) query.year = parseInt(year);
        if (month) query.month = parseInt(month);

        const goals = await MonthlyGoal.find(query);
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route POST /api/goals/monthly
const createMonthlyGoal = async (req, res) => {
    try {
        const { goal, month, year } = req.body;

        if (!goal || !month || !year) {
            return res.status(400).json({ message: 'Please provide all details' });
        }

        const newGoal = await MonthlyGoal.create({
            user_id: req.user.id,
            goal,
            month,
            year,
        });

        res.status(201).json(newGoal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route PUT /api/goals/monthly/:id
const toggleMonthlyGoal = async (req, res) => {
    try {
        const goal = await MonthlyGoal.findById(req.params.id);
        if (!goal || goal.user_id.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        goal.completed = !goal.completed;
        await goal.save();

        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getWeeklyGoals,
    createWeeklyGoal,
    toggleWeeklyGoal,
    getMonthlyGoals,
    createMonthlyGoal,
    toggleMonthlyGoal,
};
