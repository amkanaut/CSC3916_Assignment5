const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');

// Connect these routes to authController functions, mapping endpoints to functions to utilize
router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;