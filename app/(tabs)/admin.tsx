import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { apiService, User } from '../../utils/api';
import { getUserRole } from '../../utils/auth';
import { InputField, Button } from '../../components/ui';

interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createUserForm, setCreateUserForm] = useState<CreateUserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    checkAdminAccess();
    loadUsers();
  }, []);

  const checkAdminAccess = async () => {
    const role = await getUserRole();
    if (role !== 'admin') {
      Alert.alert('Accès refusé', 'Vous devez être administrateur pour accéder à cette page');
      router.back();
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersArray = await apiService.getUsers();
      console.log('Users loaded:', usersArray); // Debug log
      
      // Ensure it's an array
      if (Array.isArray(usersArray)) {
        setUsers(usersArray);
      } else {
        console.error('Invalid users response:', usersArray);
        setUsers([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      Alert.alert('Erreur', 'Impossible de charger la liste des utilisateurs');
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleCreateUser = async () => {
    if (!createUserForm.name.trim() || !createUserForm.email.trim() || !createUserForm.password.trim()) {
      Alert.alert('Erreur', 'Tous les champs sont requis');
      return;
    }

    try {
      await apiService.createUser({
        name: createUserForm.name,
        email: createUserForm.email,
        password: createUserForm.password,
        username: createUserForm.email, // Utiliser l'email comme username
        role: createUserForm.role,
      });
      await loadUsers();
      setShowCreateUserModal(false);
      setCreateUserForm({ name: '', email: '', password: '', role: 'user' });
      Alert.alert('Succès', 'Utilisateur créé avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer l\'utilisateur');
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await apiService.updateUserRole(userId, newRole);
      await loadUsers();
      Alert.alert('Succès', 'Rôle utilisateur mis à jour');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le rôle');
    }
  };

  const UserCard = ({ user }: { user: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.roleContainer}>
            <View style={[
              styles.roleBadge,
              { backgroundColor: user.role === 'admin' ? '#EF4444' : '#10B981' }
            ]}>
              <Text style={styles.roleText}>
                {user.role === 'admin' ? 'ADMIN' : 'UTILISATEUR'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.roleToggleButton}
        onPress={() => handleChangeUserRole(
          user._id,
          user.role === 'admin' ? 'user' : 'admin'
        )}
      >
        <Ionicons
          name={user.role === 'admin' ? 'remove-circle-outline' : 'shield-outline'}
          size={20}
          color={user.role === 'admin' ? '#EF4444' : '#2563EB'}
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gestion des utilisateurs</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateUserModal(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{users?.length || 0}</Text>
              <Text style={styles.statLabel}>Total utilisateurs</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {users?.filter(u => u.role === 'admin')?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Administrateurs</Text>
            </View>
          </View>

          <View style={styles.usersList}>
            {users?.map(user => (
              <UserCard key={user._id} user={user} />
            )) || []}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de création d'utilisateur */}
      <Modal
        visible={showCreateUserModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateUserModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateUserModal(false)}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nouvel utilisateur</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            <InputField
              label="Nom complet"
              value={createUserForm.name}
              onChangeText={(text) => setCreateUserForm({ ...createUserForm, name: text })}
              placeholder="Nom de l'utilisateur"
            />

            <InputField
              label="Email"
              value={createUserForm.email}
              onChangeText={(text) => setCreateUserForm({ ...createUserForm, email: text })}
              placeholder="email@exemple.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="Mot de passe"
              value={createUserForm.password}
              onChangeText={(text) => setCreateUserForm({ ...createUserForm, password: text })}
              placeholder="Mot de passe"
              secureTextEntry
            />

            <View style={styles.roleSelector}>
              <Text style={styles.roleSelectorLabel}>Rôle</Text>
              <View style={styles.roleOptions}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    createUserForm.role === 'user' && styles.roleOptionSelected
                  ]}
                  onPress={() => setCreateUserForm({ ...createUserForm, role: 'user' })}
                >
                  <Text style={[
                    styles.roleOptionText,
                    createUserForm.role === 'user' && styles.roleOptionTextSelected
                  ]}>
                    Utilisateur
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    createUserForm.role === 'admin' && styles.roleOptionSelected
                  ]}
                  onPress={() => setCreateUserForm({ ...createUserForm, role: 'admin' })}
                >
                  <Text style={[
                    styles.roleOptionText,
                    createUserForm.role === 'admin' && styles.roleOptionTextSelected
                  ]}>
                    Administrateur
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Annuler"
              onPress={() => setShowCreateUserModal(false)}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title="Créer"
              onPress={handleCreateUser}
              style={styles.createButton}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563EB',
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  usersList: {
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  roleContainer: {
    marginTop: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  roleToggleButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 24,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  roleSelector: {
    marginBottom: 16,
  },
  roleSelectorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  roleOptionSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
  },
  roleOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  roleOptionTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 1,
  },
});
