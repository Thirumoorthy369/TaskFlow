import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { useTask } from '../context/TaskContext';

interface TaskTimerProps {
  taskId: string;
  darkMode: boolean;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ taskId, darkMode }) => {
  const { updateTask, tasks } = useTask();
  const task = tasks.find(t => t.id === taskId);
  
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(task?.timeSpent || 0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setTimeSpent(task?.timeSpent || 0 + elapsed);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, task?.timeSpent]);

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const handlePause = () => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newTimeSpent = (task?.timeSpent || 0) + elapsed;
      updateTask(taskId, { timeSpent: newTimeSpent });
      setTimeSpent(newTimeSpent);
    }
    setIsRunning(false);
    setStartTime(null);
  };

  const handleStop = () => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newTimeSpent = (task?.timeSpent || 0) + elapsed;
      updateTask(taskId, { timeSpent: newTimeSpent });
      setTimeSpent(newTimeSpent);
    }
    setIsRunning(false);
    setStartTime(null);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 p-2 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span className="text-sm font-mono">{formatTime(timeSpent)}</span>
      
      <div className="flex gap-1">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className={`p-1 rounded transition-colors ${
              darkMode ? 'hover:bg-gray-600 text-green-400' : 'hover:bg-gray-200 text-green-600'
            }`}
          >
            <Play className="w-3 h-3" />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className={`p-1 rounded transition-colors ${
              darkMode ? 'hover:bg-gray-600 text-yellow-400' : 'hover:bg-gray-200 text-yellow-600'
            }`}
          >
            <Pause className="w-3 h-3" />
          </button>
        )}
        
        <button
          onClick={handleStop}
          className={`p-1 rounded transition-colors ${
            darkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-200 text-red-600'
          }`}
        >
          <Square className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskTimer;