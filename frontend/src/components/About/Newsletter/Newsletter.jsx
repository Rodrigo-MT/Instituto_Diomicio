import React, { useState } from 'react';
import styles from './Newsletter.module.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Erro ao inscrever.');
        return;
      }
  
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
      console.error(error);
    }
  };

  return (
    <section className={styles.newsletterSection}>
      {/* Onda decorativa no topo */}
      <div className={styles.waveTop}></div>
      
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            <span className={styles.titleHighlight}>Junte-se à nossa comunidade</span>
          </h2>
          <p className={styles.description}>
            Receba atualizações exclusivas, histórias inspiradoras e oportunidades 
            de fazer a diferença diretamente no seu e-mail.
          </p>

          {isSubscribed ? (
            <div className={styles.successMessage}>
              <svg className={styles.checkIcon} viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Inscrição confirmada! Verifique sua caixa de entrada.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  className={styles.input}
                  required
                />
                <svg className={styles.emailIcon} viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <button type="submit" className={styles.button}>
                Assinar Agora
                <svg className={styles.arrowIcon} viewBox="0 0 24 24">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;