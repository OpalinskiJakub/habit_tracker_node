const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');


router.get('/', habitController.listHabits);


router.post('/habits/add', habitController.addHabit);


router.delete('/habits/:id', habitController.deleteHabit);


router.post('/habits/complete/:id', habitController.completeHabit);


router.post('/habits/import', habitController.importHabits);


router.get('/habits/export', habitController.exportHabits);


router.get('/habits/:id', habitController.habitDetail);

module.exports = router;
