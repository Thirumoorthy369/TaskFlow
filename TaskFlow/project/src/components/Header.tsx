import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Moon, Sun, CheckSquare } from 'lucide-react';
import { useTask } from '../context/TaskContext';

interface HeaderProps {
  onCreateTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateTask }) => {
  const { tasks, darkMode, toggleDarkMode } = useTask();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-40 ${
        darkMode 
          ? 'bg-gray-900/80 backdrop-blur-md border-gray-800' 
          : 'bg-white/80 backdrop-blur-md border-gray-200'
      } border-b`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 bg-blue-500 rounded-xl">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">TaskFlow</h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {totalTasks} tasks • {completedTasks} completed • {pendingTasks} pending
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-3 rounded-xl transition-colors ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateTask}
              className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              New Task
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;