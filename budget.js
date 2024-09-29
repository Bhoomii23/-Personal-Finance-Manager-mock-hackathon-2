const express = require('express');
const router = express.Router();
const db = require('../db');

// Get Budget
router.get('/', (req, res) => {
    db.get(`SELECT * FROM budget ORDER BY date DESC LIMIT 1`, [], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: row });
    });
});

// Set Budget
router.post('/', (req, res) => {
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

module.exports = router;
