const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_app',
  waitForConnections: true,
  connectionLimit: 10
});

app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
