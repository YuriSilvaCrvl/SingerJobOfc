// src/services/ApiService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
  // Instância do Axios configurada
  static axiosInstance = axios.create({
    baseURL: 'https://api.singerjob.com/v1', // URL base da API
    timeout: 10000, // Tempo limite de 10 segundos
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Interceptor para adicionar token de autenticação
  static setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de resposta para tratamento de erros
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Tratamento de token expirado
        if (
          error.response?.status === 401 && 
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          
          try {
            // Tentar renovar o token
            const newToken = await this.refreshToken();
            
            // Atualizar token no cabeçalho
            this.axiosInstance.defaults.headers.common['Authorization'] = 
              `Bearer ${newToken}`;
            
            // Retry da requisição original
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Logout em caso de falha na renovação do token
            await this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  static async login(email, password) {
    try {
      const response = await this.axiosInstance.post('/auth/login', {
        email,
        password
      });

      // Salvar token de autenticação
      await this.saveAuthToken(response.data.token);

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async register(userData) {
    try {
      const response = await this.axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async logout() {
    try {
      // Fazer logout na API
      await this.axiosInstance.post('/auth/logout');
      
      // Limpar token local
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      this.handleError(error);
    }
  }

  // Métodos de gerenciamento de token
  static async saveAuthToken(token) {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  static async getAuthToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
      return null;
    }
  }

  static async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      const response = await this.axiosInstance.post('/auth/refresh', {
        refreshToken
      });

      // Salvar novo token
      await this.saveAuthToken(response.data.token);

      return response.data.token;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Métodos de recursos gerais
  static async fetchOpportunities(filters = {}) {
    try {
      const response = await this.axiosInstance.get('/opportunities', {
        params: filters
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async fetchArtistProfile() {
    try {
      const response = await this.axiosInstance.get('/profile');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  static async updateProfile(profileData) {
    try {
      const response = await this.axiosInstance.put('/profile', profileData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Tratamento de erros centralizado
  static handleError(error) {
    if (error.response) {
      // Erro de resposta do servidor
      console.error('Erro de resposta:', error.response.data);
      console.error('Status do erro:', error.response.status);
    } else if (error.request) {
      // Erro de requisição sem resposta
      console.error('Erro de requisição:', error.request);
    } else {
      // Erro na configuração da requisição
      console.error('Erro de configuração:', error.message);
    }

    // Tratamento adicional de erros
    switch (error.response?.status) {
      case 400:
        throw new Error('Requisição inválida');
      case 401:
        throw new Error('Não autorizado');
      case 403:
        throw new Error('Acesso proibido');
      case 404:
        throw new Error('Recurso não encontrado');
      case 500:
        throw new Error('Erro interno do servidor');
      default:
        throw new Error('Erro desconhecido');
    }
  }

  // Método para upload de arquivos
  static async uploadFile(file, type = 'profile') {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.fileName || 'file'
      });
      formData.append('type', type);

      const response = await this.axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

// Configurar interceptores ao inicializar
ApiService.setupInterceptors();

export default ApiService;