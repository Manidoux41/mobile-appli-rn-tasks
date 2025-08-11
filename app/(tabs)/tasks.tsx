import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TaskCard } from '../../components/TaskCard';
import { TaskFilter, FilterType } from '../../components/TaskFilter';
import { InputField, Button } from '../../components/ui';
import { DatePickerField } from '../../components/DatePickerField';
import { PriorityPicker } from '../../components/PriorityPicker';
import { SafeTouchableOpacity } from '../../components/SafeTouchableOpacity';
import { Logo } from '../../components/Logo';
import { apiService, Task, TaskData } from '../../utils/api';
import { removeToken } from '../../utils/auth';
import { filterTasksByDate, sortTasksByDate } from '../../utils/dateFilters';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [formData, setFormData] = useState<TaskData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });
  const [formErrors, setFormErrors] = useState<Partial<TaskData>>({});
  const router = useRouter();

  // Calcul des tâches filtrées et triées
  const filteredAndSortedTasks = React.useMemo(() => {
    const filtered = filterTasksByDate(tasks, selectedFilter);
    return sortTasksByDate(filtered);
  }, [tasks, selectedFilter]);

  const loadTasks = useCallback(async (): Promise<void> => {
    try {
      const tasks = await apiService.getTasks();
      setTasks(tasks);
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Impossible de charger les tâches. Vérifiez votre connexion.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const onRefresh = (): void => {
    setRefreshing(true);
    loadTasks();
  };

  const handleLogout = async (): Promise<void> => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await removeToken();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const resetForm = (): void => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    });
    setFormErrors({});
    setEditingTask(null);
  };

  const openCreateModal = (): void => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (task: Task): void => {
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate.split('T')[0], // Format YYYY-MM-DD
      priority: task.priority,
    });
    setEditingTask(task);
    setModalVisible(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<TaskData> = {};

    if (!formData.title.trim()) {
      errors.title = 'Titre requis';
    }

    if (!formData.dueDate) {
      errors.dueDate = 'Date d\'échéance requise';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      if (editingTask) {
        await apiService.updateTask(editingTask._id, formData);
        Alert.alert('Succès', 'Tâche modifiée avec succès');
      } else {
        await apiService.createTask(formData);
        Alert.alert('Succès', 'Tâche créée avec succès');
      }
      setModalVisible(false);
      loadTasks();
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    }
  };

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      Alert.alert('Succès', 'Tâche supprimée');
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Impossible de supprimer la tâche'
      );
    }
  };

  const handleToggleComplete = async (taskId: string): Promise<void> => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;
      
      await apiService.toggleTaskComplete(taskId, !task.completed);
      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Impossible de modifier la tâche'
      );
    }
  };

  const updateFormField = (field: keyof TaskData, value: string | 'low' | 'medium' | 'high'): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onEdit={openEditModal}
      onDelete={handleDeleteTask}
      onToggleComplete={handleToggleComplete}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Aucune tâche</Text>
      <Text style={styles.emptySubtext}>Créez votre première tâche !</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Logo size={40} />
          <Text style={styles.title}>Mes Tâches</Text>
        </View>
        <SafeTouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
        </SafeTouchableOpacity>
      </View>

      <TaskFilter
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <FlatList
        data={filteredAndSortedTasks}
        renderItem={renderTask}
        keyExtractor={(item: Task) => item._id}
        style={styles.list}
        contentContainerStyle={filteredAndSortedTasks.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {filteredAndSortedTasks.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {filteredAndSortedTasks.length} tâche{filteredAndSortedTasks.length > 1 ? 's' : ''} 
            {selectedFilter !== 'all' && ` (${selectedFilter})`}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </Text>
            <View style={styles.modalCloseButton} />
          </View>

          <View style={styles.modalContent}>
            <InputField
              label="Titre"
              value={formData.title}
              onChangeText={(value: string) => updateFormField('title', value)}
              placeholder="Entrez le titre de la tâche"
              error={formErrors.title}
            />

            <InputField
              label="Description (optionnel)"
              value={formData.description}
              onChangeText={(value: string) => updateFormField('description', value)}
              placeholder="Ajoutez une description"
              error={formErrors.description}
            />

            <DatePickerField
              label="Date d'échéance"
              value={formData.dueDate}
              onChangeText={(value: string) => updateFormField('dueDate', value)}
              error={formErrors.dueDate}
            />

            <PriorityPicker
              label="Priorité"
              value={formData.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') => updateFormField('priority', value)}
              error={formErrors.priority}
            />

            <Button
              title={editingTask ? 'Modifier' : 'Créer'}
              onPress={handleSubmit}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCloseButton: {
    minWidth: 60,
  },
  modalCloseText: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
