const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');


router.get('/', habitController.listHabits);


router.post('/add', habitController.addHabit);


router.post('/delete/:id', habitController.deleteHabit);


router.post('/complete/:id', habitController.completeHabit);


router.post('/import', habitController.importHabits);


router.get('/export', habitController.exportHabits);

router.get('/:id', habitController.habitDetail);


module.exports = router;
