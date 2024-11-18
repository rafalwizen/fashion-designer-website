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
const upload = multer();

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

app.get('/projects', async (req, res) => {
    try {
        const [projects] = await pool.execute('SELECT id, name, description, price FROM projects');
        const projectsWithImages = await Promise.all(projects.map(async (project) => {
            const [images] = await pool.execute('SELECT id FROM project_images WHERE project_id = ?', [project.id]);
            return {
                ...project,
                imageIds: images.map(img => img.id)
            };
        }));
        res.json(projectsWithImages);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

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

app.post('/projects', authenticateToken, upload.array('images'), async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);

    const { name, description, price } = req.body;
    const images = req.files;

    try {
        const [result] = await pool.execute(
            'INSERT INTO projects (name, description, price) VALUES (?, ?, ?)',
            [name, description, parseFloat(price)]
        );
        const projectId = result.insertId;

        for (let file of req.files) {
            await pool.execute(
                'INSERT INTO project_images (project_id, image) VALUES (?, ?)',
                [projectId, file.buffer]
            );
        }

        res.status(201).json({ message: 'Project created successfully', projectId });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project' });
    }
});

app.put('/projects/:id', authenticateToken, upload.array('newImages'), async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);

    const { id } = req.params;
    const { name, description, price, deletedImageIds } = req.body;
    const newImages = req.files;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.execute(
            'UPDATE projects SET name = ?, description = ?, price = ? WHERE id = ?',
            [name, description, parseFloat(price), id]
        );

        if (deletedImageIds && deletedImageIds.length > 0) {
            const deletedIds = JSON.parse(deletedImageIds);
            if (deletedIds.length > 0) {
                const placeholders = deletedIds.map(() => '?').join(',');
                await conn.execute(
                    `DELETE FROM project_images WHERE id IN (${placeholders})`,
                    deletedIds
                );
            }
        }

        if (newImages && newImages.length > 0) {
            const insertImageQuery = 'INSERT INTO project_images (project_id, image) VALUES (?, ?)';
            for (const image of newImages) {
                await conn.execute(insertImageQuery, [id, image.buffer]);
            }
        }

        await conn.commit();
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        await conn.rollback();
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project' });
    } finally {
        conn.release();
    }
});

app.delete('/projects/:id', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const projectId = req.params.id;
        await pool.execute('DELETE FROM project_images WHERE project_id = ?', [projectId]);
        const [result] = await pool.execute('DELETE FROM projects WHERE id = ?', [projectId]);

        if (result.affectedRows > 0) {
            res.json({ message: 'Project deleted successfully' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));