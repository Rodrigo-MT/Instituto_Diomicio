import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiLock, FiUpload, FiImage, FiTrash2, FiEdit } from 'react-icons/fi';
import styles from '../layout/DashboardAdmin.module.css';
import api from '../../../../api';

const EventosAdmin = () => {
  const [eventos, setEventos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [eventoToDelete, setEventoToDelete] = useState(null);
  const [currentEvento, setCurrentEvento] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Carrega os eventos ao montar o componente
  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/events');
      setEventos(response.data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      alert('Erro ao carregar eventos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*')) {
        alert('Por favor, selecione um arquivo de imagem válido (JPEG, PNG)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentEvento({
          ...currentEvento,
          imagem: file,
          imagemUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
      
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleEditClick = (evento) => {
    setCurrentEvento({ 
      ...evento,
      data: evento.date.split('.')[0], // Ajusta o formato da data para o input datetime-local
      local: evento.location,
      imagemUrl: evento.imagePath ? `${api.defaults.baseURL}/uploads/${evento.imagePath}` : ''
    });
    setIsEditing(true);
    setShowEventoModal(true);
  };

  const handleNewEvento = () => {
    setCurrentEvento({
      name: '',
      date: '',
      location: '',
      description: '',
      imagem: null,
      imagemUrl: ''
    });
    setIsEditing(false);
    setShowEventoModal(true);
  };

  const handleSaveEvento = async () => {
    if (!currentEvento.name || !currentEvento.date || !currentEvento.location) {
      alert('Preencha os campos obrigatórios: Nome, Data e Local');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', currentEvento.name);
      formData.append('date', currentEvento.date);
      formData.append('location', currentEvento.location);
      formData.append('description', currentEvento.description || '');

      if (currentEvento.imagem) {
        formData.append('image', currentEvento.imagem);
      }

      if (isEditing) {
        await api.put(`/events/${currentEvento.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/events', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      await fetchEventos();
      setShowEventoModal(false);
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert('Erro ao salvar evento');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/events/${eventoToDelete.id}`);
      await fetchEventos();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('Erro ao excluir evento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.eventosContainer}>
      {/* Cabeçalho */}
      <div className={styles.eventosHeader}>
        <h2 className={styles.sectionTitle}>Gestão de Eventos</h2>
        <button className={styles.addButton} onClick={handleNewEvento} disabled={isLoading}>
          {isLoading ? 'Carregando...' : '+ Novo Evento'}
        </button>
      </div>

      {/* Tabela de Eventos */}
      <div className={styles.eventosTable}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Evento</div>
          <div className={styles.headerCell}>Data</div>
          <div className={styles.headerCell}>Local</div>
          <div className={styles.headerCell}>Ações</div>
        </div>

        {isLoading && eventos.length === 0 ? (
          <div className={styles.loading}>Carregando eventos...</div>
        ) : (
          eventos.map((evento) => (
            <div key={evento.id} className={styles.tableRow}>
              <div className={styles.tableCell}>{evento.name}</div>
              <div className={styles.tableCell}>
                {new Date(evento.date).toLocaleDateString('pt-BR')} às{' '}
                {new Date(evento.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={styles.tableCell}>{evento.location}</div>
              <div className={styles.actionsCell}>
                <button 
                  className={styles.editButton} 
                  onClick={() => handleEditClick(evento)}
                  disabled={isLoading}
                >
                  <FiEdit /> Editar
                </button>
                <button 
                  className={styles.deleteButton} 
                  onClick={() => {
                    setEventoToDelete(evento);
                    setShowDeleteModal(true);
                  }}
                  disabled={isLoading}
                >
                  <FiTrash2 /> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmationModal}>
            <h3>Confirmar Exclusão</h3>
            <p>Você realmente deseja excluir o evento "{eventoToDelete?.name}"?</p>
            <div className={styles.modalButtons}>
              <button 
                className={styles.cancelButton} 
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                className={styles.confirmButton} 
                onClick={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Excluindo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição/Criação */}
      {showEventoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.eventoModal}>
            <button 
              className={styles.closeButton} 
              onClick={() => !isLoading && setShowEventoModal(false)}
              disabled={isLoading}
            >
              <FiX size={20} />
            </button>

            <h3>{isEditing ? 'Editar Evento' : 'Criar Evento'}</h3>

            {/* Upload de Imagem */}
            <div className={styles.imageUploadContainer}>
              <div 
                className={styles.imagePreview}
                onClick={!isLoading ? triggerFileInput : undefined}
                style={{ 
                  backgroundImage: currentEvento?.imagemUrl ? `url(${currentEvento.imagemUrl})` : 'none',
                  backgroundColor: currentEvento?.imagemUrl ? 'transparent' : 'var(--secondary-green)',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {!currentEvento?.imagemUrl && (
                  <div className={styles.uploadPlaceholder}>
                    <FiImage size={40} />
                    <span>Clique para adicionar uma imagem</span>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png"
                style={{ display: 'none' }}
                disabled={isLoading}
              />
              
              <div className={styles.uploadControls}>
                <button 
                  type="button"
                  className={styles.uploadButton}
                  onClick={triggerFileInput}
                  disabled={isLoading}
                >
                  <FiUpload /> {currentEvento?.imagemUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
                </button>
              </div>
            </div>

            {/* Formulário */}
            <div className={styles.formGroup}>
              <label>Nome do Evento *</label>
              <input
                type="text"
                value={currentEvento?.name || ''}
                onChange={(e) => setCurrentEvento({...currentEvento, name: e.target.value})}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Data e Hora *</label>
              <input
                type="datetime-local"
                value={currentEvento?.date || ''}
                onChange={(e) => setCurrentEvento({...currentEvento, date: e.target.value})}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Local *</label>
              <input
                type="text"
                value={currentEvento?.location || ''}
                onChange={(e) => setCurrentEvento({...currentEvento, location: e.target.value})}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Descrição</label>
              <textarea
                value={currentEvento?.description || ''}
                onChange={(e) => setCurrentEvento({...currentEvento, description: e.target.value})}
                rows="4"
                disabled={isLoading}
              />
            </div>

            <div className={styles.modalButtons}>
              <button 
                className={`${styles.createButton} ${isEditing ? styles.disabledButton : ''}`}
                disabled={isEditing || isLoading}
                title={isEditing ? "Modo edição ativado" : ""}
                onClick={handleNewEvento}
              >
                {isEditing && <FiLock className={styles.lockIcon} />}
                Limpar Evento
              </button>
              
              <button 
                className={styles.saveButton} 
                onClick={handleSaveEvento}
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventosAdmin;