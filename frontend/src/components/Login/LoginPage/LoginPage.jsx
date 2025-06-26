import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import logo from '../../../assets/images/logo_header.png';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../../api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                username,
                password
            });

            // Armazena o token no localStorage
            localStorage.setItem('token', response.data.access_token);
            
            // Redireciona para a página admin
            navigate('/admin/eventos');
            
        } catch (err) {
            console.error('Erro no login:', err);
            setError('Usuário ou senha incorretos');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginBackground}>
            {/* Botão Voltar */}
            <button
                onClick={() => navigate(-1)}
                className={styles.backButton}
                aria-label="Voltar"
            >
                <FiArrowLeft size={20} />
            </button>

            <div className={styles.loginContainer}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="Logo Admin" className={styles.logo} />
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <h1 className={styles.title}>Acesso Administrativo</h1>
                    <p className={styles.subtitle}>Insira suas credenciais de acesso</p>

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Usuário"
                            className={styles.inputField}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha"
                            className={styles.inputField}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.loginButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Carregando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;