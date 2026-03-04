const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

// @route GET /api/analytics/daily?year=2026&month=2
const getDailyAnalytics = async (req, res) => {
    try {
        const { year, month } = req.query;
        if (!year || !month) return res.status(400).json({ message: 'Year and month required' });

        const habits = await Habit.find({ user_id: req.user.id });
        if (habits.length === 0) return res.status(200).json({ overallSuccess: 0, taskWise: [] });

        // Find days in month
        const daysInMonth = new Date(year, month, 0).getDate();
        const totalPossibleHabitDays = habits.length * daysInMonth;

        const monthStr = month.toString().padStart(2, '0');
        const logs = await HabitLog.find({
            user_id: req.user.id,
            date: { $regex: `^${year}-${monthStr}` },
            completed: true
        });

        const overallSuccess = totalPossibleHabitDays === 0 ? 0 : Math.round((logs.length / totalPossibleHabitDays) * 100);

        const taskWise = habits.map(habit => {
            const habitLogs = logs.filter(log => log.habit_id.toString() === habit._id.toString());
            const completion = daysInMonth === 0 ? 0 : Math.round((habitLogs.length / daysInMonth) * 100);
            return {
                habit_id: habit._id,
                habit_name: habit.habit_name,
                completion,
            };
        });

        res.status(200).json({ overallSuccess, taskWise });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route GET /api/analytics/task/:id?year=2026&month=2
const getTaskAnalytics = async (req, res) => {
    try {
        const { year, month } = req.query;
        const habitId = req.params.id;

        if (!year || !month) return res.status(400).json({ message: 'Year and month required' });

        const habit = await Habit.findById(habitId);
        if (!habit || habit.user_id.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const daysInMonth = new Date(year, month, 0).getDate();
        const monthStr = month.toString().padStart(2, '0');

        const logs = await HabitLog.find({
            habit_id: habitId,
            user_id: req.user.id,
            date: { $regex: `^${year}-${monthStr}` },
        });

        const doneDays = logs.filter(log => log.completed).length;
        const missedDays = daysInMonth - doneDays;

        // Build day-wise progress
        const dayWise = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const dayStr = i.toString().padStart(2, '0');
            const dateStr = `${year}-${monthStr}-${dayStr}`;
            const log = logs.find(l => l.date === dateStr);
            dayWise.push({
                day: i,
                status: log && log.completed ? 1 : 0
            });
        }

        res.status(200).json({
            habit_name: habit.habit_name,
            pieChart: { done: doneDays, missed: missedDays },
            lineChart: dayWise
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route GET /api/analytics/weekly-success?year=2026&month=2&week=1
const getWeeklyAnalytics = async (req, res) => {
    const WeeklyGoal = require('../models/WeeklyGoal');
    try {
        const { year, month, week } = req.query;

        let query = { user_id: req.user.id };
        if (year) query.year = parseInt(year);
        if (month) query.month = parseInt(month);
        if (week) query.week = parseInt(week);

        const goals = await WeeklyGoal.find(query);
        const completed = goals.filter(g => g.completed).length;
        const overallSuccess = goals.length === 0 ? 0 : Math.round((completed / goals.length) * 100);

        // List of goals is actually just returned in `goals`, but returning success here
        res.status(200).json({ overallSuccess });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route GET /api/analytics/monthly-success?year=2026&month=2
const getMonthlyAnalytics = async (req, res) => {
    const MonthlyGoal = require('../models/MonthlyGoal');
    try {
        const { year, month } = req.query;
        let query = { user_id: req.user.id };
        if (year) query.year = parseInt(year);
        if (month) query.month = parseInt(month);

        const goals = await MonthlyGoal.find(query);
        const completed = goals.filter(g => g.completed).length;
        const overallSuccess = goals.length === 0 ? 0 : Math.round((completed / goals.length) * 100);

        res.status(200).json({ overallSuccess });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDailyAnalytics,
    getTaskAnalytics,
    getWeeklyAnalytics,
    getMonthlyAnalytics
};
