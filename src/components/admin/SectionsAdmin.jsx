import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSections,
  deleteSection,
  updateSectionsOrder,
} from '../../api/sectionsApi';
import './adminSections.css';

export default function SectionsAdmin() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      const res = await getSections();
      setSections(res.data);
    } catch (e) {
      console.error('Ошибка загрузки секций', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить секцию?')) return;
    try {
      await deleteSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error('Ошибка удаления секции', e);
    }
  };

  const moveSection = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newList = [...sections];
    const temp = newList[index];
    newList[index] = newList[newIndex];
    newList[newIndex] = temp;

    setSections(newList);

    // Отправляем новый порядок на бэк
    try {
      const orderArray = newList.map((s) => s.id);
      await updateSectionsOrder(orderArray);
    } catch (e) {
      console.error('Ошибка обновления порядка', e);
    }
  };

  if (loading) {
    return <div className="admin-loading">Загрузка секций...</div>;
  }

  return (
    <div className="admin-sections-container">
      <div className="admin-sections-header">
        <h1>Управление секциями лендинга</h1>
        <button
          className="btn-primary"
          onClick={() => navigate('/admin/sections/create')}
        >
          + Создать секцию
        </button>
      </div>

      {sections.length === 0 ? (
        <p>Секций пока нет.</p>
      ) : (
        <table className="sections-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Тип</th>
              <th>Заголовок</th>
              <th>Активна</th>
              <th>Порядок</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s, index) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.type}</td>
                <td>{s.title}</td>
                <td>{s.is_active ? 'Да' : 'Нет'}</td>
                <td>{index + 1}</td>
                <td>
                  <button
                    className="btn-link"
                    onClick={() => navigate(`/admin/sections/edit/${s.id}`)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="btn-link danger"
                    onClick={() => handleDelete(s.id)}
                  >
                    Удалить
                  </button>
                  <button
                    className="btn-link small"
                    onClick={() => moveSection(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    className="btn-link small"
                    onClick={() => moveSection(index, 1)}
                  >
                    ↓
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
