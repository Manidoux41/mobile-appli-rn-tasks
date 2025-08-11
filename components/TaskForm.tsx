import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputField, Button } from './ui';
import { DatePickerField } from './DatePickerField';
import { PriorityPicker } from './PriorityPicker';

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<void>;
  loading?: boolean;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Log when modal visibility changes
  React.useEffect(() => {
    console.log('📝 TaskForm visibility changed:', visible);
  }, [visible]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Erreur', 'Le titre de la tâche est requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      resetForm();
      onClose();
      Alert.alert('Succès', 'Tâche créée avec succès');
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Erreur lors de la création de la tâche'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return 'Non définie';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Nouvelle tâche</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>
            
            <InputField
              label="Titre de la tâche *"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Entrez le titre de la tâche"
            />

            <InputField
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Description détaillée de la tâche"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paramètres</Text>
            
            <TouchableOpacity style={styles.priorityButton}>
              <View style={styles.priorityContent}>
                <Text style={styles.priorityLabel}>Priorité</Text>
                <View style={styles.priorityIndicator}>
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor(formData.priority) }
                    ]}
                  />
                  <Text style={styles.priorityText}>
                    {getPriorityLabel(formData.priority)}
                  </Text>
                </View>
              </View>
              <PriorityPicker
                value={formData.priority}
                onValueChange={(priority) => setFormData({ ...formData, priority })}
              />
            </TouchableOpacity>

            <DatePickerField
              label="Date d'échéance"
              value={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
              placeholder="Sélectionner une date"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Annuler"
            onPress={handleClose}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title="Créer la tâche"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={!formData.title.trim() || isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  priorityContent: {
    flex: 1,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
