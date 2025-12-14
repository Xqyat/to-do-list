import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../api/productsApi';
import { addFavorite, removeFavorite } from '../../api/favoritesApi';
import './catalog.css';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await getProduct(id);
      setProduct(res.data);
    } catch (e) {
      console.error('Ошибка загрузки товара', e);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (fav) {
        await removeFavorite(id);
        setFav(false);
      } else {
        await addFavorite(id);
        setFav(true);
      }
    } catch (e) {
      console.error('Ошибка изменения избранного', e);
    }
  };

  if (!product) {
    return <div className="loading">Загрузка товара...</div>;
  }

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <div className="product-details-image">
          <img
            src={
              product.image
                ? `http://localhost:5000${product.image}`
                : 'https://via.placeholder.com/400x300'
            }
            alt={product.title}
          />
        </div>
        <div className="product-details-info">
          <h1>{product.title}</h1>
          <p className="product-details-price">{product.price} ₽</p>
          <p className="product-details-category">
            Категория: {product.category_name || 'Без категории'}
          </p>
          <p className="product-details-description">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
