const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

// Strona główna z listą nawyków
router.get('/', habitController.listHabits);

// Dodawanie nowego nawyku
router.post('/add', habitController.addHabit);

// Usuwanie nawyku
router.post('/delete/:id', habitController.deleteHabit);

// Zaznaczenie wykonania nawyku (z datą)
router.post('/complete/:id', habitController.completeHabit);

// Import danych z JSON
router.post('/import', habitController.importHabits);

// Eksport danych do JSON
router.get('/export', habitController.exportHabits);

router.get('/:id', habitController.habitDetail); // nowa podstrona


module.exports = router;
