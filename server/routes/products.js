const express = require('express');
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Хранилище изображений товаров
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // та же папка, что и для задач
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены!'));
    }
  },
});

// GET /api/products?categoryId=...
router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    let sql =
      'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
    const params = [];

    if (categoryId) {
      sql += ' WHERE p.category_id = ?';
      params.push(categoryId);
    }

    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await req.db.query(sql, params);
    res.json(rows); // Массив товаров
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения товаров' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения товара' });
  }
});

// POST /api/products — создать товар
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category_id } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !price) {
      return res
        .status(400)
        .json({ error: 'Название и цена обязательны' });
    }

    const [result] = await req.db.query(
      'INSERT INTO products (title, description, price, category_id, image, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, price, category_id || null, image, req.userId]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      price,
      category_id,
      image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка создания товара' });
  }
});

// PUT /api/products/:id — обновить свой товар
router.put(
  '/:id',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, description, price, category_id } = req.body;
      const productId = req.params.id;

      // Проверяем, что товар принадлежит пользователю
      const [rows] = await req.db.query(
        'SELECT * FROM products WHERE id = ? AND user_id = ?',
        [productId, req.userId]
      );
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: 'Товар не найден или нет доступа' });
      }

      let image = rows[0].image;
      if (req.file) {
        image = `/uploads/${req.file.filename}`;
      }

      await req.db.query(
        'UPDATE products SET title = ?, description = ?, price = ?, category_id = ?, image = ? WHERE id = ? AND user_id = ?',
        [title, description, price, category_id || null, image, productId, req.userId]
      );

      res.json({ message: 'Товар обновлён' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка обновления товара' });
    }
  }
);

// DELETE /api/products/:id — удалить свой товар
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;

    const [result] = await req.db.query(
      'DELETE FROM products WHERE id = ? AND user_id = ?',
      [productId, req.userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: 'Товар не найден или нет доступа' });
    }

    res.json({ message: 'Товар удалён' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка удаления товара' });
  }
});

module.exports = router;
