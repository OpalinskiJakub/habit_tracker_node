const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const habitsRouter = require('./routes/habits');
const historyRouter = require('./routes/history');

const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Obsługa uploadu JSON (import)
const upload = multer({ dest: 'uploads/' });
app.use(upload.single('jsonFile'));

// Routing
app.use('/habits', habitsRouter);
app.use('/history', historyRouter);

// Strona główna przekierowuje na /habits
app.get('/', (req, res) => {
    res.redirect('/habits');
});

// Start serwera
app.listen(PORT, () => {
    console.log(`✅ Habit Tracker running: http://localhost:${PORT}`);
});
