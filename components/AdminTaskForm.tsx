import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../utils/api';
import { InputField, Button } from './ui';
import { UserSelector } from './UserSelector';
import { DatePickerField } from './DatePickerField';
import { PriorityPicker } from './PriorityPicker';

interface AdminTaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: AdminTaskFormData) => Promise<void>;
  users: User[];
  loading?: boolean;
}

export interface AdminTaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  category?: string;
}

export const AdminTaskForm: React.FC<AdminTaskFormProps> = ({
  visible,
  onClose,
  onSubmit,
  users,
  loading = false,
}) => {
  // Debug: logs pour voir les utilisateurs
  React.useEffect(() => {
    if (visible) {
      console.log('AdminTaskForm ouvert avec', users.length, 'utilisateurs:', users);
    }
  }, [visible, users]);

  const [formData, setFormData] = useState<AdminTaskFormData>({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: null,
    category: '',
  });
  
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: null,
      category: '',
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
    if (!formData.assignedTo) {
      Alert.alert('Erreur', 'Veuillez sélectionner un utilisateur');
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

  const selectedUser = users.find(user => user._id === formData.assignedTo);

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
    <>
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
            <Text style={styles.title}>Nouvelle tâche admin</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations de base</Text>
              
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

              <InputField
                label="Catégorie"
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
                placeholder="Catégorie (optionnel)"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attribution</Text>
              
              <TouchableOpacity
                style={styles.userSelectorButton}
                onPress={() => setShowUserSelector(true)}
              >
                <View style={styles.userSelectorContent}>
                  <Text style={styles.userSelectorLabel}>Assigner à *</Text>
                  {selectedUser ? (
                    <View style={styles.selectedUserContainer}>
                      <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarText}>
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.selectedUserInfo}>
                        <Text style={styles.selectedUserName}>{selectedUser.name}</Text>
                        <Text style={styles.selectedUserEmail}>{selectedUser.email}</Text>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.userSelectorPlaceholder}>
                      Sélectionner un utilisateur
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
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
              disabled={!formData.title.trim() || !formData.assignedTo || isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </View>
      </Modal>

      <UserSelector
        visible={showUserSelector}
        users={users}
        selectedUserId={formData.assignedTo}
        onSelectUser={(userId) => {
          setFormData({ ...formData, assignedTo: userId });
          setShowUserSelector(false);
        }}
        onClose={() => setShowUserSelector(false)}
      />
    </>
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
  userSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userSelectorContent: {
    flex: 1,
  },
  userSelectorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  selectedUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedUserInfo: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  selectedUserEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  userSelectorPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
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
