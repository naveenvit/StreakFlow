const express = require('express');
const router = express.Router();
const { getDailyAnalytics, getTaskAnalytics, getWeeklyAnalytics, getMonthlyAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/daily', protect, getDailyAnalytics);
router.get('/task/:id', protect, getTaskAnalytics);
router.get('/weekly-success', protect, getWeeklyAnalytics);
router.get('/monthly-success', protect, getMonthlyAnalytics);

module.exports = router;
