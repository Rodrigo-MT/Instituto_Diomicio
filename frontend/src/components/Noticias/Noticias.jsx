import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import styles from './Noticias.module.css';
import api from '../../api';

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await api.get('/notices');
        setNoticias(response.data);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setError('Erro ao carregar notícias. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchNoticias();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === noticias.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? noticias.length - 1 : prev - 1));
  };

  if (loading) {
    return <p>Carregando notícias...</p>;
  }

  if (error) {
    return (
      <section id="noticias" className={styles.noticiasSection}>
        <div id="noticiasMensagem" className={styles.noticiasMensagem}>
          <FiAlertCircle size={48} color="#233567" style={{ marginBottom: '1rem' }} />
          <p>{error}</p>
        </div>
      </section>
    );
  }
  
  if (noticias.length === 0) {
    return (
      <section id="noticias" className={styles.noticiasSection}>
        <div id="noticiasMensagem" className={styles.noticiasMensagem}>
          <FiAlertCircle size={48} color="#233567" style={{ marginBottom: '1rem' }} />
          <p>Nenhuma notícia disponível.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.noticiasSection} id="noticias">
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Notícias</h1>
      </div>

      <div className={styles.sliderContainer}>
        <button onClick={prevSlide} className={styles.navButton}>
          <FiChevronLeft size={32} />
        </button>

        <div className={styles.slideWrapper}>
          <div className={styles.slide}>
            <a
              href={noticias[currentSlide].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={noticias[currentSlide].image}
                alt={noticias[currentSlide].title}
                className={styles.noticiaImagem}
              />
              <div className={styles.overlay}>
                <h3 className={styles.titulo}>
                  {noticias[currentSlide].title}
                </h3>
                <p className={styles.fonte}>{noticias[currentSlide].source}</p>
              </div>
            </a>
          </div>
        </div>

        <button onClick={nextSlide} className={styles.navButton}>
          <FiChevronRight size={32} />
        </button>
      </div>

      <div className={styles.dotsContainer}>
        {noticias.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Noticias;
