const express = require("express");
const Goal = require("../models/Goal");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ============ ADD GOAL ============
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { text, type, month, year } = req.body;

        if (!text || !type || !month || !year) {
            return res.status(400).json({
                message: "Text, type, month and year are required"
            });
        }

        if (!["weekly", "monthly"].includes(type)) {
            return res.status(400).json({
                message: "Invalid goal type"
            });
        }

        const goal = await Goal.create({
            userId: req.userId,
            text,
            type,
            month,
            year
        });

        res.status(201).json(goal);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ============ GET GOALS ============
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { type, month, year } = req.query;

        if (!type || !month || !year) {
            return res.status(400).json({
                message: "Type, month and year are required"
            });
        }

        const goals = await Goal.find({
            userId: req.userId,
            type,
            month,
            year
        });

        res.json(goals);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ============ UPDATE GOAL (CHECK/UNCHECK) ============
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        if (typeof req.body.done !== "boolean") {
            return res.status(400).json({
                message: "Done field must be boolean"
            });
        }

        const { done } = req.body;


        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { done },
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        res.json(goal);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
