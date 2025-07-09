import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, X, Edit3 } from 'lucide-react';
import { useTask } from '../context/TaskContext';

interface TaskNotesProps {
  taskId: string;
  darkMode: boolean;
}

const TaskNotes: React.FC<TaskNotesProps> = ({ taskId, darkMode }) => {
  const { tasks, updateTask } = useTask();
  const task = tasks.find(t => t.id === taskId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState('');

  const notes = task?.notes || [];

  const handleAddNote = () => {
    if (noteText.trim()) {
      const newNote = {
        id: Date.now().toString(),
        text: noteText.trim(),
        createdAt: new Date().toISOString()
      };
      
      updateTask(taskId, {
        notes: [...notes, newNote]
      });
      
      setNoteText('');
      setIsEditing(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    updateTask(taskId, {
      notes: notes.filter(note => note.id !== noteId)
    });
  };

  return (
    <div className={`mt-2 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        } hover:underline`}
      >
        <FileText className="w-4 h-4" />
        Notes ({notes.length})
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-3 space-y-2"
        >
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-2 rounded border ${
                darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="text-sm flex-1">{note.text}</p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className={`p-1 rounded transition-colors ${
                    darkMode ? 'hover:bg-red-900 text-red-400' : 'hover:bg-red-50 text-red-500'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className={`w-full p-2 text-sm rounded border ${
                  darkMode
                    ? 'bg-gray-600 border-gray-500 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddNote}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Add Note
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNoteText('');
                  }}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${
                    darkMode
                      ? 'border-gray-600 hover:bg-gray-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={`flex items-center gap-2 text-sm ${
                darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
              } transition-colors`}
            >
              <Plus className="w-4 h-4" />
              Add note
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TaskNotes;