import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { SafeTouchableOpacity } from './SafeTouchableOpacity';

interface DatePickerFieldProps {
  label: string;
  value: string; // Format YYYY-MM-DD
  onChangeText: (date: string) => void;
  error?: string;
  placeholder?: string;
}

export function DatePickerField({
  label,
  value,
  onChangeText,
  error,
  placeholder = 'Sélectionner une date',
}: DatePickerFieldProps) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });

  const formatDate = (dateObj: Date): string => {
    return dateObj.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateForApi = (dateObj: Date): string => {
    return dateObj.toISOString().split('T')[0]; // Format YYYY-MM-DD
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    onChangeText(formatDateForApi(currentDate));
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const displayText = value ? formatDate(new Date(value)) : placeholder;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <SafeTouchableOpacity
        style={[styles.dateButton, error ? styles.dateButtonError : null]}
        onPress={showDatepicker}
      >
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {displayText}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
      </SafeTouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}
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
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateButtonError: {
    borderColor: '#ff4444',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
});
