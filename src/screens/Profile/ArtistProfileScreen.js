// src/screens/Profile/ArtistProfileScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { 
  Avatar, 
  Title, 
  Text, 
  Card, 
  Chip, 
  Divider,
  Button,
  IconButton
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Serviços
import ApiService from '../../services/ApiService';
import StorageService from '../../services/StorageService';

// Componentes
import CustomInput from '../../components/CustomInput';
import CustomPicker from '../../components/CustomPicker';

// Utilitários
import Helpers from '../../utils/helpers';
import ImagePickerUtil from '../../utils/ImagePickerUtil';

const ArtistProfileScreen = ({ navigation }) => {
  // Estados do perfil
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    artType: '',
    location: '',
    skills: [],
    experience: 0,
    socialLinks: {
      instagram: '',
      spotify: '',
      youtube: ''
    },
    profileImage: null
  });

  // Estados de edição
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Opções para seleção
  const artTypeOptions = [
    'Música', 'Dança', 'Teatro', 
    'Artes Visuais', 'Fotografia', 'Circo'
  ];

  const locationOptions = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 
    'Salvador', 'Curitiba', 'Porto Alegre'
  ];

  // Carregar perfil
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userData = await ApiService.fetchArtistProfile();
      setProfile(userData);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar dados do perfil
  const handleInputChange = (field, value) => {
    let processedValue = value;

    // Processamentos específicos
    switch (field) {
      case 'phone':
        processedValue = Helpers.formatPhone(value);
        break;
      case 'experience':
        processedValue = parseInt(value) || 0;
        break;
    }

    setProfile(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };

  // Adicionar habilidade
  const addSkill = (skill) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  // Remover habilidade
  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Selecionar imagem de perfil
  const handlePickImage = async () => {
    try {
      const result = await ImagePickerUtil.pickImage();
      if (result) {
        // Upload da imagem
        const uploadResponse = await ApiService.uploadFile(result, 'profile');
        
        setProfile(prev => ({
          ...prev,
          profileImage: uploadResponse.url
        }));
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
    }
  };

  // Salvar perfil
  const saveProfile = async () => {
    try {
      // Validação
      const { isValid, errors } = Helpers.validateForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        artType: profile.artType
      });

      if (!isValid) {
        setErrors(errors);
        return;
      }

      // Atualizar perfil na API
      await ApiService.updateProfile(profile);
      
      // Desativar modo de edição
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  // Renderização condicional de conteúdo
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          animating={true} 
          color="#6A0DAD" 
          size="large" 
        />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      {/* Seção de Imagem de Perfil */}
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={handlePickImage}>
          <Avatar.Image 
            size={120} 
            source={
              profile.profileImage 
                ? { uri: profile.profileImage }
                : require('../../../assets/default-avatar.png')
            } 
          />
          <View style={styles.cameraIconContainer}>
            <Ionicons 
              name="camera" 
              size={24} 
              color="white" 
            />
          </View>
        </TouchableOpacity>
        <Title style={styles.profileName}>
          {profile.name}
        </Title>
        <Text style={styles.profileSubtitle}>
          {profile.artType} | {profile.location}
        </Text>
      </View>

      {/* Modo de Edição */}
      {isEditing ? (
        <>
          <CustomInput
            label="Nome Completo"
            value={profile.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={!!errors.name}
            errorText={errors.name}
          />

          <CustomInput
            label="E-mail"
            value={profile.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            error={!!errors.email}
            errorText={errors.email}
          />

          <CustomInput
            label="Telefone"
            value={profile.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
            error={!!errors.phone}
            errorText={errors.phone}
          />

          <CustomPicker
            label="Tipo de Arte"
            options={artTypeOptions}
            selectedValue={profile.artType}
            onValueChange={(value) => handleInputChange('artType', value)}
          />

          <CustomPicker
            label="Localização"
            options={locationOptions}
            selectedValue={profile.location}
            onValueChange={(value) => handleInputChange('location', value)}
          />

          <CustomInput
            label="Biografia"
            value={profile.bio}
            onChangeText={(value) => handleInputChange('bio', value)}
            multiline
            numberOfLines={4}
          />

          <CustomInput
            label="Anos de Experiência"
            value={profile.experience.toString()}
            onChangeText={(value) => handleInputChange('experience', value)}
            keyboardType="numeric"
          />

          {/* Gerenciamento de Habilidades */}
          <View style={styles.skillsContainer}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            <View style={styles.skillInputContainer}>
              <CustomInput
                label="Nova Habilidade"
                onSubmitEditing={(e) => addSkill(e.nativeEvent.text)}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.chipContainer}>
              {profile.skills.map(skill => (
                <Chip
                  key={skill}
                  onClose={() => removeSkill(skill)}
                  style={styles.skillChip}
                >
                  {skill}
                </Chip>
              ))}
            </View>
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionButtonsContainer}>
            <Button 
              mode="contained" 
              onPress={saveProfile}
            >
              Salvar
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
          </View>
        </>
      ) : (
        // Modo de Visualização
        <>
          {/* Seção de Biografia */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Title>Sobre Mim</Title>
              <Text>{profile.bio || 'Nenhuma biografia adicionada'}</Text>
            </Card.Content>
          </Card>

          {/* Seção de Experiência */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Title>Experiência</Title>
              <Text>{profile.experience} anos</Text>
            </Card.Content>
          </Card>

          {/* Seção de Habilidades */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Title>Habilidades</Title>
              <View style={styles.chipContainer}>
                {profile.skills.map(skill => (
                  <Chip 
                    key={skill} 
                    style={styles.skillChip}
                  >
                    {skill}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Botão de Edição */}
          <Button 
            mode="contained" 
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          >
            Editar Perfil
          </Button>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6A0DAD',
    borderRadius: 20,
    padding: 5,
  },
  profileName: {
    marginTop: 10,
    fontSize: 20,
  },
  profileSubtitle: {
    color: '#666',
  },
  sectionCard: {
    margin: 10,
  },
  skillsContainer: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  skillInputContainer: {
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    margin: 5,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  editButton: {
    margin: 20,
  },
});

export default ArtistProfileScreen;