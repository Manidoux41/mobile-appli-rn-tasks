import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeTouchableOpacity } from './SafeTouchableOpacity';

interface PriorityPickerProps {
  label: string;
  value: 'low' | 'medium' | 'high';
  onValueChange: (priority: 'low' | 'medium' | 'high') => void;
  error?: string;
}

export function PriorityPicker({
  label,
  value,
  onValueChange,
  error,
}: PriorityPickerProps) {
  const priorities = [
    { key: 'low' as const, label: 'Faible', color: '#44ff44' },
    { key: 'medium' as const, label: 'Moyenne', color: '#ffaa00' },
    { key: 'high' as const, label: 'Élevée', color: '#ff4444' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
            <View style={styles.optionsContainer}>
        {priorities.map((priority) => (
          <SafeTouchableOpacity
            key={priority.key}
            style={[
              styles.option,
              value === priority.key && styles.selectedOption,
              { borderColor: priority.color },
            ]}
            onPress={() => onValueChange(priority.key)}
          >
            <View style={[styles.dot, { backgroundColor: priority.color }]} />
            <Text
              style={[
                styles.optionText,
                value === priority.key && styles.selectedOptionText,
              ]}
            >
              {priority.label}
            </Text>
          </SafeTouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
    borderWidth: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedText: {
    color: '#333',
    fontWeight: '600',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
});
