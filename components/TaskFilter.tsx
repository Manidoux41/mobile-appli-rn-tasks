import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type FilterType = 'all' | 'today' | 'tomorrow' | 'thisWeek' | 'thisMonth' | 'overdue' | 'completed';

interface TaskFilterProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TaskFilter({ selectedFilter, onFilterChange }: TaskFilterProps) {
  const filters: { key: FilterType; label: string; icon: string }[] = [
    { key: 'all', label: 'Toutes', icon: 'list' },
    { key: 'today', label: "Aujourd'hui", icon: 'today' },
    { key: 'tomorrow', label: 'Demain', icon: 'arrow-forward' },
    { key: 'thisWeek', label: 'Cette semaine', icon: 'calendar' },
    { key: 'thisMonth', label: 'Ce mois', icon: 'calendar-outline' },
    { key: 'overdue', label: 'En retard', icon: 'warning' },
    { key: 'completed', label: 'Terminées', icon: 'checkmark-circle' },
  ];

  const renderFilter = (filter: { key: FilterType; label: string; icon: string }) => {
    const isActive = selectedFilter === filter.key;
    
    return (
      <View
        key={filter.key}
        style={[
          styles.filterButton,
          isActive && styles.activeFilterButton,
        ]}
        onTouchEnd={() => onFilterChange(filter.key)}
      >
        <Ionicons
          name={filter.icon as any}
          size={16}
          color={isActive ? '#fff' : '#007AFF'}
          style={styles.filterIcon}
        />
        <Text
          style={[
            styles.filterText,
            isActive && styles.activeFilterText,
          ]}
        >
          {filter.label}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrer par :</Text>
      <View style={styles.filtersContainer}>
        {filters.map(renderFilter)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },
  activeFilterText: {
    color: '#fff',
  },
});
