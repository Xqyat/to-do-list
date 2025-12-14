import React, { useEffect, useState } from 'react';
import { getPublicSections } from '../../api/sectionsApi';
import './landing.css';

export default function LandingPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      const res = await getPublicSections();
      setSections(res.data);
    } catch (e) {
      console.error('Ошибка загрузки секций лендинга', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="landing-loading">Загрузка...</div>;
  }

  return (
    <div className="landing-container">
      {sections.map((sec) => (
        <SectionRenderer key={sec.id} section={sec} />
      ))}
    </div>
  );
}

function SectionRenderer({ section }) {
  const extra = section.extra ? safeParseJson(section.extra) : null;

  switch (section.type) {
    case 'hero':
      return (
        <section className="section-hero">
          {section.image && (
            <div className="hero-bg">
              <img src={`http://localhost:5000${section.image}`} alt="" />
            </div>
          )}
          <div className="hero-content">
            <h1>{section.title}</h1>
            {section.subtitle && <p>{section.subtitle}</p>}
          </div>
        </section>
      );
    case 'about':
      return (
        <section className="section-about">
          <div className="about-content">
            <h2>{section.title || 'О компании'}</h2>
            <p>{section.content}</p>
          </div>
          {section.image && (
            <div className="about-image">
              <img src={`http://localhost:5000${section.image}`} alt="" />
            </div>
          )}
        </section>
      );
    case 'services':
      return (
        <section className="section-services">
          <h2>{section.title || 'Наши услуги'}</h2>
          <div className="services-grid">
            {Array.isArray(extra?.items) &&
              extra.items.map((item, idx) => (
                <div key={idx} className="service-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.price && (
                    <p className="service-price">{item.price} ₽</p>
                  )}
                </div>
              ))}
          </div>
        </section>
      );
    case 'testimonials':
      return (
        <section className="section-testimonials">
          <h2>{section.title || 'Отзывы клиентов'}</h2>
          <div className="testimonials-grid">
            {Array.isArray(extra?.items) &&
              extra.items.map((item, idx) => (
                <div key={idx} className="testimonial-card">
                  {item.photo && (
                    <div className="testimonial-photo">
                      <img
                        src={`http://localhost:5000${item.photo}`}
                        alt={item.name}
                      />
                    </div>
                  )}
                  <p className="testimonial-text">“{item.text}”</p>
                  <p className="testimonial-name">{item.name}</p>
                </div>
              ))}
          </div>
        </section>
      );
    case 'contacts':
      return (
        <section className="section-contacts">
          <h2>{section.title || 'Контакты'}</h2>
          <p>{section.content}</p>
          {extra?.address && <p><strong>Адрес:</strong> {extra.address}</p>}
          {extra?.phone && <p><strong>Телефон:</strong> {extra.phone}</p>}
          {extra?.email && <p><strong>Email:</strong> {extra.email}</p>}
          {extra?.mapUrl && (
            <p>
              <a href={extra.mapUrl} target="_blank" rel="noreferrer">
                Открыть карту
              </a>
            </p>
          )}
        </section>
      );
    default:
      return (
        <section className="section-generic">
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      );
  }
}

function safeParseJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
