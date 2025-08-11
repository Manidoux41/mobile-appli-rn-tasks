import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../utils/api';
import { getTaskDateInfo } from '../utils/dateFilters';
import { SafeTouchableOpacity } from './SafeTouchableOpacity';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskCardProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#666';
    }
  };

  const confirmDelete = (): void => {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => onDelete(task._id) },
      ]
    );
  };

  const dateInfo = getTaskDateInfo(task);

  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      <View style={styles.header}>
        <SafeTouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onToggleComplete(task._id)}
        >
          <Ionicons
            name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={task.completed ? '#007AFF' : '#ccc'}
          />
        </SafeTouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.title, task.completed && styles.completedText]}>
            {task.title}
          </Text>
          <View style={styles.priorityContainer}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <SafeTouchableOpacity onPress={() => onEdit(task)} style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </SafeTouchableOpacity>
          <SafeTouchableOpacity onPress={confirmDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </SafeTouchableOpacity>
        </View>
      </View>

      {task.description && (
        <Text style={[styles.description, task.completed && styles.completedText]}>
          {task.description}
        </Text>
      )}

      <View style={styles.dateContainer}>
        <View style={[
          styles.dateInfo,
          dateInfo.isOverdue && styles.overdueDateInfo,
          dateInfo.isToday && styles.todayDateInfo,
        ]}>
          <Ionicons
            name={
              dateInfo.isOverdue ? 'warning' :
              dateInfo.isToday ? 'today' :
              dateInfo.isTomorrow ? 'arrow-forward' :
              'calendar'
            }
            size={14}
            color={
              dateInfo.isOverdue ? '#ff4444' :
              dateInfo.isToday ? '#007AFF' :
              '#666'
            }
            style={styles.dateIcon}
          />
          <Text style={[
            styles.dueDateText,
            dateInfo.isOverdue && styles.overdueDateText,
            dateInfo.isToday && styles.todayDateText,
          ]}>
            {dateInfo.displayText}
          </Text>
        </View>
        <Text style={styles.exactDate}>
          {formatDate(task.dueDate)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  completedContainer: {
    opacity: 0.7,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  overdueDateInfo: {
    backgroundColor: '#ffebee',
  },
  todayDateInfo: {
    backgroundColor: '#e3f2fd',
  },
  dateIcon: {
    marginRight: 4,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  overdueDateText: {
    color: '#ff4444',
    fontWeight: '600',
  },
  todayDateText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  exactDate: {
    fontSize: 10,
    color: '#999',
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
  },
});
