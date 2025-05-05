import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Ionicons } from '@expo/vector-icons';

const FilterSpendsActionSheet = React.forwardRef(({ 
  currentFilters,
  onApplyFilters,
  categories 
}, ref) => {
  const [tempFilters, setTempFilters] = React.useState(currentFilters);

  const toggleCategory = (category) => {
    setTempFilters(prev => ({
      ...prev,
      category: prev.category === category ? null : category
    }));
  };

  React.useEffect(() => {
    setTempFilters(currentFilters);
  }, [currentFilters]);

  const resetFilters = () => {
    const newFilters = {
      category: null,
      minAmount: null,
      maxAmount: null,
      dateRange: null
    };

    setTempFilters(newFilters);
    onApplyFilters(newFilters); 
    
  };

  return (
    <ActionSheet 
      ref={ref}
      containerStyle={styles.container}
      gestureEnabled={true}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Filtrar Gastos</Text>
        <TouchableOpacity onPress={() => {
          resetFilters();
          ref.current?.hide();
        }}
        >
          <Text style={styles.resetText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>

      {/* Filtro por Categoría */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                tempFilters.category === cat && styles.selectedPill
              ]}
              onPress={() => toggleCategory(cat)}
            >
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filtro por Monto */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rango de Monto</Text>
        <View style={styles.amountRow}>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Mínimo"
              keyboardType="numeric"
              value={tempFilters.minAmount?.toString()}
              onChangeText={(text) => 
                setTempFilters({...tempFilters, minAmount: text ? parseFloat(text) : null})
              }
            />
          </View>
          <Text style={styles.toText}>a</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Máximo"
              keyboardType="numeric"
              value={tempFilters.maxAmount?.toString()}
              onChangeText={(text) => 
                setTempFilters({...tempFilters, maxAmount: text ? parseFloat(text) : null})
              }
            />
          </View>
        </View>
      </View>

      {/* Botón Aplicar */}
      <TouchableOpacity 
        style={styles.applyButton}
        onPress={() => {
          onApplyFilters(tempFilters);
          ref.current?.hide();
        }}
      >
        <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
      </TouchableOpacity>
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
  resetText: {
    color: '#8CE3C3',
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#3A424D',
    borderRadius: 15,
  },
  selectedPill: {
    backgroundColor: '#8CE3C3',
  },
  categoryText: {
    color: '#FFFFFF',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A424D',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  currency: {
    color: '#8CE3C3',
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    color: '#FFFFFF',
  },
  toText: {
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#8CE3C3',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: '#1E2429',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FilterSpendsActionSheet;