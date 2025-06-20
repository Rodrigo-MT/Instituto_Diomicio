import axios from 'axios';

// Carrega variáveis de ambiente
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const timeout = Number(process.env.REACT_APP_API_TIMEOUT) || 10000;

const api = axios.create({
  baseURL,
  timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Interceptor global de respostas
api.interceptors.response.use(
  response => ({
    data: response.data,
    status: response.status,
    headers: response.headers,
  }),
  error => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          if (typeof window !== 'undefined') {
            window.location.href = '/login?sessionExpired=true';
          }
          break;
        case 403:
          console.error('Acesso negado:', error.config?.url);
          break;
        case 500:
          console.error('Erro interno no servidor:', error.config?.url);
          break;
        default:
          console.error('Erro desconhecido:', error.message);
      }
    } else if (error.request) {
      console.error('Sem resposta do servidor:', error.request);
    } else {
      console.error('Erro na configuração da requisição:', error.message);
    }

    return Promise.reject({
      message: error.response?.data?.message || 'Erro na conexão',
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// Upload com multipart/form-data
api.upload = async (url, formData, progressCallback = null) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: progressCallback,
  };
  return api.post(url, formData, config);
};

// Download de arquivos (blob)
api.download = async (url, options = {}) => {
  const response = await api.get(url, {
    responseType: 'blob',
    ...options,
  });
  return response.data;
};

export default api;
