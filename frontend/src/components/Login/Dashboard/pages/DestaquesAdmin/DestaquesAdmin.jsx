import React, { useEffect, useState } from 'react';
import styles from '../DestaquesAdmin/DestaquesAdmin.module.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../../api';

const DestaquesAdmin = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit' ou 'delete'
  const [currentNotice, setCurrentNotice] = useState(null);
  const [form, setForm] = useState({
    title: '',
    image: '',
    link: '',
    source: ''
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notices');
      setNotices(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
      toast.error('Falha ao carregar notícias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.title.trim() || !form.link.trim()) {
      toast.error('Título e link são obrigatórios.');
      return;
    }
  
    try {
      if (modalType === 'edit') {
        await api.put(`/notices/${currentNotice.id}`, form);
        toast.success('Notícia atualizada com sucesso!');
      } else {
        await api.post('/notices', form);
        toast.success('Notícia adicionada com sucesso!');
      }
      
      setIsModalOpen(false);
      await fetchNotices();
    } catch (err) {
      console.error('Erro ao salvar notícia:', err);
      toast.error(err.response?.data?.message || err.message || 'Erro ao salvar notícia');
    }
  };

  const openAddModal = () => {
    setForm({
      title: '',
      image: '',
      link: '',
      source: ''
    });
    setModalType('add');
    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setCurrentNotice(notice);
    setForm({
      title: notice.title,
      image: notice.image || '',
      link: notice.link,
      source: notice.source || ''
    });
    setModalType('edit');
    setIsModalOpen(true);
  };

  const openDeleteModal = (notice) => {
    setCurrentNotice(notice);
    setModalType('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/notices/${currentNotice.id}`);
      toast.success('Notícia excluída com sucesso!');
      setIsModalOpen(false);
      await fetchNotices();
    } catch (err) {
      toast.error(err.message || 'Erro ao excluir notícia');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    // Otimistic update - atualiza a UI primeiro
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
      // CORREÇÃO: Usando o mesmo endpoint e estrutura da versão que funcionava
      const reorderPayload = {
        notices: updatedNotices.map((notice, index) => ({
          id: notice.id,
          newOrder: index + 1,  // Mudança chave: usando 'newOrder' em vez de 'order'
        })),
      };
  
      // CORREÇÃO: Endpoint correto conforme versão antiga
      await api.put('/notices', reorderPayload);  // Endpoint diferente do atual
      toast.success('Ordem das notícias atualizada com sucesso!');
    } catch (err) {
      toast.error(err.message || 'Erro ao reordenar notícias');
      // Restaura o estado anterior em caso de erro
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
      await api.post('/notices/seed');
      await fetchNotices();
      toast.success('Notícias pré-definidas geradas com sucesso!');
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
          title={hasPredefined ? 'Já existem notícias pré-definidas' : ''}
        >
          {generating ? 'Gerando...' : 'Gerar Notícias Pré-definidas'}
        </button>

        <button
          onClick={openAddModal}
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
          Arraste e solte para reordenar as notícias
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
                            className={`${styles.button} ${styles.editButton}`}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => openDeleteModal(notice)}
                            className={`${styles.button} ${styles.deleteButton}`}
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

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {modalType === 'delete' ? (
              <>
                <div className={styles.modalHeader}>
                  <h3 className={styles.modalTitle}>Confirmar Exclusão</h3>
                  <button
                    className={styles.closeButton}
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>

                <p>Tem certeza que deseja excluir a notícia "{currentNotice.title}"?</p>
                
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
                <div className={styles.modalHeader}>
                  <h3 className={styles.modalTitle}>
                    {modalType === 'edit' ? 'Editar Notícia' : 'Adicionar Notícia'}
                  </h3>
                  <button
                    className={styles.closeButton}
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
                      placeholder="https://exemplo.com/imagem.jpg"
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
                      placeholder="https://exemplo.com/noticia"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Fonte</label>
                    <input
                      type="text"
                      name="source"
                      value={form.source}
                      onChange={handleChange}
                      placeholder="Nome do jornal/site"
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
                      {modalType === 'edit' ? 'Atualizar' : 'Adicionar'}
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