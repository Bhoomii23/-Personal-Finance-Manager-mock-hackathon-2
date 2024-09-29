const express = require('express');
const router = express.Router();
const db = require('../db');

// Get All Transactions
router.get('/', (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// Add Income/Expense
router.post('/', (req, res) => {
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

module.exports = router;
