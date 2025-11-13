import React, { useState } from 'react';
import './Main.css';
import { Link } from 'react-router-dom';
import Logo from '../assets/img/LOGO.jpg'

export default function Main() {
  
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Купить продукты', description: 'Молоко, хлеб, яйца', date: '13.11.2025' },
    { id: 2, title: 'Завершить проект', description: 'React компоненты', date: '14.11.2025' }
  ]);
  

  return (
    <>
      <main className="main-container">
        <div className="header-section">
          <h1>Мои задачи</h1>
          <button className="btn-create"><Link to='/user'>+ Создать задачу</Link></button>
        </div>

        <div className="notifications">
          <p className="notification-item">У вас 2 задачи на сегодня!</p>
        </div>

        <div className="tasks-list">
          {tasks.map((task) =>
          <div className="task-card" key={task.id}>
            <div className='task-img'>
              <img src={task.image || "https://via.placeholder.com/80"} alt={Logo} />
            </div>
            <div className="task-content">
              <h3 className="task-title">{task.title}</h3>
              <p className="task-description">{task.description}</p>
              <span className="task-date">{task.date}</span>
            </div>
            <div className="task-actions">
              <button className="btn-edit">Изменить</button>
              <button className="btn-delete">Удалить</button>
            </div>
          </div>
          )}
        </div>
      </main>
    </>
  );
}
