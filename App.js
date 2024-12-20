// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { 
  StatusBar, 
  Platform 
} from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme 
} from '@react-navigation/native';
import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme, 
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';
import { 
  createStackNavigator 
} from '@react-navigation/stack';
import { 
  createBottomTabNavigator 
} from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Contextos
import { AuthProvider } from './src/context/AuthContext';

// Telas de Autenticação
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import RecoverPasswordScreen from './src/screens/Auth/RecoverPasswordScreen';

// Telas Principais
import DashboardScreen from './src/screens/Main/DashboardScreen';
import SearchScreen from './src/screens/Main/SearchScreen';
import OpportunitiesScreen from './src/screens/Main/OpportunitiesScreen';

// Telas de Perfil
import ArtistProfileScreen from './src/screens/Profile/ArtistProfileScreen';

// Telas de Detalhes
import OpportunityDetailsScreen from './src/screens/Details/OpportunityDetailsScreen';
import ArtistDetailsScreen from './src/screens/Details/ArtistDetailsScreen';

// Configuração de Navegação
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tema Personalizado
const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: '#6A0DAD',
    accent: '#FF6B6B',
    background: '#F5F5F5',
  },
};

const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: '#8E24AA',
    accent: '#FF6B6B',
    background: '#121212',
  },
};

// Navegação de Tabs
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Opportunities':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6A0DAD',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Buscar' }}
      />
      <Tab.Screen 
        name="Opportunities" 
        component={OpportunitiesScreen} 
        options={{ title: 'Oportunidades' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ArtistProfileScreen} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

// Componente Principal
export default function App() {
  // Estados
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  // Preparação do App
  useEffect(() => {
    async function prepare() {
      try {
        // Manter a splash screen visível
        await SplashScreen.preventAutoHideAsync();

        // Carregar fontes
        await Font.loadAsync({
          'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        });

      } catch (e) {
        console.warn(e);
      } finally {
        // Ocultar splash screen
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // Renderização condicional baseada no carregamento
  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <PaperProvider 
        theme={isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme}
      >
        <NavigationContainer 
          theme={isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme}
        >
          <StatusBar 
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={
              isDarkMode 
                ? CombinedDarkTheme.colors.background 
                : CombinedDefaultTheme.colors.background
            }
          />
          
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{ 
              headerStyle: { 
                backgroundColor: '#6A0DAD' 
              },
              headerTintColor: '#fff',
              headerTitleStyle: { 
                fontWeight: 'bold' 
              }
            }}
          >
            {/* Telas de Autenticação */}
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Cadastro' }}
            />
            <Stack.Screen 
              name="RecoverPassword" 
              component={RecoverPasswordScreen} 
              options={{ title: 'Recuperar Senha' }}
            />

            {/* Telas Principais */}
            <Stack.Screen 
              name="Main" 
              component={MainTabNavigator} 
              options={{ headerShown: false }}
            />

            {/* Telas de Detalhes */}
            <Stack.Screen 
              name="OpportunityDetails" 
              component={OpportunityDetailsScreen} 
              options={{ title: 'Detalhes da Oportunidade' }}
            />
            <Stack.Screen 
              name="ArtistDetails" 
              component={ArtistDetailsScreen} 
              options={{ title: 'Perfil do Artista' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}