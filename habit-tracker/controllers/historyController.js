const db = require('../models/database');

exports.showHistory = (req, res) => {
    db.all(`
    SELECT h.name, c.date
    FROM completions c
    JOIN habits h ON h.id = c.habit_id
    ORDER BY c.date DESC
  `, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.render('stats', { completions: rows });
    });
};
