import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../utils/api';

interface UserSelectorProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  visible: boolean;
  onClose: () => void;
}

export function UserSelector({ 
  users, 
  selectedUserId, 
  onSelectUser, 
  visible, 
  onClose 
}: UserSelectorProps) {
  const selectedUser = users.find(user => user._id === selectedUserId);

  return (
    <Modal
      visible={visible}
  animationType="slide"
      onRequestClose={onClose}
  transparent={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sélectionner un utilisateur</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.userList}>
          {users.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucun utilisateur disponible</Text>
              <Text style={styles.emptyStateSubtext}>
                Chargement en cours ou aucun utilisateur trouvé
              </Text>
            </View>
          ) : (
            users.map((user) => (
            <TouchableOpacity
              key={user._id}
              style={[
                styles.userItem,
                selectedUserId === user._id && styles.selectedUserItem
              ]}
              onPress={() => {
                console.log('👤 Sélection utilisateur:', user._id, user.name);
                onSelectUser(user._id);
                onClose();
              }}
            >
              <View style={styles.userInfo}>
                <View style={[
                  styles.avatar,
                  { backgroundColor: user.role === 'admin' ? '#EF4444' : '#2563EB' }
                ]}>
                  <Text style={styles.avatarText}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <View style={styles.roleContainer}>
                    <View style={[
                      styles.roleBadge,
                      { backgroundColor: user.role === 'admin' ? '#FEE2E2' : '#DBEAFE' }
                    ]}>
                      <Text style={[
                        styles.roleText,
                        { color: user.role === 'admin' ? '#DC2626' : '#2563EB' }
                      ]}>
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {selectedUserId === user._id && (
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              )}
            </TouchableOpacity>
          ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  userList: {
    flex: 1,
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedUserItem: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});
