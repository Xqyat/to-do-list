const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories — все категории
router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    res.json(rows); // ВАЖНО: массив
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения категорий' });
  }
});

// POST /api/categories — создать категорию (по ТЗ достаточно любой авторизованный)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ error: 'Название категории обязательно' });
    }

    const [result] = await req.db.query(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    );

    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка создания категории' });
  }
});

module.exports = router;
