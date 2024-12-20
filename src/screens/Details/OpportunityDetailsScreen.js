// src/screens/Details/OpportunityDetailsScreen.js
import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Linking 
} from 'react-native';
import { 
  Text, 
  Title, 
  Card, 
  Button, 
  Chip 
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Serviços
import OpportunityService from '../../services/OpportunityService';

const OpportunityDetailsScreen = ({ route, navigation }) => {
  const { opportunity } = route.params;
  const [isSaved, setIsSaved] = useState(opportunity.isSaved || false);

  const handleSaveOpportunity = async () => {
    try {
      const result = await OpportunityService.toggleSaveOpportunity(opportunity.id);
      setIsSaved(result);
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error);
    }
  };

  const openExternalLink = async () => {
    try {
      await Linking.openURL(opportunity.applicationLink);
    } catch (error) {
      console.error('Erro ao abrir link:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Título e Informações Básicas */}
          <Title style={styles.title}>{opportunity.title}</Title>
          
          <View style={styles.infoContainer}>
            <Chip 
              icon="briefcase" 
              style={styles.chip}
            >
              {opportunity.company.name}
            </Chip>
            <Chip 
              icon="map-marker" 
              style={styles.chip}
            >
              {opportunity.location}
            </Chip>
          </View>

          {/* Detalhes da Oportunidade */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text>{opportunity.description}</Text>
          </View>

          {/* Requisitos */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Requisitos</Text>
            {opportunity.requirements.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color="#6A0DAD" 
                />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>

          {/* Informações de Pagamento */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Remuneração</Text>
            <Text style={styles.paymentText}>
              R$ {opportunity.paymentRange.min} - R$ {opportunity.paymentRange.max}
            </Text>
          </View>

          {/* Ações */}
          <View style={styles.actionContainer}>
            <Button 
              mode="contained" 
              onPress={openExternalLink}
              style={styles.actionButton}
            >
              Candidatar-se
            </Button>
            <Button 
              mode={isSaved ? "outlined" : "text"}
              onPress={handleSaveOpportunity}
              style={styles.actionButton}
              icon={isSaved ? "heart" : "heart-outline"}
            >
              {isSaved ? "Salvo" : "Salvar"}
            </Button>
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
  card: {
    margin: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  chip: {
    marginRight: 10,
  },
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  requirementText: {
    marginLeft: 10,
  },
  paymentText: {
    fontSize: 16,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default OpportunityDetailsScreen;