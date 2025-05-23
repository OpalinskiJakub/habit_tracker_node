const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// Wyświetlenie statystyk
router.get('/', historyController.showHistory);

module.exports = router;
