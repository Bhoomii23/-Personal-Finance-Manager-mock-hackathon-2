const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,  /* 'income' or 'expense' */
                amount REAL NOT NULL,
                category TEXT,
                date TEXT NOT NULL
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS budget (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount REAL NOT NULL,
                date TEXT NOT NULL
            );
        `);
        console.log("Database and tables created");
    }
});

// Routes

// Get All Transactions
app.get('/transactions', (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// Add Income/Expense
app.post('/transactions', (req, res) => {
    const { type, amount, category, date } = req.body;
    db.run(`INSERT INTO transactions (type, amount, category, date) VALUES (?, ?, ?, ?)`,
        [type, amount, category, date],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

// Get Budget
app.get('/budget', (req, res) => {
    db.get(`SELECT * FROM budget ORDER BY date DESC LIMIT 1`, [], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: row });
    });
});

// Set Budget
app.post('/budget', (req, res) => {
    const { amount, date } = req.body;
    db.run(`INSERT INTO budget (amount, date) VALUES (?, ?)`,
        [amount, date],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
