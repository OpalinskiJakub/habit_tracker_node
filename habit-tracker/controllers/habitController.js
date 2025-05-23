const db = require('../models/database');
const fs = require('fs');
const path = require('path');

// Dashboard z liczbą wykonań i ostatnią datą
exports.listHabits = (req, res) => {
    db.all(`SELECT * FROM habits`, [], (err, habits) => {
        if (err) return res.status(500).send(err.message);

        const enriched = [];

        const getStats = (i) => {
            if (i >= habits.length) return res.render('habits', { habits: enriched });

            const h = habits[i];
            db.get(
                `SELECT COUNT(*) as count, MAX(date) as lastDate FROM completions WHERE habit_id = ?`,
                [h.id],
                (err2, stats) => {
                    enriched.push({
                        ...h,
                        count: stats.count,
                        lastDate: stats.lastDate || '—'
                    });
                    getStats(i + 1);
                }
            );
        };

        getStats(0);
    });
};

// Podstrona: szczegóły + historia wykonania
exports.habitDetail = (req, res) => {
    const id = req.params.id;

    db.get(`SELECT * FROM habits WHERE id = ?`, [id], (err, habit) => {
        if (err || !habit) return res.status(404).send('Nie znaleziono nawyku');

        db.all(`SELECT date FROM completions WHERE habit_id = ? ORDER BY date DESC`, [id], (err2, history) => {
            if (err2) return res.status(500).send(err2.message);
            res.render('habit_detail', { habit, history });
        });
    });
};

// Dodanie nowego nawyku
exports.addHabit = (req, res) => {
    const name = req.body.name;
    if (!name) return res.redirect('/habits');

    db.run(`INSERT INTO habits(name) VALUES(?)`, [name], () => {
        res.redirect('/habits');
    });
};

// Usuwanie nawyku
exports.deleteHabit = (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM habits WHERE id = ?`, [id], () => {
        db.run(`DELETE FROM completions WHERE habit_id = ?`, [id], () => {
            res.redirect('/habits');
        });
    });
};

// Zapis wykonania nawyku — wraca na podstronę
exports.completeHabit = (req, res) => {
    const id = req.params.id;
    const date = req.body.date || new Date().toISOString().split('T')[0];

    db.run(`INSERT INTO completions(habit_id, date) VALUES(?, ?)`, [id, date], () => {
        res.redirect(`/habits/${id}`);
    });
};

// Import JSON
exports.importHabits = (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('Brak pliku');

    const filePath = path.join(__dirname, '../', file.path);
    const raw = fs.readFileSync(filePath);
    const data = JSON.parse(raw);

    db.serialize(() => {
        db.run(`DELETE FROM habits`);
        db.run(`DELETE FROM completions`);

        data.habits.forEach(h => {
            db.run(`INSERT INTO habits(id, name) VALUES(?, ?)`, [h.id, h.name]);
        });

        data.completions.forEach(c => {
            db.run(`INSERT INTO completions(habit_id, date) VALUES(?, ?)`, [c.habit_id, c.date]);
        });

        res.redirect('/habits');
    });
};

// Eksport JSON
exports.exportHabits = (req, res) => {
    db.all(`SELECT * FROM habits`, [], (err, habits) => {
        if (err) return res.status(500).send(err.message);

        db.all(`SELECT * FROM completions`, [], (err2, completions) => {
            if (err2) return res.status(500).send(err2.message);

            const jsonData = { habits, completions };
            const filePath = path.join(__dirname, '../data/export.json');
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

            res.download(filePath, 'habits_export.json');
        });
    });
};
