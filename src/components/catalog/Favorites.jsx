import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../../api/favoritesApi';
import './catalog.css';

export default function Favorites() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await getFavorites();
      setProducts(res.data);
    } catch (e) {
      console.error('Ошибка загрузки избранного', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Убрать товар из избранного?')) return;
    try {
      await removeFavorite(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error('Ошибка удаления из избранного', e);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка избранного...</div>;
  }

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1>Избранные товары</h1>
      </div>

      {products.length === 0 ? (
        <p>Вы ещё ничего не добавили в избранное.</p>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-image">
                <img
                  src={
                    p.image
                      ? `http://localhost:5000${p.image}`
                      : 'https://via.placeholder.com/200x150'
                  }
                  alt={p.title}
                />
              </div>
              <div className="product-body">
                <h3>{p.title}</h3>
                <p className="product-price">{p.price} ₽</p>
                <p className="product-category">
                  {p.category_name || 'Без категории'}
                </p>
              </div>
              <div className="product-actions">
                <Link to={`/products/${p.id}`} className="btn-link">
                  Открыть
                </Link>
                <button
                  className="btn-link danger"
                  onClick={() => handleRemove(p.id)}
                >
                  Удалить из избранного
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
