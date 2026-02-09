const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * DAILY REPORT
 * GET /api/reports/daily?month=9&year=2026
 */
router.get("/daily", authMiddleware, async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                message: "Month and year are required"
            });
        }

        const tasks = await Task.find({
            userId: req.userId,
            month: Number(month),
            year: Number(year)
        });

        const report = tasks.map(task => {
            const totalDays = task.checks.length;
            const completedDays = task.checks.filter(v => v).length;

            const percentage =
                totalDays === 0
                    ? 0
                    : Math.round((completedDays / totalDays) * 100);

            return {
                taskId: task._id,
                name: task.name,
                completedDays,
                totalDays,
                percentage
            };
        });

        res.json(report);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;
