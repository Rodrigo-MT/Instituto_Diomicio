import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTimes } from 'react-icons/fa';
import styles from './Eventos.module.css';
import api from '../../api';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEventos();
  }, []);

  const containerRef = useRef(null);
  const triangleRef = useRef(null);
  const modalRef = useRef(null);

  useGSAP(() => {
    gsap.from(triangleRef.current, {
      duration: 1.5,
      clipPath: 'polygon(0 0, 0% 0, 0 0%)',
      ease: "power3.out"
    });
  }, { scope: containerRef });

  const fetchEventos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/events');

      const eventosFormatados = response.data.map(evento => ({
        ...evento,
        nome: evento.name,
        local: evento.location,
        descricao: evento.description,
        imagemUrl: evento.imagePath
          ? `${api.defaults.baseURL}${evento.imagePath}`
          : '/placeholder-eventos.jpg',
        dataHora: new Date(evento.date)
      }));

      eventosFormatados.sort((a, b) => b.dataHora - a.dataHora);
      setEventos(eventosFormatados);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      setError({
        message: err.message || 'Erro ao carregar eventos',
        status: err.status
      });
    } finally {
      setIsLoading(false);
    }
  };


  const formatarData = (data) => {
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    };
    return data.toLocaleDateString('pt-BR', options);
  };

  const formatarHora = (data) => {
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  };

  const handleOpenModal = (evento) => {
    setSelectedEvento(evento);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const eventosAtivos = eventos.filter(evento => {
    const hoje = new Date();
    const seteDiasAtras = new Date(hoje.setDate(hoje.getDate() - 7));
    return evento.dataHora >= seteDiasAtras;
  });

  return (
    <main className={styles.pageContainer} ref={containerRef}>
      <div className={styles.greenTriangle} ref={triangleRef}></div>

      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Eventos</h1>

        <div className={styles.mainContentBox}>
          <p className={styles.descricao}>
            Confira nossos próximos eventos e participe das atividades que transformam vidas.
            Junte-se a nós nessa jornada de educação e desenvolvimento comunitário.
          </p>

          {error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>
                Ocorreu um erro ao carregar os eventos: {error.message}
              </p>
              <button
                onClick={fetchEventos}
                className={styles.retryButton}
              >
                Tentar novamente
              </button>
            </div>
          ) : isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Carregando eventos...</p>
            </div>
          ) : eventosAtivos.length === 0 ? (
            <div className={styles.noEventsMessage}>
              <p>Não há eventos programados no momento.</p>
              <p>Fique atento para nossas próximas atividades!</p>
            </div>
          ) : (
            <div className={styles.eventosGrid}>
              {eventosAtivos.map((evento) => (
                <div key={evento.id} className={styles.eventoCard}>
                  <div className={styles.eventoImagemContainer}>
                    <img
                      src={evento.imagemUrl}
                      alt={`Imagem do evento ${evento.nome}`}
                      className={styles.eventoImagem}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-eventos.jpg';
                      }}
                    />
                  </div>

                  <div className={styles.eventoInfo}>
                    <h3 className={styles.eventoTitulo}>{evento.nome}</h3>

                    <div className={styles.eventoMeta}>
                      <div className={styles.metaItem}>
                        <FaCalendarAlt className={styles.metaIcon} />
                        <span>{formatarData(evento.dataHora)}</span>
                      </div>

                      <div className={styles.metaItem}>
                        <FaClock className={styles.metaIcon} />
                        <span>{formatarHora(evento.dataHora)}</span>
                      </div>

                      <div className={styles.metaItem}>
                        <FaMapMarkerAlt className={styles.metaIcon} />
                        <span>{evento.local}</span>
                      </div>
                    </div>

                    <p className={styles.eventoDescricao}>
                      {evento.descricao
                        ? `${evento.descricao.substring(0, 100)}${evento.descricao.length > 100 ? '...' : ''}`
                        : 'Descrição não disponível.'}
                    </p>

                    <button
                      className={styles.eventoBotao}
                      onClick={() => handleOpenModal(evento)}
                    >
                      Mais Informações
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedEvento && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            <button
              className={styles.modalCloseButton}
              onClick={handleCloseModal}
            >
              <FaTimes />
            </button>

            <div className={styles.modalImagemContainer}>
              <img
                src={selectedEvento.imagemUrl}
                alt={`Imagem do evento ${selectedEvento.nome}`}
                className={styles.modalImagem}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-eventos.jpg';
                }}
              />
            </div>

            <div className={styles.modalInfo}>
              <h2 className={styles.modalTitulo}>{selectedEvento.nome}</h2>

              <div className={styles.modalMeta}>
                <div className={styles.metaItem}>
                  <FaCalendarAlt className={styles.metaIcon} />
                  <span>{formatarData(selectedEvento.dataHora)}</span>
                </div>

                <div className={styles.metaItem}>
                  <FaClock className={styles.metaIcon} />
                  <span>{formatarHora(selectedEvento.dataHora)}</span>
                </div>

                <div className={styles.metaItem}>
                  <FaMapMarkerAlt className={styles.metaIcon} />
                  <span>{selectedEvento.local}</span>
                </div>
              </div>

              <div className={styles.modalDescricaoContainer}>
                <h3 className={styles.modalDescricaoTitulo}>Descrição:</h3>
                <p className={styles.modalDescricao}>
                  {selectedEvento.descricao || 'Este evento não possui descrição detalhada.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Eventos;