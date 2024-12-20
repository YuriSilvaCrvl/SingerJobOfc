// src/screens/Main/DashboardScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { 
  Text, 
  Card, 
  Title, 
  Paragraph,
  ActivityIndicator 
} from 'react-native-paper';

// Serviços
import RecommendationService from '../../services/RecommendationService';
import OpportunityService from '../../services/OpportunityService';
import ArtistService from '../../services/ArtistService';

// Componentes
import OpportunityCard from '../../components/OpportunityCard';

const DashboardScreen = ({ navigation }) => {
  // Estados
  const [recommendations, setRecommendations] = useState([]);
  const [latestOpportunities, setLatestOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função de busca de recomendações (useCallback para estabilidade)
  const fetchRecommendations = useCallback(async () => {
    try {
      // Buscar recomendações personalizadas
      const personalRecommendations = await RecommendationService.getPersonalRecommendations();
      setRecommendations(personalRecommendations);

      // Buscar últimas oportunidades
      const opportunities = await OpportunityService.getLatestOpportunities(5);
      setLatestOpportunities(opportunities);
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Array de dependências vazio 

  // Hook de efeito para carregar dados
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]); // Adicionar fetchRecommendations como dependência

  // Renderização condicional de carregamento
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
    <ScrollView style={styles.container}>
      {/* Seção de Recomendações Personalizadas */}
      <View style={styles.sectionContainer}>
        <Title style={styles.sectionTitle}>Recomendações para Você</Title>
        {recommendations.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhuma recomendação encontrada
          </Text>
        ) : (
          recommendations.map(recommendation => (
            <OpportunityCard
              key={recommendation.id}
              opportunity={recommendation}
              onPress={(opp) => navigation.navigate('OpportunityDetails', { opportunity: opp })}
              onSave={() => {}} // Implementar lógica de salvamento
            />
          ))
        )}
      </View>

      {/* Seção de Últimas Oportunidades */}
      <View style={styles.sectionContainer}>
        <Title style={styles.sectionTitle}>Últimas Oportunidades</Title>
        {latestOpportunities.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhuma oportunidade encontrada
          </Text>
        ) : (
          latestOpportunities.map(opportunity => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onPress={(opp) => navigation.navigate('OpportunityDetails', { opportunity: opp })}
              onSave={() => {}} // Implementar lógica de salvamento
            />
          ))
        )}
      </View>

      {/* Cards Informativos */}
      <View style={styles.infoCardsContainer}>
        <Card 
          style={styles.infoCard}
          onPress={() => navigation.navigate('Profile')}
        >
          <Card.Content>
            <Title>Complete seu Perfil</Title>
            <Paragraph>
              Aumente suas chances de ser contratado
            </Paragraph>
          </Card.Content>
        </Card>

        <Card 
          style={styles.infoCard}
          onPress={() => navigation.navigate('Opportunities')}
        >
          <Card.Content>
            <Title>Explorar Oportunidades</Title>
            <Paragraph>
              Encontre os melhores trabalhos para você
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 10,
    color: '#6A0DAD',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  infoCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
});

export default DashboardScreen;