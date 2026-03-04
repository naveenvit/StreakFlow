const express = require('express');
const router = express.Router();
const {
    getWeeklyGoals, createWeeklyGoal, toggleWeeklyGoal,
    getMonthlyGoals, createMonthlyGoal, toggleMonthlyGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.route('/weekly').get(protect, getWeeklyGoals).post(protect, createWeeklyGoal);
router.route('/weekly/:id').put(protect, toggleWeeklyGoal);

router.route('/monthly').get(protect, getMonthlyGoals).post(protect, createMonthlyGoal);
router.route('/monthly/:id').put(protect, toggleMonthlyGoal);

module.exports = router;
