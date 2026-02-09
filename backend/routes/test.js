const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Protected route
router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Access granted",
        userId: req.userId
    });
});

module.exports = router;
