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

router.get('/public', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT * FROM sections WHERE is_active = 1 ORDER BY display_order ASC, id ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения секций' });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT * FROM sections ORDER BY display_order ASC, id ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения секций' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT * FROM sections WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Секция не найдена' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения секции' });
  }
});

router.use(authMiddleware);

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { type, title, subtitle, content, is_active, display_order, extra } =
      req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!type) {
      return res.status(400).json({ error: 'Тип секции обязателен' });
    }

    const extraJson = extra ? extra : null; 

    const [result] = await req.db.query(
      `INSERT INTO sections
       (type, title, subtitle, content, image, extra, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        title || null,
        subtitle || null,
        content || null,
        image,
        extraJson,
        is_active !== undefined ? Number(is_active) : 1,
        display_order !== undefined ? Number(display_order) : 0,
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка создания секции' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const sectionId = req.params.id;
    const {
      type,
      title,
      subtitle,
      content,
      is_active,
      display_order,
      extra,
      existingImage,
    } = req.body;

    const [rows] = await req.db.query(
      'SELECT * FROM sections WHERE id = ?',
      [sectionId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Секция не найдена' });
    }

    let image = rows[0].image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (existingImage === '') {
      image = null;
    }

    const extraJson = extra ? extra : rows[0].extra;

    await req.db.query(
      `UPDATE sections
       SET type = ?, title = ?, subtitle = ?, content = ?, image = ?, extra = ?, is_active = ?, display_order = ?
       WHERE id = ?`,
      [
        type || rows[0].type,
        title !== undefined ? title : rows[0].title,
        subtitle !== undefined ? subtitle : rows[0].subtitle,
        content !== undefined ? content : rows[0].content,
        image,
        extraJson,
        is_active !== undefined ? Number(is_active) : rows[0].is_active,
        display_order !== undefined
          ? Number(display_order)
          : rows[0].display_order,
        sectionId,
      ]
    );

    res.json({ message: 'Секция обновлена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка обновления секции' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [result] = await req.db.query(
      'DELETE FROM sections WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Секция не найдена' });
    }
    res.json({ message: 'Секция удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка удаления секции' });
  }
});

router.put('/order', async (req, res) => {
  try {
    const { order } = req.body; 
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'Неверный формат order' });
    }

    const queries = order.map((id, index) =>
      req.db.query(
        'UPDATE sections SET display_order = ? WHERE id = ?',
        [index, id]
      )
    );
    await Promise.all(queries);

    res.json({ message: 'Порядок секций обновлён' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка обновления порядка секций' });
  }
});

module.exports = router;
