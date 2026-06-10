const express = require('express');
const router = express.Router();
const { loginUser, getMe, registerCompany } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/register-company', registerCompany);

module.exports = router;
