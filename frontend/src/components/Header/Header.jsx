import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/images/logo_header.png';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Header = () => {
  useGSAP(() => {
    // Animação do background (vindo da esquerda)
    gsap.from(`.${styles.header}`, {
      duration: 1,
      x: '-100%',
      ease: "power3.inOut",
    });
  });


  // Função para rolar até a seção "About"
  const scrollToAbout = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNoticias = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
  
      // Primeiro tenta achar a mensagem de erro/vazio (caso exista)
      const mensagem = document.getElementById('noticiasMensagem');
  
      if (mensagem) {
        mensagem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
  
      // Se não tiver mensagem, rola para a seção noticias normalmente
      const noticiasSection = document.getElementById('noticias');
      if (noticiasSection) {
        noticiasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.containerFluid}>
        <div className={styles.row}>
          <div className={styles.headerInner}>
            <div className={styles.logo}>
              <img src={logo} alt="Logo" width="50" />
            </div>
            <div className={styles.navigation}>
              <nav>
                <ul className={styles.navList}>
                  <li className={styles.navItem}>
                    <Link to="/#about" className={styles.navLink} onClick={scrollToAbout}>Sobre</Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link to="/#news" className={styles.navLink} onClick={scrollToNoticias}>Notícias</Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link to="/eventos" className={styles.navLink}>Eventos</Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link to="/parceiros" className={styles.navLink}>Parceiros</Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link to="/apoie-nos" className={styles.navLink}>Apoie-nos</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className={styles.navLogins}>
              <div className={styles.login}>
                <Link to="/login" className={styles.loginLink}>Entrar</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;