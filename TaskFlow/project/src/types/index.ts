export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  subtasks: SubTask[];
  timeSpent?: number; // in seconds
  notes?: TaskNote[];
  attachments?: TaskAttachment[];
  tags?: string[];
  estimatedTime?: number; // in minutes
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string; // base64 data
  uploadedAt: string;
}

export interface TaskFilter {
  status: 'all' | 'pending' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
  category: 'all' | string;
  tags?: string[];
  sortBy: 'created' | 'updated' | 'priority' | 'dueDate';
  sortOrder: 'asc' | 'desc';
}

export interface TaskContextType {
  tasks: Task[];
  filter: TaskFilter;
  darkMode: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addSubTask: (taskId: string, subTask: Omit<SubTask, 'id' | 'createdAt'>) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  setFilter: (filter: Partial<TaskFilter>) => void;
  toggleDarkMode: () => void;
  reorderTasks: (activeId: string, overId: string) => void;
}