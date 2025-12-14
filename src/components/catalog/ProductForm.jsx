import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../../api/productsApi';
import { getCategories } from '../../api/categoriesApi';
import './catalog.css';

export default function ProductForm() {
  const { id } = useParams(); // если есть id - редактирование
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (e) {
      console.error('Ошибка загрузки категорий', e);
    }
  };

  const loadProduct = async () => {
    try {
      const res = await getProduct(id);
      const p = res.data;
      setTitle(p.title);
      setDescription(p.description || '');
      setPrice(p.price);
      setCategoryId(p.category_id || '');
      if (p.image) {
        setPreview(`http://localhost:5000${p.image}`);
      }
    } catch (e) {
      console.error('Ошибка загрузки товара', e);
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
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category_id', categoryId || '');

    if (image) {
      formData.append('image', image);
    }

    try {
      if (id) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate('/catalog');
    } catch (e) {
      console.error('Ошибка сохранения товара', e);
      alert('Ошибка сохранения товара');
    }
  };

  return (
    <div className="product-form-container">
      <h1>{id ? 'Редактировать товар' : 'Добавить товар'}</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Введите название товара"
          />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Опишите товар"
          />
        </div>

        <div className="form-group">
          <label>Цена (₽)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Категория</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Без категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
            onClick={() => navigate('/catalog')}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
