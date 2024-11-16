const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer();

// Database connection configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to verify JWT token
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
        const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = users[0];
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, username: user.username, isAdmin: user.is_admin },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({ token, isAdmin: user.is_admin });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Endpoint to fetch projects
app.get('/projects', async (req, res) => {
    try {
        const [projects] = await pool.execute('SELECT * FROM projects');
        const projectsWithImages = await Promise.all(projects.map(async (project) => {
            const [images] = await pool.execute('SELECT id FROM project_images WHERE project_id = ?', [project.id]);
            return { ...project, imageIds: images.map(img => img.id) };
        }));
        res.json(projectsWithImages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

// Endpoint to fetch a specific image
app.get('/images/:id', async (req, res) => {
    try {
        const [images] = await pool.execute('SELECT image FROM project_images WHERE id = ?', [req.params.id]);
        if (images.length > 0) {
            res.contentType('image/jpeg');
            res.send(images[0].image);
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching image' });
    }
});

// Endpoint to add a new project (admin only)
app.post('/projects', authenticateToken, upload.array('images', 5), async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { name, description } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO projects (name, description) VALUES (?, ?)',
            [name, description]
        );
        const projectId = result.insertId;

        for (let file of req.files) {
            await pool.execute(
                'INSERT INTO project_images (project_id, image) VALUES (?, ?)',
                [projectId, file.buffer]
            );
        }

        res.status(201).json({ message: 'Project added successfully', projectId });
    } catch (error) {
        res.status(500).json({ message: 'Error adding project' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));