import React, { useEffect, useState } from 'react';
import styles from '../layout/DashboardAdmin.module.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../api';

const DestaquesAdmin = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [form, setForm] = useState({
    id: null,
    title: '',
    image: '',
    link: '',
    source: '',
  });
  const [setShowReloadMessage] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notices');
      setNotices(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.title.trim() || !form.link.trim()) {
      toast.error('Título e link são obrigatórios.');
      return;
    }
  
    const payload = {
      title: form.title,
      image: form.image,
      link: form.link,
      source: form.source,
    };
  
    console.log('Enviando payload:', payload);
  
    try {
      let response;
      if (form.id) {
        response = await api.put(`/notices/${form.id}`, payload);
      } else {
        response = await api.post('/notices', payload);
      }
      console.log('Resposta da API:', response.data);
  
      setForm({ id: null, title: '', image: '', link: '', source: '' });
      setIsModalOpen(false);
      await fetchNotices();
      toast.success('Notícia salva com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar notícia:', err);
      const message = err.response?.data?.message || err.message || 'Erro ao salvar notícia';
      toast.error(message);
    }
  };
  

  const openEditModal = (notice = null) => {
    if (notice) {
      setForm({
        id: notice.id,
        title: notice.title,
        image: notice.image || '',
        link: notice.link,
        source: notice.source || '',
      });
    } else {
      setForm({ id: null, title: '', image: '', link: '', source: '' });
    }
    setIsModalOpen(true);
    setNoticeToDelete(null);
  };

  const requestDelete = (notice) => {
    setNoticeToDelete(notice);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!noticeToDelete) return;

    try {
      await api.delete(`/notices/${noticeToDelete.id}`);
      fetchNotices();
      toast.success('Notícia excluída com sucesso!');
      setIsModalOpen(false);
      setNoticeToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir notícia');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(notices);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedNotices = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    setNotices(updatedNotices);

    try {
      setReordering(true);
      const reorderPayload = {
        notices: updatedNotices.map((notice, index) => ({
          id: notice.id,
          newOrder: index + 1,
        })),
      };

      await api.put('/notices', reorderPayload);
      toast.success('Ordem das notícias atualizada com sucesso!');
    } catch (err) {
      toast.error(err.message || 'Erro ao reordenar notícias');
      fetchNotices();
    } finally {
      setReordering(false);
    }
  };

  const hasPredefined = notices.some((n) => n.predefined === true);

  const handleGenerateSeed = async () => {
    if (!window.confirm('Gerar notícias pré-definidas? Isso não pode ser desfeito.')) return;
    try {
      setGenerating(true);
      const response = await api.post('/notices/seed', {
      });

      await new Promise(resolve => setTimeout(resolve, 200));
      await fetchNotices();

      toast.success(`Notícias pré-definidas geradas: ${response.data.length}`);
      setShowReloadMessage(true);
      alert('Notícias pré-definidas geradas com sucesso! Por favor, recarregue a página para ver as atualizações.');
    } catch (err) {
      toast.error(err.message || 'Erro ao gerar notícias');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={styles.contentContainer}>
      <h2 className={styles.sectionTitle}>Destaques do Site</h2>
      <div className={styles.actionsContainer}>
        <button
          onClick={handleGenerateSeed}
          disabled={hasPredefined || generating}
          className={`${styles.button} ${styles.generateButton}`}
          title={hasPredefined ? 'Já existem notícias pré-definidas no banco' : ''}
        >
          {generating ? 'Gerando...' : 'Gerar Notícias Pré-definidas'}
        </button>

        <button
          onClick={() => openEditModal()}
          className={styles.primaryButton}
        >
          Adicionar Notícia
        </button>
      </div>

      {loading && <div className={styles.loading}>Carregando notícias...</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.noticesContainer}>
        <h3 className={styles.sectionTitle}>Lista de Destaques ({notices.length})</h3>
        <p className={styles.instructions}>
          Arraste e solte para reordenar as notícias (a primeira será o destaque principal)
        </p>

        {notices.length === 0 && !loading && (
          <div className={styles.emptyState}>Nenhuma notícia cadastrada.</div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="notices">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={styles.noticesList}
              >
                {notices.map((notice, index) => (
                  <Draggable
                    key={notice.id}
                    draggableId={notice.id.toString()}
                    index={index}
                    isDragDisabled={reordering}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${styles.noticeCard} ${notice.predefined ? styles.predefined : ''}`}
                      >
                        <div className={styles.noticeHeader}>
                          <span className={styles.noticeOrder}>#{notice.order}</span>
                          <h4>{notice.title}</h4>
                        </div>

                        {notice.image && (
                          <div className={styles.noticeImage}>
                            <img
                              src={notice.image}
                              alt={notice.title}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className={styles.noticeMeta}>
                          <p>
                            <strong>Link:</strong>{' '}
                            <a href={notice.link} target="_blank" rel="noopener noreferrer">
                              Ver notícia
                            </a>
                          </p>
                          <p><strong>Fonte:</strong> {notice.source || 'Não informada'}</p>
                          <p className={notice.predefined ? styles.predefinedBadge : styles.manualBadge}>
                            {notice.predefined ? 'Pré-definida' : 'Manual'}
                          </p>
                        </div>

                        <div className={styles.noticeActions}>
                          <button
                            onClick={() => openEditModal(notice)}
                            className={styles.editButton}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => requestDelete(notice)}
                            className={styles.deleteButton}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {isModalOpen && (
        <div className={styles.editModalOverlay}>
          <div className={styles.editModal}>
            {noticeToDelete ? (
              <>
                <div className={styles.editModalHeader}>
                  <h3 className={styles.editModalTitle}>Confirmar Exclusão</h3>
                  <button
                    className={styles.editModalClose}
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>

                <p>Tem certeza que deseja excluir a notícia "{noticeToDelete.title}"?</p>
                <p>Esta ação não pode ser desfeita.</p>

                <div className={styles.modalActions}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className={styles.dangerButton}
                    onClick={confirmDelete}
                  >
                    Confirmar Exclusão
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.editModalHeader}>
                  <h3 className={styles.editModalTitle}>
                    {form.id ? 'Editar Notícia' : 'Adicionar Notícia'}
                  </h3>
                  <button
                    className={styles.editModalClose}
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label>Título *</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>URL da Imagem</label>
                    <input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Link da Notícia *</label>
                    <input
                      type="url"
                      name="link"
                      value={form.link}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Fonte</label>
                    <input
                      type="text"
                      name="source"
                      value={form.source}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={styles.primaryButton}
                    >
                      {form.id ? 'Atualizar' : 'Adicionar'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DestaquesAdmin;