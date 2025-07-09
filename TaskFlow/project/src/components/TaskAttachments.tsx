import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Download, X, Upload } from 'lucide-react';
import { useTask } from '../context/TaskContext';

interface TaskAttachmentsProps {
  taskId: string;
  darkMode: boolean;
}

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ taskId, darkMode }) => {
  const { tasks, updateTask } = useTask();
  const task = tasks.find(t => t.id === taskId);
  const [isExpanded, setIsExpanded] = useState(false);

  const attachments = task?.attachments || [];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newAttachment = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            data: e.target?.result as string,
            uploadedAt: new Date().toISOString()
          };
          
          updateTask(taskId, {
            attachments: [...attachments, newAttachment]
          });
        };
        reader.readAsDataURL(file);
      });
    }
    event.target.value = '';
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    updateTask(taskId, {
      attachments: attachments.filter(att => att.id !== attachmentId)
    });
  };

  const handleDownload = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`mt-2 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 text-sm font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        } hover:underline`}
      >
        <Paperclip className="w-4 h-4" />
        Attachments ({attachments.length})
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-3 space-y-2"
        >
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className={`flex items-center justify-between p-2 rounded border ${
                darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{attachment.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => handleDownload(attachment)}
                  className={`p-1 rounded transition-colors ${
                    darkMode ? 'hover:bg-gray-500 text-blue-400' : 'hover:bg-gray-100 text-blue-600'
                  }`}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAttachment(attachment.id)}
                  className={`p-1 rounded transition-colors ${
                    darkMode ? 'hover:bg-red-900 text-red-400' : 'hover:bg-red-50 text-red-500'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <label className={`flex items-center gap-2 p-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            darkMode 
              ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-600' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}>
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload files</span>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
          </label>
        </motion.div>
      )}
    </div>
  );
};

export default TaskAttachments;