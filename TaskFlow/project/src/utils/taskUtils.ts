import { Task, TaskFilter } from '../types';

export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  let filteredTasks = [...tasks];

  // Filter by status
  if (filter.status !== 'all') {
    filteredTasks = filteredTasks.filter(task => {
      if (filter.status === 'completed') return task.completed;
      if (filter.status === 'pending') return !task.completed;
      return true;
    });
  }

  // Filter by priority
  if (filter.priority !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.priority === filter.priority);
  }

  // Filter by category
  if (filter.category !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.category === filter.category);
  }

  // Filter by tags
  if (filter.tags && filter.tags.length > 0) {
    filteredTasks = filteredTasks.filter(task => 
      task.tags && filter.tags!.some(tag => task.tags!.includes(tag))
    );
  }

  // Sort tasks
  filteredTasks.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (filter.sortBy) {
      case 'created':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'updated':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case 'priority':
        const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
        bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
        break;
      default:
        return 0;
    }

    if (filter.sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return filteredTasks;
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-blue-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const getPriorityTextColor = (priority: string): string => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 dark:text-red-400';
    case 'high':
      return 'text-orange-600 dark:text-orange-400';
    case 'medium':
      return 'text-blue-600 dark:text-blue-400';
    case 'low':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getCategories = (tasks: Task[]): string[] => {
  const categories = new Set(tasks.map(task => task.category));
  return Array.from(categories).sort();
};

export const getAllTags = (tasks: Task[]): string[] => {
  const tags = new Set<string>();
  tasks.forEach(task => {
    if (task.tags) {
      task.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
};