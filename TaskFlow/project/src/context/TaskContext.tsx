import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { Task, TaskFilter, TaskContextType, SubTask } from '../types';
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  darkMode: boolean;
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'ADD_SUBTASK'; payload: { taskId: string; subTask: Omit<SubTask, 'id' | 'createdAt'> } }
  | { type: 'TOGGLE_SUBTASK'; payload: { taskId: string; subTaskId: string } }
  | { type: 'DELETE_SUBTASK'; payload: { taskId: string; subTaskId: string } }
  | { type: 'SET_FILTER'; payload: Partial<TaskFilter> }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'REORDER_TASKS'; payload: { activeId: string; overId: string } }
  | { type: 'LOAD_STATE'; payload: TaskState };

const initialState: TaskState = {
  tasks: [],
  filter: {
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'created',
    sortOrder: 'desc'
  },
  darkMode: false
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      const newTask: Task = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return { ...state, tasks: [newTask, ...state.tasks] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : task
        )
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
            : task
        )
      };

    case 'ADD_SUBTASK':
      const newSubTask: SubTask = {
        ...action.payload.subTask,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      };
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, subtasks: [...task.subtasks, newSubTask], updatedAt: new Date().toISOString() }
            : task
        )
      };

    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? {
                ...task,
                subtasks: task.subtasks.map(subtask =>
                  subtask.id === action.payload.subTaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask
                ),
                updatedAt: new Date().toISOString()
              }
            : task
        )
      };

    case 'DELETE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? {
                ...task,
                subtasks: task.subtasks.filter(subtask => subtask.id !== action.payload.subTaskId),
                updatedAt: new Date().toISOString()
              }
            : task
        )
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload }
      };

    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode
      };

    case 'REORDER_TASKS':
      const { activeId, overId } = action.payload;
      const activeIndex = state.tasks.findIndex(task => task.id === activeId);
      const overIndex = state.tasks.findIndex(task => task.id === overId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const newTasks = [...state.tasks];
        const [removed] = newTasks.splice(activeIndex, 1);
        newTasks.splice(overIndex, 0, removed);
        return { ...state, tasks: newTasks };
      }
      return state;

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('taskManagerState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('taskManagerState', JSON.stringify(state));
  }, [state]);

  const value: TaskContextType = {
    tasks: state.tasks,
    filter: state.filter,
    darkMode: state.darkMode,
    addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
    updateTask: (id, updates) => dispatch({ type: 'UPDATE_TASK', payload: { id, updates } }),
    deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
    toggleTask: (id) => dispatch({ type: 'TOGGLE_TASK', payload: id }),
    addSubTask: (taskId, subTask) => dispatch({ type: 'ADD_SUBTASK', payload: { taskId, subTask } }),
    toggleSubTask: (taskId, subTaskId) => dispatch({ type: 'TOGGLE_SUBTASK', payload: { taskId, subTaskId } }),
    deleteSubTask: (taskId, subTaskId) => dispatch({ type: 'DELETE_SUBTASK', payload: { taskId, subTaskId } }),
    setFilter: (filter) => dispatch({ type: 'SET_FILTER', payload: filter }),
    toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
    reorderTasks: (activeId, overId) => dispatch({ type: 'REORDER_TASKS', payload: { activeId, overId } })
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};