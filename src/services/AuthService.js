import StorageService from './StorageService';
import { hashPassword, comparePassword } from '../utils/passwordUtils';

class AuthService {
  static async register(userData) {
    try {
      // Hash da senha
      userData.password = hashPassword(userData.password);
      
      // Salvar usuário no AsyncStorage
      const savedUser = await StorageService.saveUser(userData, userData.userType);
      
      return savedUser;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      // Buscar usuários de ambos os tipos
      const artists = await StorageService.getUsers('artist');
      const businessmen = await StorageService.getUsers('businessman');
      
      // Combinar usuários
      const allUsers = [...artists, ...businessmen];
      
      // Encontrar usuário
      const user = allUsers.find(u => u.email === email);
      
      if (user && comparePassword(password, user.password)) {
        // Salvar usuário logado
        await StorageService.saveData('currentUser', user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  static async logout() {
    await StorageService.removeData('currentUser');
  }
}

export default AuthService;