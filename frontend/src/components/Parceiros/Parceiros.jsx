import React, { useRef, useEffect, useState } from 'react';
import styles from './Parceiros.module.css';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import api from '../../api';

const Parceiros = () => {
  const [parceiros, setParceiros] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchParceiros = async () => {
      try {
        const response = await api.get('/partners');
        setParceiros(response.data);
      } catch (error) {
        console.error('Erro ao buscar parceiros:', error);
      }
    };

    fetchParceiros();
  }, []);

  const containerRef = useRef(null);
  const triangleRef = useRef(null);

  useGSAP(() => {
    gsap.from(triangleRef.current, {
      duration: 1.5,
      clipPath: 'polygon(0 0, 0% 0, 0 0%)',
      ease: "power3.out"
    });
  }, { scope: containerRef });

  return (
    <main className={styles.pageContainer} ref={containerRef}>
      {/* Triângulo animado */}
      <div className={styles.greenTriangle} ref={triangleRef}></div>

      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Parceiros</h1>

        {/* Container principal com fundo diferenciado */}
        <div className={styles.mainContentBox}>
          <p className={styles.descricao}>
            Nossos parceiros são fundamentais para o sucesso de nossa instituição. Eles nos apoiam de diversas formas, 
            contribuindo para que possamos continuar nosso trabalho de transformação social através da educação. 
            Conheça essas organizações que acreditam em nossa missão.
          </p>

          <div className={styles.parceirosGrid}>
            {parceiros.map((parceiro) => (
              <div key={parceiro.id} className={styles.parceiroCard}>
                <a href={parceiro.site} target="_blank" rel="noopener noreferrer" className={styles.parceiroLink}>
                  <div className={styles.parceiroContent}>
                    <h3 className={styles.parceiroNome}>{parceiro.nome}</h3>
                    <img 
                      src={parceiro.logo} 
                      alt={`Logo ${parceiro.nome}`} 
                      className={styles.parceiroLogo}
                    />
                    <div className={styles.parceiroOverlay}>
                      <p className={styles.parceiroDescricao}>{parceiro.descricao}</p>
                      <span className={styles.parceiroLinkExterno}>
                        Visitar site <FaExternalLinkAlt />
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Parceiros;
