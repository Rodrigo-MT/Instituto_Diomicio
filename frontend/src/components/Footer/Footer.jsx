import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import styles from './Footer.module.css';
import logo from '../../assets/images/logo.png'; // Ajuste o caminho conforme sua estrutura

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Seção Superior (Logo + Links Rápidos) */}
        <div className={styles.topSection}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="Logo Instituto Diomício Freitas" className={styles.logo} />
          </div>

          <div className={styles.linksSection}>
            <h3 className={styles.linksTitle}>Navegação</h3>
            <ul className={styles.linksList}>
              <li>
                <Link to="/eventos" className={styles.link}>Eventos</Link>
              </li>
              <li>
                <Link to="/parceiros" className={styles.link}>Parceiros</Link>
              </li>
              <li>
                <Link to="/apoie-nos" className={styles.link}>Apoie-nos</Link>
              </li>
            </ul>
          </div>

          <div className={styles.contactSection}>
            <h3 className={styles.contactTitle}>Contato</h3>
            <ul className={styles.contactList}>
              <li>
                <FiPhone className={styles.contactIcon} />
                <span>(48) 3433-8235</span>
              </li>
              <li>
                <FiPhone className={styles.contactIcon} />
                <span>(48) 99838-4125</span>
              </li>
              <li>
                <FiMail className={styles.contactIcon} />
                <span>institutoeduc.especialdf@gmail.com</span>
              </li>
              <li>
                <FiMapPin className={styles.contactIcon} />
                <span>Rua Lúcia Milioli, 211 - Santa Bárbara</span>
              </li>
              <li>
                <span>CEP: 88802-020</span>
              </li>
              <li>
                <span>CNPJ: 75.567.081/0001-05</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Seção Inferior (Redes Sociais + Créditos) */}
        <div className={styles.bottomSection}>
          <a 
            href="https://www.instagram.com/ieediomicio/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <FiInstagram size={24} />
            @ieediomicio
          </a>

          <div className={styles.credits}>
            <p>© {new Date().getFullYear()} Instituto Diomício Freitas</p>
            <p>Desenvolvido com ❤️ por [Rodrigo,Asaph, Aleph em Projeto Extensão/Esucri]</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;