const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const habitsRouter = require('./routes/habits');
const historyRouter = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const upload = multer({ dest: 'uploads/' });
app.use(upload.single('jsonFile'));


app.use('/habits', habitsRouter);
app.use('/history', historyRouter);


app.get('/', (req, res) => {
  res.redirect('/habits');
});


app.listen(PORT, () => {
  console.log(`✅ Habit Tracker running on port ${PORT}`);
});
