// src/screens/Auth/LoginScreen.js
import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { 
  Text, 
  Title 
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Componentes customizados
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

// Serviços
import ApiService from '../../services/ApiService';

// Esquema de validação
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  password: Yup.string()
    .min(6, 'Senha muito curta')
    .required('Senha é obrigatória')
});

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(
        values.email, 
        values.password
      );

      // Navegação após login bem-sucedido
      navigation.navigate('Main');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>SingerJob</Title>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ 
          handleChange, 
          handleBlur, 
          handleSubmit, 
          values, 
          errors, 
          touched 
        }) => (
          <View style={styles.formContainer}>
            <CustomInput
              label="E-mail"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && !!errors.email}
              errorText={touched.email && errors.email}
              keyboardType="email-address"
            />

            <CustomInput
              label="Senha"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password && !!errors.password}
              errorText={touched.password && errors.password}
              secureTextEntry
            />

            {error !== '' && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity 
              onPress={() => navigation.navigate('RecoverPassword')}
            >
              <Text style={styles.forgotPassword}>
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>

            <CustomButton
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            >
              Entrar
            </CustomButton>

            <CustomButton
              mode="text"
              onPress={() => navigation.navigate('Register')}
            >
              Criar nova conta
            </CustomButton>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    color: '#6A0DAD',
  },
  formContainer: {
    width: '100%',
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#6A0DAD',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;