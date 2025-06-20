import React from 'react';
import styles from './Maps.module.css';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

const Maps = () => {
  return (
    <section className={styles.mapsSection}>
      <h1 className={styles.title}>Onde Estamos</h1>

      <div className={styles.mapContainer}>
        <iframe
          title="Localização do Instituto de Educação Especial Diomício Freitas"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7000.425588913325!2d-49.3790712!3d-28.6832805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952182627b77a52f%3A0xbcf265032e5fe46b!2sInstituto%20de%20Educa%C3%A7%C3%A3o%20Especial%20Diom%C3%ADcio%20Freitas!5e0!3m2!1spt-BR!2sbr!4v1750096288189!5m2!1spt-BR!2sbr"
          width="600"
          height="450"
          style={{ border: "0" }} // ✅ CORRETO: objeto JS, não string pura
          allowFullScreen // ✅ CORRETO: em camelCase
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade" // ✅ CORRETO: camelCase
          className={styles.mapIframe}
        />
      </div>

      <div className={styles.address}>
        <FaMapMarkerAlt className={styles.icon} />
        <p>Rua Lúcia Milioli, 211 - Santa Bárbara CEP: 88802-020</p>
        <a
          href="https://maps.google.com?q=Instituto+de+Educação+Especial+Diomício+Freitas"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.externalLink}
        >
          Abrir no Google Maps <FaExternalLinkAlt />
        </a>
      </div>
    </section>
  );
};

export default Maps;