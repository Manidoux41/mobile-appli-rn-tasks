import { Task } from './api';

export type FilterType = 'all' | 'today' | 'tomorrow' | 'thisWeek' | 'thisMonth' | 'overdue' | 'completed';

export function filterTasksByDate(tasks: Task[], filter: FilterType): Task[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  switch (filter) {
    case 'all':
      return tasks;
    
    case 'today':
      return tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
        return taskDay.getTime() === today.getTime() && !task.completed;
      });
    
    case 'tomorrow':
      return tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
        return taskDay.getTime() === tomorrow.getTime() && !task.completed;
      });
    
    case 'thisWeek':
      return tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate >= startOfWeek && taskDate <= endOfWeek && !task.completed;
      });
    
    case 'thisMonth':
      return tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate >= startOfMonth && taskDate <= endOfMonth && !task.completed;
      });
    
    case 'overdue':
      return tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate < today && !task.completed;
      });
    
    case 'completed':
      return tasks.filter(task => task.completed);
    
    default:
      return tasks;
  }
}

export function sortTasksByDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Les tâches en retard en premier
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const aDate = new Date(a.dueDate);
    const bDate = new Date(b.dueDate);
    
    const aOverdue = aDate < today && !a.completed;
    const bOverdue = bDate < today && !b.completed;
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // Ensuite par date d'échéance
    return aDate.getTime() - bDate.getTime();
  });
}

export function getTaskDateInfo(task: Task): {
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  daysDifference: number;
  displayText: string;
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDate = new Date(task.dueDate);
  const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
  
  const timeDiff = taskDay.getTime() - today.getTime();
  const daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const isOverdue = daysDifference < 0 && !task.completed;
  const isToday = daysDifference === 0;
  const isTomorrow = daysDifference === 1;
  
  let displayText = '';
  
  if (isOverdue) {
    const daysLate = Math.abs(daysDifference);
    displayText = `En retard de ${daysLate} jour${daysLate > 1 ? 's' : ''}`;
  } else if (isToday) {
    displayText = "Aujourd'hui";
  } else if (isTomorrow) {
    displayText = 'Demain';
  } else if (daysDifference <= 7) {
    displayText = `Dans ${daysDifference} jour${daysDifference > 1 ? 's' : ''}`;
  } else {
    displayText = taskDate.toLocaleDateString('fr-FR');
  }
  
  return {
    isOverdue,
    isToday,
    isTomorrow,
    daysDifference,
    displayText,
  };
}
