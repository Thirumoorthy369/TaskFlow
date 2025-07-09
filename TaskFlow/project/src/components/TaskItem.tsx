import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  CheckCircle, 
  Circle, 
  Edit, 
  Trash2, 
  Calendar, 
  Flag, 
  Tag, 
  GripVertical,
  Plus,
  X,
  Clock,
  FileText,
  Paperclip
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { Task } from '../types';
import { getPriorityColor, getPriorityTextColor, formatDate } from '../utils/taskUtils';
import TaskTimer from './TaskTimer';
import TaskNotes from './TaskNotes';
import TaskAttachments from './TaskAttachments';
import TaskProgress from './TaskProgress';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { 
    toggleTask, 
    deleteTask, 
    addSubTask, 
    toggleSubTask, 
    deleteSubTask, 
    darkMode 
  } = useTask();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubTaskTitle.trim()) {
      addSubTask(task.id, { title: newSubTaskTitle.trim(), completed: false });
      setNewSubTaskTitle('');
      setIsAddingSubTask(false);
    }
  };

  const completedSubTasks = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubTasks = task.subtasks.length;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group relative rounded-2xl p-6 border transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      } ${task.completed ? 'opacity-60' : ''} shadow-sm hover:shadow-md`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute left-2 top-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="ml-4">
        {/* Task header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => toggleTask(task.id)}
              className={`mt-1 transition-colors ${
                task.completed 
                  ? 'text-green-500' 
                  : darkMode 
                    ? 'text-gray-400 hover:text-green-400' 
                    : 'text-gray-400 hover:text-green-500'
              }`}
            >
              {task.completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-semibold text-lg ${
                task.completed ? 'line-through opacity-60' : ''
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm mt-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                } ${task.completed ? 'line-through opacity-60' : ''}`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-red-900 text-red-400' 
                  : 'hover:bg-red-50 text-red-500'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task metadata */}
        <div className="flex items-center gap-4 text-sm mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
            <span className={getPriorityTextColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          
          <div className={`flex items-center gap-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Tag className="w-3 h-3" />
            <span>{task.category}</span>
          </div>
          
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${
              new Date(task.dueDate) < new Date() && !task.completed
                ? 'text-red-500'
                : darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          {task.estimatedTime && (
            <div className={`flex items-center gap-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{task.estimatedTime}min</span>
            </div>
          )}
        </div>

        {/* Task Progress */}
        {totalSubTasks > 0 && (
          <div className="mb-3">
            <TaskProgress 
              completed={completedSubTasks} 
              total={totalSubTasks} 
              darkMode={darkMode} 
            />
          </div>
        )}

        {/* Task Timer */}
        <div className="mb-3">
          <TaskTimer taskId={task.id} darkMode={darkMode} />
        </div>

        {/* Subtasks */}
        {totalSubTasks > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              } hover:underline`}
            >
              Subtasks ({completedSubTasks}/{totalSubTasks})
            </button>
            
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-2 space-y-2"
              >
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => toggleSubTask(task.id, subtask.id)}
                      className={`transition-colors ${
                        subtask.completed 
                          ? 'text-green-500' 
                          : darkMode 
                            ? 'text-gray-400 hover:text-green-400' 
                            : 'text-gray-400 hover:text-green-500'
                      }`}
                    >
                      {subtask.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    
                    <span className={`flex-1 text-sm ${
                      subtask.completed ? 'line-through opacity-60' : ''
                    }`}>
                      {subtask.title}
                    </span>
                    
                    <button
                      onClick={() => deleteSubTask(task.id, subtask.id)}
                      className={`p-1 rounded transition-colors ${
                        darkMode 
                          ? 'hover:bg-red-900 text-red-400' 
                          : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Add subtask */}
        {isAddingSubTask ? (
          <form onSubmit={handleAddSubTask} className="flex gap-2">
            <input
              type="text"
              value={newSubTaskTitle}
              onChange={(e) => setNewSubTaskTitle(e.target.value)}
              placeholder="Add subtask..."
              className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                  : 'bg-white border-gray-300 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingSubTask(false)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingSubTask(true)}
            className={`flex items-center gap-2 text-sm ${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
            } transition-colors`}
          >
            <Plus className="w-4 h-4" />
            Add subtask
          </button>
        )}

        {/* Task Notes */}
        <TaskNotes taskId={task.id} darkMode={darkMode} />

        {/* Task Attachments */}
        <TaskAttachments taskId={task.id} darkMode={darkMode} />
      </div>
    </motion.div>
  );
};

export default TaskItem;