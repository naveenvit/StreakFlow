const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ================= ADD TASK =================
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, checks, month, year } = req.body;

        if (!name || !month || !year) {
            return res.status(400).json({
                message: "Task name, month and year are required"
            });
        }

        const task = await Task.create({
            userId: req.userId,
            name,
            checks: checks || [],
            month,
            year
        });

        res.status(201).json(task);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= GET TASKS =================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                message: "Month and year are required"
            });
        }

        const tasks = await Task.find({
            userId: req.userId,
            month,
            year
        });

        res.json(tasks);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
// ================= UPDATE TASK CHECKS =================
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const { checks } = req.body;

        if (!Array.isArray(checks)) {
            return res.status(400).json({
                message: "Checks must be an array"
            });
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { checks },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
// ============ GET SINGLE TASK ============
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

