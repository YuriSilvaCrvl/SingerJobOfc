import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  ScrollView 
} from 'react-native';
import { 
  Text, 
  Button, 
  Checkbox, 
  Slider 
} from 'react-native-paper';

const FilterModal = ({ 
  visible, 
  onClose, 
  onApplyFilters, 
  currentFilters 
}) => {
  const [selectedFilters, setSelectedFilters] = useState(currentFilters);

  const artTypes = [
    'Música', 'Dança', 'Teatro', 'Artes Visuais', 
    'Fotografia', 'Circo'
  ];

  const locations = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 
    'Salvador', 'Curitiba', 'Porto Alegre'
  ];

  const toggleArtType = (type) => {
    const currentTypes = selectedFilters.artTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    setSelectedFilters({
      ...selectedFilters,
      artTypes: newTypes
    });
  };

  const toggleLocation = (location) => {
    const currentLocations = selectedFilters.locations || [];
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter(l => l !== location)
      : [...currentLocations, location];
    
    setSelectedFilters({
      ...selectedFilters,
      locations: newLocations
    });
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>Filtros</Text>
        
        <ScrollView>
          <Text>Tipos de Arte</Text>
          {artTypes.map(type => (
            <Checkbox.Item
              key={type}
              label={type}
              status={
                (selectedFilters.artTypes || []).includes(type) 
                  ? 'checked' 
                  : 'unchecked'
              }
              onPress={() => toggleArtType(type)}
            />
          ))}

          <Text>Localizações</Text>
          {locations.map(location => (
            <Checkbox.Item
              key={location}
              label={location}
              status={
                (selectedFilters.locations || []).includes(location) 
                  ? 'checked' 
                  : 'unchecked'
              }
              onPress={() => toggleLocation(location)}
            />
          ))}

          <Text>Experiência Mínima</Text>
          <Slider
            value={selectedFilters.minExperience || 0}
            minimumValue={0}
            maximumValue={20}
            step={1}
            onValueChange={(value) => 
              setSelectedFilters({
                ...selectedFilters,
                minExperience: value
              })
            }
          />
          <Text style={styles.sliderText}>
            {selectedFilters.minExperience || 0} anos
          </Text>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={onClose}
          >
            Cancelar
          </Button>
          <Button 
            mode="contained" 
            onPress={() => onApplyFilters(selectedFilters)}
          >
            Aplicar
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  sliderText: {
    textAlign: 'center',
    marginTop: 10,
  },
});

export default FilterModal;