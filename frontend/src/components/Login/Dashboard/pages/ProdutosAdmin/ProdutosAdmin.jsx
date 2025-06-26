import React, { useEffect, useState, useRef } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiUpload, FiImage, FiTrash } from 'react-icons/fi';
import styles from './ProdutosAdmin.module.css';
import api from '../../../../../api';

const apiBase = '/products'; // já que baseURL está no axios, só o endpoint aqui

const ProdutosAdmin = () => {
  const [produtos, setProdutos] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    imagem: null,
    imagemUrl: '',
    nome: '',
    preco: '',
    descricao: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProdutos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(apiBase);
      const data = response.data;
  
      const produtosComImagem = data.map(produto => ({
        ...produto,
        imagem: produto.imagem?.startsWith('/uploads')
          ? `http://localhost:3000${produto.imagem}`
          : produto.imagem
      }));
  
      setProdutos(produtosComImagem);
    } catch (error) {
      alert('Erro ao carregar produtos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

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
        setFormData((prev) => ({
          ...prev,
          imagem: file,
          imagemUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
      
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      imagem: null,
      imagemUrl: ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('preco', formData.preco);
      formDataToSend.append('descricao', formData.descricao);
      
      if (formData.imagem) {
        if (formData.imagem instanceof File) {
          formDataToSend.append('imagem', formData.imagem);
        } else if (typeof formData.imagem === 'string') {
          formDataToSend.append('imagemUrl', formData.imagem);
        }
      }

      let response;
      if (editMode) {
        response = await api.patch(`${apiBase}/${formData.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post(apiBase, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (!response || response.status < 200 || response.status >= 300) {
        throw new Error('Erro ao salvar produto');
      }

      setShowModal(false);
      setEditMode(false);
      setFormData({ id: null, imagem: null, imagemUrl: '', nome: '', preco: '', descricao: '' });
      await fetchProdutos();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar produto: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (produto) => {
    setFormData({ 
      ...produto,
      imagemUrl: produto.imagem?.startsWith('/uploads')
        ? `http://localhost:3000${produto.imagem}`
        : produto.imagem
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteClick = (produto) => {
    setProdutoToDelete(produto);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!produtoToDelete) return;
    
    try {
      setIsLoading(true);
      const res = await api.delete(`${apiBase}/${produtoToDelete.id}`);
      if (!res || res.status < 200 || res.status >= 300) {
        throw new Error('Erro ao excluir produto');
      }
      await fetchProdutos();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.produtosContainer}>
      {/* Cabeçalho */}
      <div className={styles.produtosHeader}>
        <h2 className={styles.sectionTitle}>Gestão de Produtos</h2>
        <button 
          className={styles.addButton} 
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setFormData({ id: null, imagem: null, imagemUrl: '', nome: '', preco: '', descricao: '' });
          }}
          disabled={isLoading}
        >
          <FiPlus /> {isLoading ? 'Carregando...' : 'Novo Produto'}
        </button>
      </div>

      {/* Grid de Produtos */}
      {isLoading && produtos.length === 0 ? (
        <div className={styles.loading}>Carregando produtos...</div>
      ) : (
        <div className={styles.produtosGrid}>
          {produtos.map((produto) => (
            <div className={styles.produtoCard} key={produto.id}>
              <div className={styles.produtoImagemContainer}>
                <img 
                  src={produto.imagem} 
                  alt={produto.nome} 
                  className={styles.produtoImagem} 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Sem+Imagem';
                  }}
                />
              </div>
              <div className={styles.produtoInfo}>
                <h3 className={styles.produtoNome}>{produto.nome}</h3>
                <p className={styles.produtoPreco}>
                  <span className={styles.precoLabel}>Preço:</span> 
                  R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                </p>
                <p className={styles.produtoDescricao}>{produto.descricao}</p>
                <div className={styles.produtoActions}>
                  <button 
                    className={styles.editButton} 
                    onClick={() => handleEdit(produto)}
                    disabled={isLoading}
                  >
                    <FiEdit /> Editar
                  </button>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleDeleteClick(produto)}
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

      {/* Modal de Edição/Criação */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.eventoModal} ${styles.produtoModal}`}>
            <button
              className={styles.closeButton}
              onClick={() => {
                setShowModal(false);
                setEditMode(false);
                setFormData({ id: null, imagem: null, imagemUrl: '', nome: '', preco: '', descricao: '' });
              }}
              disabled={isLoading}
            >
              <FiX size={20} />
            </button>

            <h3>{editMode ? 'Editar Produto' : 'Criar Produto'}</h3>

            {/* Área de Upload de Imagem */}
            <div className={styles.imageUploadContainer}>
              <div 
                className={styles.imagePreview}
                onClick={!isLoading ? triggerFileInput : undefined}
                style={{ 
                  backgroundImage: formData.imagemUrl ? `url(${formData.imagemUrl})` : 'none',
                  backgroundColor: formData.imagemUrl ? 'transparent' : 'var(--secondary-green)',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {!formData.imagemUrl && (
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
                  <FiUpload /> {formData.imagemUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
                </button>
                
                {formData.imagemUrl && (
                  <button 
                    type="button"
                    className={styles.removeImageButton}
                    onClick={removeImage}
                    disabled={isLoading}
                  >
                    <FiTrash /> Remover
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nome do Produto *</label>
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
                <label>Preço *</label>
                <input
                  type="number"
                  name="preco"
                  step="0.01"
                  min="0"
                  value={formData.preco}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Descrição *</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.modalButtons}>
                <button 
                  className={styles.saveButton} 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmationModal}>
            <h3>Confirmar Exclusão</h3>
            <p>Você realmente deseja excluir o produto "{produtoToDelete?.nome}"?</p>
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

export default ProdutosAdmin;
