import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskProvider, useTask } from './context/TaskContext';
import { useReminders } from './hooks/useReminders';
import { initializeEmailJS } from './services/emailService';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskStats from './components/TaskStats';
import { Task } from './types';

// Initialize EmailJS
initializeEmailJS();

const AppContent: React.FC = () => {
  const { darkMode, tasks } = useTask();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Initialize reminder system
  useReminders(tasks);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
      }`}
    >
      <Header onCreateTask={handleCreateTask} />
      
      <main className="container mx-auto px-4 py-8">
        <TaskStats />
        <FilterBar />
        <TaskList onEditTask={handleEditTask} />
      </main>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseForm}
        editingTask={editingTask}
      />
    </motion.div>
  );
};

const App: React.FC = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

export default App;