import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { 
  Searchbar, 
  Text, 
  Card, 
  Chip, 
  ActivityIndicator 
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Serviços
import ArtistService from '../../services/ArtistService';
import StorageService from '../../services/StorageService';

// Componentes customizados
import FilterModal from '../../components/FilterModal';
import OpportunityCard from '../../components/OpportunityCard';

const SearchScreen = ({ navigation }) => {
  // Estados
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // Estados de filtro
  const [selectedFilters, setSelectedFilters] = useState({
    artTypes: [],
    locations: [],
    minExperience: 0
  });

  // Carregar artistas
  useEffect(() => {
    fetchArtists();
  }, []);

  // Buscar artistas
  const fetchArtists = async () => {
    setLoading(true);
    try {
      const artistList = await ArtistService.getAllArtists();
      setArtists(artistList);
      setFilteredArtists(artistList);
    } catch (error) {
      console.error('Erro ao buscar artistas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Realizar busca
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = artists.filter(artist => 
      artist.name.toLowerCase().includes(query.toLowerCase()) ||
      artist.artType.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredArtists(filtered);
  };

  // Aplicar filtros
  const applyFilters = (filters) => {
    setSelectedFilters(filters);
    
    let result = artists;

    // Filtro por tipo de arte
    if (filters.artTypes.length > 0) {
      result = result.filter(artist => 
        filters.artTypes.includes(artist.artType)
      );
    }

    // Filtro por localização
    if (filters.locations.length > 0) {
      result = result.filter(artist => 
        filters.locations.includes(artist.location)
      );
    }

    // Filtro por experiência
    if (filters.minExperience > 0) {
      result = result.filter(artist => 
        artist.experience >= filters.minExperience
      );
    }

    // Filtro adicional de busca
    if (searchQuery) {
      result = result.filter(artist => 
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.artType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArtists(result);
    setFilterModalVisible(false);
  };

  // Renderizar item de artista
  const renderArtistItem = ({ item }) => (
    <Card 
      style={styles.artistCard}
      onPress={() => navigation.navigate('ArtistProfile', { artistId: item.id })}
    >
      <Card.Cover source={{ uri: item.profileImage }} />
      <Card.Content>
        <Text style={styles.artistName}>{item.name}</Text>
        <Text style={styles.artistType}>{item.artType}</Text>
        <View style={styles.chipContainer}>
          <Chip 
            icon="map-marker" 
            style={styles.chip}
          >
            {item.location}
          </Chip>
          <Chip 
            icon="star" 
            style={styles.chip}
          >
            {item.experience} anos
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  // Renderizar tela de busca
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar artistas"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons 
            name="filter" 
            size={24} 
            color="#6A0DAD" 
          />
        </TouchableOpacity>
      </View>

      {/* Filtros aplicados */}
      <View style={styles.appliedFiltersContainer}>
        {selectedFilters.artTypes.map(type => (
          <Chip 
            key={type} 
            onClose={() => {
              const newFilters = {
                ...selectedFilters,
                artTypes: selectedFilters.artTypes.filter(t => t !== type)
              };
              applyFilters(newFilters);
            }}
          >
            {type}
          </Chip>
        ))}
      </View>

      {/* Lista de artistas */}
      {loading ? (
        <ActivityIndicator 
          animating={true} 
          color="#6A0DAD" 
          size="large" 
          style={styles.loading} 
        />
      ) : (
        <FlatList
          data={filteredArtists}
          renderItem={renderArtistItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhum artista encontrado
              </Text>
            </View>
          }
        />
      )}

      {/* Modal de Filtros */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={applyFilters}
        currentFilters={selectedFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  artistCard: {
    margin: 10,
    elevation: 3,
  },
  artistName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  artistType: {
    color: '#666',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  chip: {
    marginRight: 10,
  },
  loading: {
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
    fontSize: 18,
    color: '#888',
  },
  appliedFiltersContainer: {
    flexDirection: 'row',
    padding: 10,
  },
});

export default SearchScreen;