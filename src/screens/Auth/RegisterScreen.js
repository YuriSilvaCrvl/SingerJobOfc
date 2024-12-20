import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Importações de componentes personalizados
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomPicker from '../../components/CustomPicker';

// Importações de serviços
import StorageService from '../../services/StorageService';
import AuthService from '../../services/AuthService';

// Importação de tema
import theme from '../../utils/theme';

// Esquema de validação para registro
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Senhas não coincidem')
    .required('Confirmação de senha é obrigatória'),
  userType: Yup.string()
    .required('Tipo de usuário é obrigatório'),
  artType: Yup.string().when('userType', {
    is: 'artist',
    then: Yup.string().required('Tipo de arte é obrigatório')
  })
});

const RegisterScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (values) => {
    setIsLoading(true);
    try {
      // Preparar dados do usuário
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        userType: values.userType,
        ...(values.userType === 'artist' && { artType: values.artType })
      };

      // Registrar usuário
      const registeredUser = await AuthService.register(userData);
      
      if (registeredUser) {
        Alert.alert(
          'Sucesso', 
          'Cadastro realizado com sucesso!',
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível realizar o cadastro');
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro no cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Criar Conta</Text>
      
      <Formik
        initialValues={{ 
          name: '', 
          email: '', 
          password: '', 
          confirmPassword: '',
          userType: '',
          artType: ''
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ 
          handleChange, 
          handleBlur, 
          handleSubmit, 
          values, 
          errors, 
          touched,
          setFieldValue 
        }) => (
          <View style={styles.formContainer}>
            <CustomInput
              placeholder="Nome Completo"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              error={touched.name && errors.name}
            />
            
            <CustomInput
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={touched.email && errors.email}
              keyboardType="email-address"
            />
            
            <CustomPicker
              placeholder="Tipo de Usuário"
              options={[
                { label: 'Artista', value: 'artist' },
                { label: 'Empresário', value: 'businessman' }
              ]}
              onValueChange={(value) => {
                setFieldValue('userType', value);
              }}
              value={values.userType}
              error={touched.userType && errors.userType}
            />

            {values.userType === 'artist' && (
              <CustomPicker
                placeholder="Tipo de Arte"
                options={[
                  { label: 'Música', value: 'music' },
                  { label: 'Dança', value: 'dance' },
                  { label: 'Teatro', value: 'theater' }
                ]}
                onValueChange={(value) => {
                  setFieldValue('artType', value);
                }}
                value={values.artType}
                error={touched.artType && errors.artType}
              />
            )}
            
            <CustomInput
              placeholder="Senha"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={touched.password && errors.password}
              secureTextEntry
            />
            
            <CustomInput
              placeholder="Confirmar Senha"
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              error={touched.confirmPassword && errors.confirmPassword}
              secureTextEntry
            />
            
            <CustomButton 
              title="Cadastrar" 
              onPress={handleSubmit}
              loading={isLoading}
            />
          </View>
        )}
      </Formik>
      
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.loginText}>
          Já tem uma conta? Faça login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.primary,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  loginText: {
    color: theme.colors.primary,
    marginTop: 15,
  }
});

export default RegisterScreen;