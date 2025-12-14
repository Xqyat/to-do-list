const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/:productId', async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;

    await req.db.query(
      'INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );

    res.status(201).json({ message: 'Товар добавлен в избранное' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка добавления в избранное' });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;

    await req.db.query(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    res.json({ message: 'Товар удалён из избранного' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка удаления из избранного' });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    const [rows] = await req.db.query(
      `SELECT p.*, c.name AS category_name
       FROM favorites f
       JOIN products p ON f.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка получения избранного' });
  }
});

module.exports = router;
