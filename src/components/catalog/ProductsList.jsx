import React, { useEffect, useState } from 'react';
import { addFavorite, removeFavorite } from '../../api/favoritesApi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/productsApi';
import { getCategories, createCategory } from '../../api/categoriesApi';
import './catalog.css';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [newCategory, setNewCategory] = useState('');
  const navigate = useNavigate();

  const toggleFavorite = async (productId) => {
    try {
      if (favoriteIds.has(productId)) {
        await removeFavorite(productId);
        setFavoriteIds((prev) => {
          const copy = new Set(prev);
          copy.delete(productId);
          return copy;
        });
      } else {
        await addFavorite(productId);
        setFavoriteIds((prev) => new Set(prev).add(productId));
      }
    } catch (e) {
      console.error('Ошибка изменения избранного', e);
    }
  };

  const currentCategory = searchParams.get('categoryId') || '';

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts(currentCategory);
  }, [currentCategory]);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (e) {
      console.error('Ошибка загрузки категорий', e);
    }
  };

  const loadProducts = async (categoryId) => {
    setLoading(true);
    try {
      const res = await getProducts(categoryId || undefined);
      setProducts(res.data);
    } catch (e) {
      console.error('Ошибка загрузки товаров', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ categoryId: value });
    } else {
      setSearchParams({});
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await createCategory(newCategory.trim());
      setNewCategory('');
      loadCategories(); // перезагружаем список
    } catch (e) {
      console.error('Ошибка создания категории', e);
      alert('Не удалось создать категорию');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>;
  }

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1>Каталог товаров</h1>
        <button
          className="btn-primary"
          onClick={() => navigate('/products/create')}
        >
          + Добавить товар
        </button>
      </div>

      <div className="catalog-filters">
  <div className="category-filter">
    <label className="filter-label">
      Категория:
      <select
        value={currentCategory}
        onChange={handleCategoryChange}
        className="filter-select"
      >
        <option value="">Все</option>
        {Array.isArray(categories) &&
          categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
      </select>
    </label>
  </div>

  <form className="create-category-form" onSubmit={handleCreateCategory}>
    <input
      type="text"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      placeholder="Новая категория"
      className="create-category-input"
    />
    <button type="submit" className="btn-secondary">
      Добавить
    </button>
  </form>
</div>



      {products.length === 0 ? (
        <p>Товаров пока нет.</p>
      ) : (
        <div className="products-grid">
          {products.map((p) => {
            const isFav = favoriteIds.has(p.id);
            return (
              <div
                key={p.id}
                className="product-card clickable"
                onClick={() => navigate(`/products/${p.id}`)}
              >
                <div className="product-image-full">
                  <img
                    src={
                      p.image
                        ? `http://localhost:5000${p.image}`
                        : 'https://via.placeholder.com/300x220'
                    }
                    alt={p.title}
                  />
                  <button
                    className={`favorite-icon ${isFav ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // чтобы клик не открывал карточку
                      toggleFavorite(p.id);
                    }}
                    aria-label="Избранное"
                  >
                    {isFav ? '★' : '☆'}
                  </button>
                </div>
                <div className="product-body">
                  <h3 className="product-title">{p.title}</h3>
                  <p className="product-price">{p.price} ₽</p>
                  <p className="product-category">
                    {p.category_name || 'Без категории'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}