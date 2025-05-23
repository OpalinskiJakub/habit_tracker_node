const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Połączenie z bazą
const db = new sqlite3.Database(path.join(__dirname, '../data/habits.db'), (err) => {
    if (err) console.error('❌ Błąd bazy danych:', err.message);
    else console.log('✅ Połączono z bazą danych SQLite');
});

// Tworzenie tabel
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER,
      date TEXT,
      FOREIGN KEY(habit_id) REFERENCES habits(id)
    )
  `);
});

module.exports = db;
