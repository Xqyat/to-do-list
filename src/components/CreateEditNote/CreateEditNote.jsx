import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, createTask, updateTask } from '../../api/api';
import './CreateEditNote.css';

export default function CreateEditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [existingImage, setExistingImage] = useState('');

  useEffect(() => {
    if (id) {
      loadTask();
    }
  }, [id]);

  const loadTask = async () => {
    try {
      const response = await getTask(id);
      const task = response.data;
      setTitle(task.title);
      setDescription(task.description);
      setDate(task.date.split('T')[0]); 
      if (task.image) {
        setExistingImage(task.image);
        setPreview(`http://localhost:5000${task.image}`);
      }
    } catch (error) {
      console.error('Ошибка загрузки задачи:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    
    if (image) {
      formData.append('image', image); 
    } else if (existingImage) {
      formData.append('existingImage', existingImage); 
    }

    try {
      if (id) {
        await updateTask(id, formData);
      } else {
        await createTask(formData);
      }
      navigate('/main');
    } catch (error) {
      console.error('Ошибка сохранения задачи:', error);
      alert('Ошибка сохранения задачи');
    }
  };

  return (
    <div className="create-edit-container">
      <h1>{id ? 'Редактировать задачу' : 'Создать новую задачу'}</h1>
      
      <form className="task-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="title">Название задачи</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите описание задачи"
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Дата</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Загрузить изображение</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Предпросмотр" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">Сохранить</button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/main')}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
