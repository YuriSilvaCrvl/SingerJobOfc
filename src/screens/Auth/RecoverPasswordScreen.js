// src/screens/Auth/RecoverPasswordScreen.js
import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { 
  Text, 
  Title, 
  Paragraph 
} from 'react-native-paper';

// Componentes customizados
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

// Serviços
import ApiService from '../../services/ApiService';
import Helpers from '../../utils/helpers';

const RecoverPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecoverPassword = async () => {
    // Validar email
    if (!Helpers.validateEmail(email)) {
      setError('Por favor, insira um e-mail válido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Chamada para recuperação de senha
      await ApiService.recoverPassword(email);
      
      setSuccess('Um link de recuperação foi enviado para seu e-mail');
      
      // Navegar de volta para login após alguns segundos
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Erro ao recuperar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Title style={styles.title}>Recuperar Senha</Title>
      
      <Paragraph style={styles.subtitle}>
        Insira seu e-mail para receber instruções de recuperação
      </Paragraph>

      <CustomInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={!!error}
        errorText={error}
      />

      {success !== '' && (
        <Text style={styles.successText}>{success}</Text>
      )}

      <CustomButton
        mode="contained"
        onPress={handleRecoverPassword}
        loading={loading}
        disabled={loading}
      >
        Recuperar Senha
      </CustomButton>

      <CustomButton
        mode="text"
        onPress={() => navigation.navigate('Login')}
      >
        Voltar para Login
      </CustomButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  successText: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default RecoverPasswordScreen;