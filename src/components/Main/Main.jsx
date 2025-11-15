import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask } from '../../api/api';
import './Main.css';

export default function Main() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить задачу?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        console.error('Ошибка удаления задачи:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Загрузка задач...</div>;
  }

  return (
    <div className="main-container">
      <div className="header-section">
        <h1>Мои задачи</h1>
        <Link to="/create">
          <button className="btn-create">+ Создать задачу</button>
        </Link>
      </div>

      <div className="notifications">
        <p className="notification-item">У вас {tasks.length} задач!</p>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">Задач пока нет. Создайте первую!</p>
        ) : (
          tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <div className='task-img'>
                <img 
                  src={task.image ? `http://localhost:5000${task.image}` : "https://via.placeholder.com/80"} 
                  alt={task.title} 
                />
              </div>
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <span className="task-date">{new Date(task.date).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="task-actions">
                <Link to={`/edit/${task.id}`}>
                  <button className="btn-edit">Изменить</button>
                </Link>
                <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
