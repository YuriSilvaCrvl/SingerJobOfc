import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

class StorageService {
  // Método genérico para salvar usuário
  static async saveUser(userData, userType) {
    try {
      // Gerar ID único
      userData.id = uuid.v4();
      
      // Recuperar lista existente
      const existingUsers = await this.getUsers(userType);
      
      // Adicionar novo usuário
      const updatedUsers = [...existingUsers, userData];
      
      // Salvar lista atualizada
      await AsyncStorage.setItem(`${userType}s`, JSON.stringify(updatedUsers));
      
      return userData;
    } catch (error) {
      console.error(`Erro ao salvar ${userType}:`, error);
      return null;
    }
  }

  // Método para recuperar usuários
  static async getUsers(userType) {
    try {
      const users = await AsyncStorage.getItem(`${userType}s`);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error(`Erro ao recuperar ${userType}s:`, error);
      return [];
    }
  }

  // Outros métodos (login, busca, etc.)
}

export default StorageService;