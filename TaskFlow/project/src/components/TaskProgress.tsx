import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

interface TaskProgressProps {
  completed: number;
  total: number;
  darkMode: boolean;
}

const TaskProgress: React.FC<TaskProgressProps> = ({ completed, total, darkMode }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 p-2 rounded-lg ${
      darkMode ? 'bg-gray-700' : 'bg-gray-100'
    }`}>
      <BarChart3 className="w-4 h-4" />
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-xs">{completed}/{total}</span>
        </div>
        
        <div className={`w-full h-2 rounded-full ${
          darkMode ? 'bg-gray-600' : 'bg-gray-200'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
          />
        </div>
      </div>
      
      <span className="text-sm font-medium">{Math.round(percentage)}%</span>
    </div>
  );
};

export default TaskProgress;