import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import styles from '../layout/DashboardAdmin.module.css';
import api from '../../../../api';

const apiBase = '/partners';

const ParceirosAdmin = () => {
  const [parceiros, setParceiros] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    logo: '',
    descricao: '',
    site: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [parceiroToDelete, setParceiroToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchParceiros = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(apiBase);
      setParceiros(response.data);
    } catch (error) {
      alert('Erro ao carregar parceiros');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParceiros();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (editMode) {
        response = await api.patch(`${apiBase}/${formData.id}`, formData);
      } else {
        response = await api.post(apiBase, formData);
      }

      if (!response || response.status < 200 || response.status >= 300) {
        throw new Error('Erro ao salvar parceiro');
      }

      setShowModal(false);
      setEditMode(false);
      setFormData({ id: null, nome: '', logo: '', descricao: '', site: '' });
      await fetchParceiros();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar parceiro: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (parceiro) => {
    setFormData(parceiro);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteClick = (parceiro) => {
    setParceiroToDelete(parceiro);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!parceiroToDelete) return;

    try {
      setIsLoading(true);
      const res = await api.delete(`${apiBase}/${parceiroToDelete.id}`);
      if (!res || res.status < 200 || res.status >= 300) {
        throw new Error('Erro ao excluir parceiro');
      }
      await fetchParceiros();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao excluir parceiro:', error);
      alert('Erro ao excluir parceiro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.produtosContainer}>
      <div className={styles.produtosHeader}>
        <h2 className={styles.sectionTitle}>Gestão de Parceiros</h2>
        <button 
          className={styles.addButton} 
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setFormData({ id: null, nome: '', logo: '', descricao: '', site: '' });
          }}
          disabled={isLoading}
        >
          <FiPlus /> {isLoading ? 'Carregando...' : 'Novo Parceiro'}
        </button>
      </div>

      {isLoading && parceiros.length === 0 ? (
        <div className={styles.loading}>Carregando parceiros...</div>
      ) : (
        <div className={styles.produtosGrid}>
          {parceiros.map(parceiro => (
            <div className={styles.produtoCard} key={parceiro.id}>
              <div className={styles.produtoImagemContainer}>
                <img
                  src={parceiro.logo}
                  alt={parceiro.nome}
                  className={styles.produtoImagem}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Sem+Imagem'; }}
                />
              </div>
              <div className={styles.produtoInfo}>
                <h3 className={styles.produtoNome}>{parceiro.nome}</h3>
                <p className={styles.produtoDescricao}>{parceiro.descricao}</p>
                <p><a href={parceiro.site} target="_blank" rel="noreferrer">{parceiro.site}</a></p>
                <div className={styles.produtoActions}>
                  <button 
                    className={styles.editButton} 
                    onClick={() => handleEdit(parceiro)}
                    disabled={isLoading}
                  >
                    <FiEdit /> Editar
                  </button>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleDeleteClick(parceiro)}
                    disabled={isLoading}
                  >
                    <FiTrash2 /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.eventoModal}>
            <button
              className={styles.closeButton}
              onClick={() => {
                setShowModal(false);
                setEditMode(false);
                setFormData({ id: null, nome: '', logo: '', descricao: '', site: '' });
              }}
              disabled={isLoading}
            >
              <FiX size={20} />
            </button>

            <h3>{editMode ? 'Editar Parceiro' : 'Criar Parceiro'}</h3>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nome *</label>
                <input 
                  type="text" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label>URL do Logo *</label>
                <input 
                  type="url" 
                  name="logo" 
                  value={formData.logo} 
                  onChange={handleChange} 
                  required 
                  disabled={isLoading}
                  placeholder="https://exemplo.com/logo.png"
                />
                {formData.logo && (
                  <img
                    src={formData.logo}
                    alt="Preview logo"
                    style={{ marginTop: 8, maxHeight: 100, objectFit: 'contain' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Descrição *</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Site</label>
                <input
                  type="url"
                  name="site"
                  value={formData.site}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="https://exemplo.com"
                />
              </div>

              <div className={styles.modalButtons}>
                <button 
                  className={styles.saveButton} 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : 'Salvar Parceiro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmationModal}>
            <h3>Confirmar Exclusão</h3>
            <p>Você realmente deseja excluir o parceiro "{parceiroToDelete?.nome}"?</p>
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
                onClick={handleConfirmDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Excluindo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ParceirosAdmin;
