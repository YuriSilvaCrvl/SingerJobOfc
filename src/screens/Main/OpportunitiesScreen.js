// src/screens/Main/OpportunitiesScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList 
} from 'react-native';
import { 
  Searchbar, 
  Text, 
  ActivityIndicator 
} from 'react-native-paper';

// Componentes
import OpportunityCard from '../../components/OpportunityCard';

// Serviços
import OpportunityService from '../../services/OpportunityService';

const OpportunitiesScreen = ({ navigation }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const fetchedOpportunities = await OpportunityService.getAllOpportunities();
      setOpportunities(fetchedOpportunities);
      setFilteredOpportunities(fetchedOpportunities);
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = opportunities.filter(opp => 
      opp.title.toLowerCase().includes(query.toLowerCase()) ||
      opp.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOpportunities(filtered);
  };

  const handleSaveOpportunity = async (opportunityId) => {
    try {
      await OpportunityService.toggleSaveOpportunity(opportunityId);
      // Atualizar lista de oportunidades
      fetchOpportunities();
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error);
    }
  };

  const renderOpportunityItem = ({ item }) => (
    <OpportunityCard
      opportunity={item}
      onPress={(opp) => navigation.navigate('OpportunityDetails', { opportunity: opp })}
      onSave={() => handleSaveOpportunity(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar oportunidades"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            animating={true} 
            color="#6A0DAD" 
            size="large" 
          />
        </View>
      ) : (
        <FlatList
          data={filteredOpportunities}
          renderItem={renderOpportunityItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhuma oportunidade encontrada
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchBar: {
    margin: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default OpportunitiesScreen;