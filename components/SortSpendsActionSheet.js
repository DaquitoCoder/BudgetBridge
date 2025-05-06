import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Feather } from '@expo/vector-icons';

const SortSpendsActionSheet = React.forwardRef(({ 
  currentSort, 
  onApplySort 
}, ref) => {
  const sortOptions = [
    {
      type: 'date',
      label: 'Fecha',
      ascLabel: 'Más antiguos primero',
      descLabel: 'Más recientes primero',
      ascIcon: 'arrow-up',
      descIcon: 'arrow-down'
    },
    {
      type: 'name',
      label: 'Nombre',
      ascLabel: 'A → Z',
      descLabel: 'Z → A',
      ascIcon: 'arrow-up',
      descIcon: 'arrow-down'
    }
  ];

  const handleSortPress = (sortType) => {
    let newSort;
    
    if (currentSort.field === sortType) {
      // Cambiar dirección si es el mismo campo
      newSort = {
        field: sortType,
        direction: currentSort.direction === 'desc' ? 'asc' : 'desc'
      };
    } else {
      // Cambiar a nuevo campo con dirección descendente por defecto
      newSort = {
        field: sortType,
        direction: 'desc'
      };
    }
    
    onApplySort(newSort);
    ref.current?.hide();
  };

  return (
    <ActionSheet 
      ref={ref}
      containerStyle={styles.container}
      gestureEnabled={true}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Ordenar Gastos</Text>
      </View>

      {sortOptions.map((option) => (
        <View key={option.type} style={styles.section}>
          <Text style={styles.optionLabel}>{option.label}</Text>
          <TouchableOpacity 
            style={[
              styles.sortButton,
              currentSort.field === option.type && styles.activeSortButton
            ]}
            onPress={() => handleSortPress(option.type)}
          >
            <Feather 
              name={currentSort.field === option.type 
                ? (currentSort.direction === 'desc' ? option.descIcon : option.ascIcon)
                : 'chevron-right'} 
              size={20} 
              color={currentSort.field === option.type ? "#8CE3C3" : "#FFFFFF"} 
            />
            <Text style={styles.sortText}>
              {currentSort.field === option.type
                ? (currentSort.direction === 'desc' ? option.descLabel : option.ascLabel)
                : `Ordenar por ${option.label.toLowerCase()}`}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ActionSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#2A3038',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  optionLabel: {
    color: '#9E9E9E',
    fontSize: 14,
    marginBottom: 5,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#3A424D',
    borderRadius: 10,
  },
  activeSortButton: {
    borderColor: '#8CE3C3',
    borderWidth: 1,
  },
  sortText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SortSpendsActionSheet;