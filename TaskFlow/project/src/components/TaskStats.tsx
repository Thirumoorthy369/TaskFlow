import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Calendar, Timer, Target } from 'lucide-react';
import { useTask } from '../context/TaskContext';

const TaskStats: React.FC = () => {
  const { tasks, darkMode } = useTask();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    urgent: tasks.filter(task => task.priority === 'urgent' && !task.completed).length,
    overdue: tasks.filter(task => {
      if (task.completed || !task.dueDate) return false;
      return new Date(task.dueDate) < new Date();
    }).length,
    totalTimeSpent: tasks.reduce((total, task) => total + (task.timeSpent || 0), 0),
    averageCompletionTime: (() => {
      const completedTasks = tasks.filter(task => task.completed && task.timeSpent);
      if (completedTasks.length === 0) return 0;
      return Math.round(completedTasks.reduce((total, task) => total + (task.timeSpent || 0), 0) / completedTasks.length);
    })()
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const statItems = [
    {
      icon: CheckCircle,
      label: 'Completed',
      value: stats.completed,
      color: 'text-green-500',
      bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-50'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: stats.pending,
      color: 'text-blue-500',
      bgColor: darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
    },
    {
      icon: AlertCircle,
      label: 'Urgent',
      value: stats.urgent,
      color: 'text-red-500',
      bgColor: darkMode ? 'bg-red-900/20' : 'bg-red-50'
    },
    {
      icon: Calendar,
      label: 'Overdue',
      value: stats.overdue,
      color: 'text-orange-500',
      bgColor: darkMode ? 'bg-orange-900/20' : 'bg-orange-50'
    },
    {
      icon: Timer,
      label: 'Time Spent',
      value: formatTime(stats.totalTimeSpent),
      color: 'text-purple-500',
      bgColor: darkMode ? 'bg-purple-900/20' : 'bg-purple-50'
    },
    {
      icon: Target,
      label: 'Avg. Time',
      value: formatTime(stats.averageCompletionTime),
      color: 'text-indigo-500',
      bgColor: darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
    >
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-xl border transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          } ${item.bgColor}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {item.label}
              </p>
              <p className="text-xl font-bold mt-1">{item.value}</p>
            </div>
            <item.icon className={`w-6 h-6 ${item.color}`} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TaskStats;