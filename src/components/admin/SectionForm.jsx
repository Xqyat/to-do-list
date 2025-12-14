import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSection, createSection, updateSection } from '../../api/sectionsApi';
import './adminSections.css';

export default function SectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState('hero');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [extra, setExtra] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [existingImage, setExistingImage] = useState('');

  useEffect(() => {
    if (id) {
      loadSection();
    }
  }, [id]);

  const loadSection = async () => {
    try {
      const res = await getSection(id);
      const sec = res.data;
      setType(sec.type);
      setTitle(sec.title || '');
      setSubtitle(sec.subtitle || '');
      setContent(sec.content || '');
      setIsActive(!!sec.is_active);
      setDisplayOrder(sec.display_order || 0);
      setExtra(sec.extra || '');
      if (sec.image) {
        setExistingImage(sec.image);
        setPreview(`http://localhost:5000${sec.image}`);
      }
    } catch (e) {
      console.error('Ошибка загрузки секции', e);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('type', type);
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('content', content);
    formData.append('is_active', isActive ? '1' : '0');
    formData.append('display_order', displayOrder);
    formData.append('extra', extra);

    if (image) {
      formData.append('image', image);
    } else if (existingImage) {
      formData.append('existingImage', existingImage);
    } else {
      formData.append('existingImage', '');
    }

    try {
      if (id) {
        await updateSection(id, formData);
      } else {
        await createSection(formData);
      }
      navigate('/admin/sections');
    } catch (e) {
      console.error('Ошибка сохранения секции', e);
      alert('Ошибка сохранения секции');
    }
  };

  return (
    <div className="admin-sections-container">
      <h1>{id ? 'Редактировать секцию' : 'Создать секцию'}</h1>

      <form className="section-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Тип секции</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="hero">Hero</option>
            <option value="about">О компании</option>
            <option value="services">Услуги / товары</option>
            <option value="testimonials">Отзывы</option>
            <option value="contacts">Контакты</option>
          </select>
        </div>

        <div className="form-group">
          <label>Заголовок</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Подзаголовок</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Основной текст / описание</label>
          <textarea
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Дополнительные данные (JSON, опционально)</label>
          <textarea
            rows="4"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder='Например: {"items":[{"title":"Услуга","description":"Описание","price":1000}]}'
          />
        </div>

        <div className="form-group">
          <label>Активна</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />{' '}
          Показывать на лендинге
        </div>

        <div className="form-group">
          <label>Порядок отображения (число)</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Изображение</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Предпросмотр" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Сохранить
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/sections')}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
