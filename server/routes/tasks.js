const express = require('express');
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены!'));
    }
  }
});

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [tasks] = await req.db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY date DESC',
      [req.userId]
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения задач' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [tasks] = await req.db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json(tasks[0]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения задачи' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    const [result] = await req.db.query(
      'INSERT INTO tasks (title, description, date, image, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, date, image, req.userId]
    );
    
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      date,
      image
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания задачи' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    let image = req.body.existingImage;
    
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    
    const [result] = await req.db.query(
      'UPDATE tasks SET title = ?, description = ?, date = ?, image = ? WHERE id = ? AND user_id = ?',
      [title, description, date, image, req.params.id, req.userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json({ message: 'Задача обновлена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления задачи' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await req.db.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json({ message: 'Задача удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления задачи' });
  }
});

module.exports = router;
