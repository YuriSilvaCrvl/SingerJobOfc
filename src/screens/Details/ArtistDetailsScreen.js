// src/screens/Details/ArtistDetailsScreen.js
import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  Linking 
} from 'react-native';
import { 
  Avatar, 
  Title, 
  Text, 
  Card, 
  Chip, 
  Button 
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const ArtistDetailsScreen = ({ route }) => {
  const { artist } = route.params;

  const openSocialLink = async (platform) => {
    try {
      await Linking.openURL(artist.socialLinks[platform]);
    } catch (error) {
      console.error(`Erro ao abrir link do ${platform}:`, error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Seção de Perfil */}
      <View style={styles.profileHeader}>
        <Avatar.Image 
          size={120} 
          source={{ uri: artist.profileImage }} 
          style={styles.avatar}
        />
        <Title style={styles.name}>{artist.name}</Title>
        <Text style={styles.subtitle}>
          {artist.artType} | {artist.location}
        </Text>
      </View>

      {/* Biografia */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Sobre</Title>
          <Text>{artist.bio}</Text>
        </Card.Content>
      </Card>

      {/* Habilidades */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Habilidades</Title>
          <View style={styles.skillsContainer}>
            {artist.skills.map((skill, index) => (
              <Chip 
                key={index} 
                style={styles.chip}
              >
                {skill}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Experiência */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Experiência</Title>
          <View style={styles.experienceContainer}>
            <Ionicons 
              name="briefcase" 
              size={24} 
              color="#6A0DAD" 
            />
            <Text style={styles.experienceText}>
              {artist.experience} anos de carreira
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Links Sociais */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Redes Sociais</Title>
          <View style={styles.socialContainer}>
            {Object.entries(artist.socialLinks).map(([platform, link]) => (
              <Button
                key={platform}
                mode="outlined"
                onPress={() => openSocialLink(platform)}
                style={styles.socialButton}
                icon={platform}
              >
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  avatar: {
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
  },
  card: {
    margin: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 5,
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  experienceText: {
    marginLeft: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  socialButton: {
    width: '30%',
  },
});

export default ArtistDetailsScreen;