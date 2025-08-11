import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { isAuthenticated, getCurrentUser } from '../../utils/auth';
import { apiService, Task, User } from '../../utils/api';
import { Logo } from '../../components/Logo';
import { UserSelector } from '../../components/UserSelector';
import { InputField, Button } from '../../components/ui';
import { DatePickerField } from '../../components/DatePickerField';
import { PriorityPicker } from '../../components/PriorityPicker';
import { TaskAssignmentModal } from '../../components/TaskAssignmentModal';
import { TaskForm } from '../../components/TaskForm';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  todayTasks: number;
  overdueTasks: number;
  completionRate: number;
  totalUsers?: number;
  activeUsers?: number;
  highPriorityTasks?: number;
  mediumPriorityTasks?: number;
  lowPriorityTasks?: number;
  tasksCreatedToday?: number;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  userId?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    todayTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    userId: '',
  });
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (userRole) {
      loadDashboardData();
    }
  }, [userRole]);

  const initializeApp = async () => {
    await checkAuth();
  };

  const checkAuth = async () => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      router.replace('/login');
      return;
    }
    
    const user = await getCurrentUser();
    if (user?.email) {
      console.log('👤 Utilisateur connecté:', user);
      console.log('🎭 Rôle détecté:', user.role);
      setUserName(user.email.split('@')[0]);
      setUserRole(user.role || 'user');
      console.log('✅ UserRole défini à:', user.role || 'user');
    }
  };

  const loadDashboardData = async () => {
    try {
      console.log('🔍 Dashboard - userRole:', userRole);
      console.log('🔍 Dashboard - type de userRole:', typeof userRole);
      
      if (userRole === 'admin') {
        console.log('👑 Chargement des données admin...');
        // Charger les données admin
  const [statsResponse, usersResponse, tasksResponse] = await Promise.all([
          apiService.getAdminStats(),
          apiService.getUsers(),
          apiService.getTasks(),
        ]);
        
  console.log('📊 Statistiques admin reçues:', statsResponse);
        console.log('👥 Utilisateurs reçus:', usersResponse?.length || 0, 'utilisateurs');
        console.log('📋 Tâches reçues:', tasksResponse?.length || 0, 'tâches');
        console.log('📋 Détail des tâches:', tasksResponse);
        
        // Calculer les statistiques complètes
  const safeTasksArray = Array.isArray(tasksResponse) ? tasksResponse : [];
  const safeUsersArray = Array.isArray(usersResponse) ? usersResponse : [];

  // Le backend renvoie { stats: {...} } – normaliser la forme
  const statsPayload = (statsResponse as any)?.stats ?? statsResponse ?? {};
        
        const today = new Date().toDateString();
        const todayTasks = safeTasksArray.filter(task => 
          new Date(task.createdAt).toDateString() === today
        ).length;
        
        const overdueTasks = safeTasksArray.filter(task => {
          if (!task.dueDate || task.status === 'completed') return false;
          return new Date(task.dueDate) < new Date();
        }).length;
        
        const completionRate = (statsPayload.totalTasks ?? 0) > 0 
          ? Math.round(((statsPayload.completedTasks ?? 0) / (statsPayload.totalTasks ?? 0)) * 100)
          : 0;
        
        setStats({
          ...statsPayload,
          todayTasks,
          overdueTasks,
          completionRate,
          totalUsers: safeUsersArray.length,
        });
        setUsers(safeUsersArray);
        setAllTasks(safeTasksArray); // Stocker toutes les tâches pour l'attribution
        setRecentTasks(safeTasksArray.slice(0, 5));
      } else {
        // Charger les données utilisateur normal
        const tasks = await apiService.getTasks();
        const safeTasksArray = Array.isArray(tasks) ? tasks : [];
        calculateStats(safeTasksArray);
        setRecentTasks(safeTasksArray.slice(0, 5));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      console.error('Détails de l\'erreur:', JSON.stringify(error, null, 2));
      
      // Vérifier si l'utilisateur est toujours authentifié après l'erreur
      const stillAuthenticated = await isAuthenticated();
      if (!stillAuthenticated) {
        console.log('🚪 Utilisateur déconnecté automatiquement, redirection...');
        router.replace('/login');
        return;
      }
      
      // Initialiser avec des valeurs par défaut en cas d'erreur
      setStats({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        todayTasks: 0,
        overdueTasks: 0,
        completionRate: 0,
      });
      setRecentTasks([]);
      setUsers([]);
    }
  };

  const calculateStats = (tasks: Task[]) => {
    // Vérification de sécurité
    const safeTasksArray = Array.isArray(tasks) ? tasks : [];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const totalTasks = safeTasksArray.length;
    const completedTasks = safeTasksArray.filter(task => task.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;
    
    const todayTasks = safeTasksArray.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === today.toDateString();
    }).length;
    
    const overdueTasks = safeTasksArray.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const taskDate = new Date(task.dueDate);
      return taskDate < today;
    }).length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    setStats({
      totalTasks,
      completedTasks,
      pendingTasks,
      todayTasks,
      overdueTasks,
      completionRate,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleCreateTask = async () => {
    if (!taskFormData.title.trim()) {
      Alert.alert('Erreur', 'Le titre de la tâche est requis');
      return;
    }

    if (userRole === 'admin' && !selectedUserId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un utilisateur');
      return;
    }

    try {
      if (userRole === 'admin') {
        await apiService.assignTask({
          title: taskFormData.title,
          description: taskFormData.description,
          dueDate: taskFormData.dueDate,
          priority: taskFormData.priority,
          assignedTo: selectedUserId,
        });
      } else {
        await apiService.createTask({
          title: taskFormData.title,
          description: taskFormData.description,
          dueDate: taskFormData.dueDate,
          priority: taskFormData.priority,
        });
      }

      setShowCreateTaskModal(false);
      setTaskFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        userId: '',
      });
      setSelectedUserId('');
      await loadDashboardData();
      
      const selectedUser = users.find(u => u._id === selectedUserId);
      const targetName = userRole === 'admin' && selectedUser ? selectedUser.name : 'vous';
      Alert.alert('Succès', `Tâche créée pour ${targetName}`);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la tâche');
    }
  };

  const handleTaskAssignment = async (taskId: string, userId: string) => {
    console.log('🎯 handleTaskAssignment - taskId:', taskId, 'userId:', userId);
    try {
      console.log('🔄 Calling apiService.assignExistingTask...');
      const result = await apiService.assignExistingTask(taskId, userId);
      console.log('✅ Assignment API success:', result);
      
      console.log('🔄 Reloading dashboard data...');
      await loadDashboardData();
      console.log('✅ Dashboard data reloaded');
      
      const selectedUser = users.find(u => u._id === userId);
      const tasksList = userRole === 'admin' ? allTasks : recentTasks;
      const selectedTask = tasksList.find(t => t._id === taskId);
      console.log(`✅ Tâche "${selectedTask?.title}" attribuée à ${selectedUser?.name}`);
    } catch (error) {
      console.error('❌ Assignment error:', error);
      throw new Error(`Impossible d'attribuer la tâche: ${error.message || error}`);
    }
  };

  const handleTaskSubmit = async (taskData: { title: string; description: string; priority: 'low' | 'medium' | 'high'; dueDate: Date | null }) => {
    console.log('📝 handleTaskSubmit appelé avec:', taskData);
    try {
      console.log('🔄 Création de la tâche...');
      await apiService.createTask({
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate?.toISOString() || '',
        priority: taskData.priority,
      });

      console.log('✅ Tâche créée avec succès');
      await loadDashboardData();
      console.log('✅ Données du dashboard rechargées');
    } catch (error) {
      console.error('❌ Erreur lors de la création de la tâche:', error);
      throw new Error('Impossible de créer la tâche');
    }
  };

  const updateTaskFormField = (field: keyof TaskFormData, value: string) => {
    setTaskFormData(prev => ({ ...prev, [field]: value }));
  };

  const StatCard = ({ title, value, color, subtitle }: {
    title: string;
    value: string | number;
    color: string;
    subtitle?: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'haute': return '#EF4444';
      case 'moyenne': return '#F59E0B';
      case 'basse': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        {/* Header */}
        <View style={styles.header}>
          <Logo />
          <Text style={styles.welcomeText}>
            Bonjour, {userName} 👋
            {userRole === 'admin' && (
              <Text style={styles.adminBadge}> ADMIN</Text>
            )}
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          
          {/* Boutons de création de tâche */}
          <View style={styles.createTaskButtonsContainer}>
            <TouchableOpacity
              style={styles.createTaskButton}
              onPress={() => {
                console.log('🟦 Bouton "Ma tâche" pressé');
                setShowCreateTaskModal(true);
                console.log('🟦 ShowCreateTaskModal défini à true');
              }}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.createTaskButtonText}>
                {userRole === 'admin' ? 'Ma tâche' : 'Nouvelle tâche'}
              </Text>
            </TouchableOpacity>
            
            {/* Bouton admin pour créer des tâches pour d'autres utilisateurs */}
            {userRole === 'admin' && (
              <TouchableOpacity
                style={styles.adminTaskButton}
                onPress={() => setShowTaskAssignment(true)}
              >
                <Ionicons name="people" size={20} color="#2563EB" />
                <Text style={styles.adminTaskButtonText}>
                  Assigner à un utilisateur
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Statistiques principales */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>
            {userRole === 'admin' ? 'Vue d\'ensemble globale' : 'Vue d\'ensemble'}
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              title={userRole === 'admin' ? "Total tâches (global)" : "Total des tâches"}
              value={stats.totalTasks}
              color="#2563EB"
            />
            <StatCard
              title="Taux de réussite"
              value={`${stats.completionRate}%`}
              color="#10B981"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              title="Terminées"
              value={stats.completedTasks}
              color="#059669"
            />
            <StatCard
              title="En attente"
              value={stats.pendingTasks}
              color="#F59E0B"
            />
          </View>
          
          {/* Statistiques admin supplémentaires */}
          {userRole === 'admin' && (
            <>
              <View style={styles.statsGrid}>
                <StatCard
                  title="Total utilisateurs"
                  value={stats.totalUsers || 0}
                  color="#8B5CF6"
                />
                <StatCard
                  title="Utilisateurs actifs"
                  value={stats.activeUsers || 0}
                  color="#06B6D4"
                />
              </View>
              <View style={styles.statsGrid}>
                <StatCard
                  title="Priorité haute"
                  value={stats.highPriorityTasks || 0}
                  color="#EF4444"
                />
                <StatCard
                  title="Créées aujourd'hui"
                  value={stats.tasksCreatedToday || 0}
                  color="#F59E0B"
                />
              </View>
            </>
          )}
        </View>

        {/* Alertes */}
        {(stats.todayTasks > 0 || stats.overdueTasks > 0) && (
          <View style={styles.alertsSection}>
            <Text style={styles.sectionTitle}>Alertes</Text>
            {stats.overdueTasks > 0 && (
              <View style={[styles.alertCard, styles.dangerAlert]}>
                <Text style={styles.alertIcon}>⚠️</Text>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>Tâches en retard</Text>
                  <Text style={styles.alertText}>
                    {stats.overdueTasks} tâche{stats.overdueTasks > 1 ? 's' : ''} en retard
                  </Text>
                </View>
              </View>
            )}
            {stats.todayTasks > 0 && (
              <View style={[styles.alertCard, styles.infoAlert]}>
                <Text style={styles.alertIcon}>📅</Text>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>Tâches d'aujourd'hui</Text>
                  <Text style={styles.alertText}>
                    {stats.todayTasks} tâche{stats.todayTasks > 1 ? 's' : ''} à terminer aujourd'hui
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Tâches récentes */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Tâches récentes</Text>
          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <View key={task._id} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                  <Text style={[styles.taskTitle, task.status === 'completed' && styles.completedTask]}>
                    {task.title}
                  </Text>
                  {task.status === 'completed' && <Text style={styles.completedIcon}>✓</Text>}
                </View>
                {task.description && (
                  <Text style={styles.taskDescription} numberOfLines={2}>
                    {task.description}
                  </Text>
                )}
                {task.dueDate && (
                  <Text style={styles.taskDate}>
                    Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucune tâche pour le moment</Text>
              <Text style={styles.emptyStateSubtext}>
                Allez dans l'onglet Tâches pour en créer une
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>

    {/* Modal pour le formulaire de tâche standard */}
    <TaskForm
      visible={showCreateTaskModal}
      onClose={() => {
        console.log('🟦 Fermeture du modal TaskForm');
        setShowCreateTaskModal(false);
      }}
      onSubmit={handleTaskSubmit}
    />

    {/* Modal pour l'attribution de tâches */}
    <TaskAssignmentModal
      visible={showTaskAssignment}
      onClose={() => setShowTaskAssignment(false)}
      onAssign={handleTaskAssignment}
      tasks={userRole === 'admin' ? allTasks : recentTasks}
      users={users}
    />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  alertsSection: {
    padding: 20,
    paddingTop: 0,
  },
  alertCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  dangerAlert: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  infoAlert: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  alertText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  recentSection: {
    padding: 20,
    paddingTop: 0,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    marginRight: 12,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  completedIcon: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  createTaskButtonsContainer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 16,
  },
  createTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createTaskButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  adminTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  adminTaskButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
