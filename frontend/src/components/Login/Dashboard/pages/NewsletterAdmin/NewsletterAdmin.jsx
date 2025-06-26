import api from '../../../../../api';
import React, { useEffect, useState } from 'react';
import styles from '../NewsletterAdmin/NewsletterAdmin.module.css';

const NewsletterAdmin = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [smtpEmail, setSmtpEmail] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [editingSmtp, setEditingSmtp] = useState(true);
  const [smtpSuccessMsg, setSmtpSuccessMsg] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchSmtpConfig = async () => {
      try {
        const res = await api.get('/newsletter/config');
        if (res.data.email) {
          setSmtpEmail(res.data.email);
          setSmtpConfigured(true);
          setEditingSmtp(false);
        }
      } catch (error) {
        console.error(error);
        setEditingSmtp(true);
        setSmtpConfigured(false);
      }
    };

    const fetchSubscribers = async () => {
      try {
        const res = await api.get('/newsletter/subscribers');
        setSubscribers(res.data || []);
      } catch (error) {
        console.error('Erro ao buscar assinantes', error);
      }
    };

    fetchSmtpConfig();
    fetchSubscribers();
  }, []);

  const toggleEmail = (email) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedEmails(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedEmails.size === subscribers.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(subscribers.map((s) => s.email)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!subject.trim() || !message.trim()) {
      setErrorMsg('Assunto e mensagem são obrigatórios.');
      setLoading(false);
      return;
    }

    let emailsToSend = [];
    if (selectedEmails.size === 0) {
      emailsToSend = subscribers.map((s) => s.email);
    } else {
      emailsToSend = Array.from(selectedEmails);
    }

    try {
      await api.post('/newsletter/send', {
        emails: emailsToSend,
        subject,
        message,
      });
      setSuccessMsg(`Newsletter enviada para ${emailsToSend.length} assinante(s)!`);
      setSubject('');
      setMessage('');
      setSelectedEmails(new Set());
    } catch (error) {
      setErrorMsg(error.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureSMTP = async () => {
    if (!smtpEmail.trim() || !smtpPassword.trim()) {
      setErrorMsg('Email e senha são obrigatórios para conectar.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSmtpSuccessMsg('');
    try {
      await api.post('/newsletter/config', { email: smtpEmail, password: smtpPassword });
      setSmtpConfigured(true);
      setEditingSmtp(false);
      setSmtpSuccessMsg('Conectado com sucesso!');
    } catch (error) {
      setErrorMsg(error.message || 'Erro inesperado ao conectar SMTP');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSMTP = () => {
    if (window.confirm('Você deseja alterar o email de origem para envios?')) {
      setEditingSmtp(true);
      setSmtpConfigured(false);
      setSmtpSuccessMsg('');
    }
  };

  const handleDeleteSubscribers = async () => {
    setIsDeleting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.delete('/newsletter/subscribers', {
        data: { emails: Array.from(selectedEmails) }
      });
      
      setSuccessMsg(response.data.message);
      const res = await api.get('/newsletter/subscribers');
      setSubscribers(res.data || []);
      setSelectedEmails(new Set());
      setShowDeleteModal(false);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Erro ao excluir assinantes');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.contentContainer}>
      <h2 className={styles.sectionTitle}>Newsletter</h2>

      <div className={styles.smtpSection}>
        <h3>Configuração de Email de Origem (Somente Gmail)</h3>
        <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>
          Funciona apenas com contas do Gmail que tenham autenticação em duas etapas (2FA) ativada e senha de aplicativo gerada.
        </p>

        <label>Email Gmail:</label>
        <input
          type="email"
          value={smtpEmail}
          onChange={(e) => setSmtpEmail(e.target.value)}
          disabled={!editingSmtp}
          className={styles.input}
        />

        <label>Senha do Email:</label>
        <input
          type="password"
          value={smtpPassword}
          onChange={(e) => setSmtpPassword(e.target.value)}
          disabled={!editingSmtp}
          className={styles.input}
        />

        {smtpSuccessMsg && <p className={styles.successMsg}>{smtpSuccessMsg}</p>}

        {!smtpConfigured && (
          <button onClick={handleConfigureSMTP} className={styles.button}>
            Conectar
          </button>
        )}

        {smtpConfigured && (
          <button onClick={handleEditSMTP} className={styles.button}>
            Editar
          </button>
        )}
      </div>

      <div className={styles.splitLayout}>
        <div className={styles.formSection}>
          <h3>Enviar Newsletter</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label>
              Assunto:
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className={styles.input}
              />
            </label>

            <label>
              Mensagem:
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className={styles.textarea}
                rows={6}
              />
            </label>

            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
            {successMsg && <p className={styles.successMsg}>{successMsg}</p>}

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'Enviando...' : 'Enviar Newsletter'}
            </button>
          </form>
        </div>

        <div className={styles.listSection}>
          <h3>Assinantes ({subscribers.length})</h3>

          <div className={styles.subscriberActions}>
            <button onClick={toggleSelectAll} className={styles.selectAllBtn}>
              {selectedEmails.size === subscribers.length ? 'Desmarcar Todos' : 'Marcar Todos'}
            </button>
            
            <button 
              onClick={() => selectedEmails.size > 0 && setShowDeleteModal(true)}
              disabled={selectedEmails.size === 0}
              className={styles.deleteButton}
            >
              Excluir Selecionados
            </button>
          </div>

          <ul className={styles.subscriberList}>
            {subscribers.map((sub) => (
              <li key={sub.id} className={styles.subscriberItem}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedEmails.has(sub.email)}
                    onChange={() => toggleEmail(sub.email)}
                  />
                  {sub.email}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmationModal}>
            <h3>Confirmar Exclusão</h3>
            <p>Deseja realmente excluir {selectedEmails.size} assinante(s) selecionado(s)? Esta ação não pode ser desfeita.</p>
            
            <div className={styles.modalButtons}>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteSubscribers} 
                className={styles.confirmButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterAdmin;