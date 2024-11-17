const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)',
            [username, hashedPassword, false]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            const user = rows[0];
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign(
                    { id: user.id, username: user.username, isAdmin: user.is_admin },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                res.json({ token, isAdmin: user.is_admin });
            } else {
                res.status(400).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

app.get('/user-details', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT first_name, last_name, address, phone FROM user_details WHERE user_id = ?',
            [req.user.id]
        );
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.json({
                first_name: '',
                last_name: '',
                address: '',
                phone: ''
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

app.post('/user-details', authenticateToken, async (req, res) => {
    try {
        const { first_name, last_name, address, phone } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO user_details (user_id, first_name, last_name, address, phone) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE first_name = ?, last_name = ?, address = ?, phone = ?',
            [req.user.id, first_name, last_name, address, phone, first_name, last_name, address, phone]
        );
        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user details' });
    }
});

app.get('/user-count', authenticateToken, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users');
        res.json({ count: rows[0].count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user count' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));