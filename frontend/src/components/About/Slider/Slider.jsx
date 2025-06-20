import React, { useState, useCallback, useEffect } from 'react';
import { FiX, FiMaximize2 } from 'react-icons/fi';
import styles from './Slider.module.css';

// Importe todas as suas imagens (ajuste os caminhos conforme necessário)
import img1 from '../../../assets/images/Entrada.jpeg';
import img2 from '../../../assets/images/Atividade Física1.jpeg';
import img3 from '../../../assets/images/Atividade Física2.jpeg';
import img4 from '../../../assets/images/Atividade Física3.jpeg';
import img5 from '../../../assets/images/Clube de Mães.jpeg';
import img6 from '../../../assets/images/W1.jpeg';
import img7 from '../../../assets/images/W2.jpeg';
import img8 from '../../../assets/images/W3.jpeg';
import img9 from '../../../assets/images/W4.jpeg';
import img10 from '../../../assets/images/W5.jpeg';
import img11 from '../../../assets/images/W6.jpeg';
import img12 from '../../../assets/images/W7.jpeg';
import img13 from '../../../assets/images/W8.jpeg';
import img14 from '../../../assets/images/W9.jpeg';
import img15 from '../../../assets/images/W10.jpeg';
import img16 from '../../../assets/images/W11.jpeg';
import img17 from '../../../assets/images/W12.jpeg';
import img18 from '../../../assets/images/W13.jpeg';
import img19 from '../../../assets/images/W14.jpeg';
import img20 from '../../../assets/images/W15.jpeg';
import img21 from '../../../assets/images/W16.jpeg';
import img22 from '../../../assets/images/W17.jpeg';
import img23 from '../../../assets/images/W18.jpeg';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const slides = [
    img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
    img11, img12, img13, img14, img15, img16, img17, img18, img19,
    img20, img21, img22, img23
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <>
      {/* Slider Principal */}
      <div className={styles.slider}>
        <div 
          className={styles.slides} 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div className={styles.slide} key={index}>
              <img 
                src={slide} 
                alt={`Slide ${index + 1}`} 
                className={styles.slideImage}
                onClick={toggleExpand}
              />
            </div>
          ))}
        </div>
        
        <button className={styles.prev} onClick={prevSlide}>&#10094;</button>
        <button className={styles.next} onClick={nextSlide}>&#10095;</button>
        
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        
        <button 
          className={styles.expandButton}
          onClick={toggleExpand}
          aria-label="Ampliar"
        >
          <FiMaximize2 size={16} />
        </button>
      </div>

      {/* Lightbox */}
      {isExpanded && (
        <div className={styles.lightbox}>
          <button 
            className={styles.closeButton}
            onClick={toggleExpand}
            aria-label="Fechar"
          >
            <FiX size={24} />
          </button>
          
          <div className={styles.lightboxContent}>
            <button className={styles.lightboxPrev} onClick={prevSlide}>&#10094;</button>
            <img 
              src={slides[currentSlide]} 
              alt={`Slide ampliado ${currentSlide + 1}`} 
              className={styles.lightboxImage}
            />
            <button className={styles.lightboxNext} onClick={nextSlide}>&#10095;</button>
          </div>
          
          <div className={styles.lightboxDots}>
            {slides.map((_, index) => (
              <div
                key={index}
                className={`${styles.lightboxDot} ${index === currentSlide ? styles.active : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Slider;