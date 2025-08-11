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
import { User, Task } from '../utils/api';
import { UserSelector } from './UserSelector';

interface TaskAssignmentModalProps {
  visible: boolean;
  onClose: () => void;
  onAssign: (taskId: string, userId: string) => Promise<void>;
  users: User[];
  tasks: Task[];
  loading?: boolean;
}

export const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({
  visible,
  onClose,
  onAssign,
  users,
  tasks,
  loading = false,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const canAssign = Boolean(selectedTaskId && selectedUserId && !isAssigning);

  // Permettre la sélection de TOUTES les tâches (pour ré-attribuer si besoin)
  const availableTasks = tasks;

  console.log('🔍 TaskAssignmentModal - Tâches totales:', tasks.length);
  console.log('🔍 TaskAssignmentModal - Tâches disponibles:', availableTasks.length);
  console.log('🔍 TaskAssignmentModal - Utilisateurs:', users.length);

  const selectedTask = availableTasks.find(task => task._id === selectedTaskId);
  const selectedUser = users.find(user => user._id === selectedUserId);

  // Logs de diagnostic
  if (visible) {
    console.log('🧪 AssignModal state => task:', selectedTaskId, 'user:', selectedUserId, 'canAssign:', canAssign);
  }

  const resetForm = () => {
    setSelectedTaskId('');
    setSelectedUserId('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAssign = async () => {
    console.log('🚀 ASSIGN BUTTON PRESSED');
    console.log('📝 Selected Task ID:', selectedTaskId);
    console.log('👤 Selected User ID:', selectedUserId);
    console.log('🔍 Can Assign:', canAssign);
    
    if (!selectedTaskId || !selectedUserId) {
      const msg = `Sélection manquante - Task: ${selectedTaskId ? 'OK' : 'MANQUE'}, User: ${selectedUserId ? 'OK' : 'MANQUE'}`;
      console.log('❌', msg);
      Alert.alert('Erreur', msg);
      return;
    }

    setIsAssigning(true);
    console.log('⏳ Starting assignment...');
    
    try {
      console.log('🔄 Calling onAssign function...');
      await onAssign(selectedTaskId, selectedUserId);
      console.log('✅ Assignment completed successfully!');
      Alert.alert('Succès', `Tâche attribuée à ${selectedUser?.name}`);
      handleClose();
    } catch (error) {
      console.error('❌ Assignment failed with error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Erreur', `Assignment failed: ${error?.message || String(error)}`);
    } finally {
      console.log('🏁 Assignment process finished');
      setIsAssigning(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#3B82F6';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
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
            <Text style={styles.title}>Attribuer une tâche</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Section: Sélectionner une tâche */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Sélectionner une tâche ({availableTasks.length} au total)
              </Text>
              
              {availableTasks.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="clipboard-outline" size={48} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>Aucune tâche disponible</Text>
                  <Text style={styles.emptyStateSubtext}>
                    {tasks.length === 0 
                      ? "Aucune tâche dans le système. Créez d'abord des tâches."
                      : "Aucune tâche à afficher"}
                  </Text>
                </View>
              ) : (
                <View style={styles.taskList}>
                  {availableTasks.map((task) => (
                    <TouchableOpacity
                      key={task._id}
                      style={[
                        styles.taskItem,
                        selectedTaskId === task._id && styles.selectedTaskItem
                      ]}
                      onPress={() => {
                        setSelectedTaskId(task._id);
                        console.log('✅ Tâche sélectionnée:', task._id, task.title);
                      }}
                    >
                      <View style={styles.taskHeader}>
                        <View style={[
                          styles.priorityDot,
                          { backgroundColor: getPriorityColor(task.priority) }
                        ]} />
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        {selectedTaskId === task._id && (
                          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        )}
                      </View>
                      {task.description && (
                        <Text style={styles.taskDescription} numberOfLines={2}>
                          {task.description}
                        </Text>
                      )}
                      <View style={styles.taskMeta}>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(task.status) }
                        ]}>
                          <Text style={styles.statusText}>
                            {task.status === 'pending' ? 'En attente' :
                             task.status === 'in_progress' ? 'En cours' : 'Terminé'}
                          </Text>
                        </View>
                        <Text style={styles.priorityText}>
                          Priorité {task.priority === 'high' ? 'haute' : 
                                   task.priority === 'medium' ? 'moyenne' : 'basse'}
                        </Text>
                      </View>
                      {task.assignedTo && (
                        <Text style={styles.assignedToText}>
                          {(() => {
                            const u = users.find(u => u._id === task.assignedTo);
                            return u ? `Attribuée à ${u.name}` : 'Attribuée';
                          })()}
                        </Text>
                      )}
                      {task.dueDate && (
                        <Text style={styles.dueDateText}>
                          Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Section: Sélectionner un utilisateur */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attribuer à</Text>
              
              <TouchableOpacity
                style={styles.userSelectorButton}
                onPress={() => {
                  if (!users || users.length === 0) {
                    Alert.alert('Aucun utilisateur', "Aucun utilisateur n'est disponible. Créez d'abord un utilisateur.");
                    return;
                  }
                  setShowUserSelector(true);
                }}
              >
                <View style={styles.userSelectorContent}>
                  {selectedUser ? (
                    <View style={styles.selectedUserContainer}>
                      <View style={[
                        styles.userAvatar,
                        { backgroundColor: selectedUser.role === 'admin' ? '#EF4444' : '#2563EB' }
                      ]}>
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
                      Choisir un utilisateur
                    </Text>
                  )}
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>

              {/* Liste directe des utilisateurs pour sélection rapide */}
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.sectionTitle, { fontSize: 14, marginBottom: 8 }]}>
                  Ou sélectionner directement:
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={{ flexDirection: 'row' }}
                >
                  {users.map((user) => (
                    <TouchableOpacity
                      key={user._id}
                      style={[
                        {
                          padding: 12,
                          marginRight: 8,
                          backgroundColor: '#F9FAFB',
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: selectedUserId === user._id ? '#2563EB' : '#E5E7EB',
                          alignItems: 'center',
                          minWidth: 80
                        },
                        selectedUserId === user._id && { backgroundColor: '#EFF6FF' }
                      ]}
                      onPress={() => {
                        console.log('👤 Sélection directe utilisateur:', user._id, user.name);
                        setSelectedUserId(user._id);
                      }}
                    >
                      <View style={[
                        {
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: user.role === 'admin' ? '#EF4444' : '#2563EB',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 4
                        }
                      ]}>
                        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={{ 
                        fontSize: 12, 
                        color: '#111827', 
                        textAlign: 'center',
                        fontWeight: selectedUserId === user._id ? '600' : '400'
                      }}>
                        {user.name}
                      </Text>
                      {selectedUserId === user._id && (
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginTop: 2 }} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>

          {/* Boutons d'action */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.assignButton,
                (!canAssign) && styles.disabledButton
              ]}
              onPress={() => {
                console.log('🟦 ASSIGN BUTTON TAPPED! canAssign:', canAssign);
                handleAssign();
              }}
              disabled={!canAssign}
            >
              {isAssigning ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.assignButtonText}>Attribuer</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Debug test button */}
          {__DEV__ && availableTasks.length > 0 && users.length > 0 && (
            <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#10B981',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginBottom: 8
                }}
                onPress={async () => {
                  const testTaskId = availableTasks[0]._id;
                  const testUserId = users[0]._id;
                  console.log('🧪 TEST ASSIGNMENT - Task:', testTaskId, 'User:', testUserId);
                  try {
                    await onAssign(testTaskId, testUserId);
                    Alert.alert('Test Success', 'Assignment worked!');
                  } catch (error) {
                    console.error('🧪 TEST FAILED:', error);
                    Alert.alert('Test Failed', String(error));
                  }
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>🧪 TEST ASSIGN</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  backgroundColor: '#3B82F6',
                  padding: 8,
                  borderRadius: 8,
                  alignItems: 'center'
                }}
                onPress={() => {
                  const testUserId = users[0]._id;
                  console.log('🧪 FORCE SELECT USER:', testUserId, users[0].name);
                  setSelectedUserId(testUserId);
                }}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>🧪 Force Select First User</Text>
              </TouchableOpacity>
            </View>
          )}
          {(!selectedTaskId || !selectedUserId) && (
            <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
              <Text style={{ color: '#6B7280', fontSize: 12 }}>
                {!selectedTaskId && !selectedUserId
                  ? 'Sélectionnez une tâche et un utilisateur pour continuer'
                  : !selectedTaskId
                    ? 'Sélectionnez une tâche pour continuer'
                    : 'Choisissez un utilisateur pour continuer'}
              </Text>
            </View>
          )}
        </View>
      </Modal>

      <UserSelector
        visible={showUserSelector}
        users={users}
        selectedUserId={selectedUserId}
        onSelectUser={(userId) => {
          console.log('✅ Utilisateur sélectionné dans modal:', userId);
          setSelectedUserId(userId);
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedTaskItem: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  priorityText: {
    fontSize: 12,
    color: '#6B7280',
  },
  dueDateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  userSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userSelectorContent: {
    flex: 1,
  },
  selectedUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedUserInfo: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  selectedUserEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  userSelectorPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  disabledText: {
    color: '#D1D5DB',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  assignButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  assignedToText: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
