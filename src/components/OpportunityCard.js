// src/components/OpportunityCard.js
import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { 
  Card, 
  Text, 
  Chip, 
  Avatar 
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const OpportunityCard = ({ 
  opportunity, 
  onPress, 
  onSave 
}) => {
  // Desestruturação dos dados da oportunidade
  const {
    id,
    title,
    description,
    artType,
    location,
    paymentRange,
    company,
    datePosted,
    isSaved = false
  } = opportunity;

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card 
      style={styles.card}
      elevation={3}
    >
      {/* Cabeçalho do Card */}
      <Card.Title
        title={title}
        subtitle={`Publicado em ${formatDate(datePosted)}`}
        left={(props) => (
          <Avatar.Icon 
            {...props} 
            icon="briefcase" 
            style={styles.avatarIcon} 
          />
        )}
        right={(props) => (
          <TouchableOpacity 
            onPress={() => onSave(id)}
            style={styles.saveButton}
          >
            <Ionicons 
              name={isSaved ? "heart" : "heart-outline"} 
              size={24} 
              color={isSaved ? "#FF6B6B" : "#666"} 
            />
          </TouchableOpacity>
        )}
      />

      {/* Conteúdo do Card */}
      <Card.Content>
        {/* Descrição */}
        <Text 
          style={styles.description} 
          numberOfLines={3}
        >
          {description}
        </Text>

        {/* Informações adicionais */}
        <View style={styles.chipContainer}>
          {/* Tipo de Arte */}
          <Chip 
            icon="palette" 
            style={styles.chip}
            textStyle={styles.chipText}
          >
            {artType}
          </Chip>

          {/* Localização */}
          <Chip 
            icon="map-marker" 
            style={styles.chip}
            textStyle={styles.chipText}
          >
            {location}
          </Chip>
        </View>

        {/* Detalhes da Empresa */}
        <View style={styles.companyContainer}>
          <Text style={styles.companyName}>
            {company.name}
          </Text>
          <Text style={styles.paymentRange}>
            R$ {paymentRange.min} - R$ {paymentRange.max}
          </Text>
        </View>
      </Card.Content>

      {/* Rodapé do Card */}
      <Card.Actions>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => onPress(opportunity)}
        >
          <Text style={styles.detailsButtonText}>
            Ver Detalhes
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color="#6A0DAD" 
          />
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  avatarIcon: {
    backgroundColor: '#6A0DAD20',
  },
  description: {
    marginBottom: 10,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    marginRight: 10,
    backgroundColor: '#6A0DAD10',
  },
  chipText: {
    color: '#6A0DAD',
  },
  companyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  companyName: {
    fontWeight: 'bold',
    color: '#333',
  },
  paymentRange: {
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  saveButton: {
    marginRight: 10,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  detailsButtonText: {
    color: '#6A0DAD',
    marginRight: 5,
    fontWeight: 'bold',
  },
});

export default OpportunityCard;