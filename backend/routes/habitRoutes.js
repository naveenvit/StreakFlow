const express = require('express');
const router = express.Router();
const { getHabits, createHabit, getHabitLogs, toggleHabitLog } = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getHabits).post(protect, createHabit);
router.route('/logs').get(protect, getHabitLogs).post(protect, toggleHabitLog);

module.exports = router;
