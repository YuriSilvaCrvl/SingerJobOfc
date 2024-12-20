// src/utils/helpers.js
import { format, formatDistance, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

class Helpers {
  // Validações
  static validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  static validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Validação de CPF
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  // Formatações
  static formatCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  static formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  }

  static maskCurrency(value) {
    if (!value) return '';
    
    // Converte para número e formata como moeda
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  // Manipulação de Datas
  static formatDate(date, formatString = 'dd/MM/yyyy') {
    try {
      return format(new Date(date), formatString, { locale: pt });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return date;
    }
  }

  static getRelativeTime(date) {
    try {
      return formatDistance(parseISO(date), new Date(), { 
        locale: pt,
        addSuffix: true 
      });
    } catch (error) {
      console.error('Erro ao calcular tempo relativo:', error);
      return date;
    }
  }

  // Geração de UUID
  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, 
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Manipulação de Strings
  static truncateText(text, length = 100, suffix = '...') {
    if (!text) return '';
    
    return text.length > length 
      ? text.substring(0, length) + suffix
      : text;
  }

  static capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  // Geração de Slug
  static generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Validações de Formulário
  static validateForm(fields) {
    const errors = {};

    Object.keys(fields).forEach(key => {
      const value = fields[key];
      
      // Validações genéricas
      if (!value) {
        errors[key] = 'Este campo é obrigatório';
      }

      // Validações específicas
      switch (key) {
        case 'email':
          if (value && !this.validateEmail(value)) {
            errors[key] = 'E-mail inválido';
          }
          break;
        case 'cpf':
          if (value && !this.validateCPF(value)) {
            errors[key] = 'CPF inválido';
          }
          break;
        case 'phone':
          if (value && value.replace(/\D/g, '').length < 10) {
            errors[key] = 'Telefone inválido';
          }
          break;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Comparação de Objetos
  static isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  // Manipulação de Arrays
  static uniqueArray(array) {
    return [...new Set(array)];
  }

  // Geração de Senhas
  static generatePassword(length = 12) {
    const charset = 
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    
    return password;
  }

  // Cálculo de Idade
  static calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
}

// Exportação para uso em diferentes partes do aplicativo
export default Helpers;