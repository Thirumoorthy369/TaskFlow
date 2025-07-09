import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, SortAsc, SortDesc, Tag } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { getCategories, getAllTags } from '../utils/taskUtils';

const FilterBar: React.FC = () => {
  const { tasks, filter, setFilter, darkMode } = useTask();
  const categories = getCategories(tasks);
  const allTags = getAllTags(tasks);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl border mb-6 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } shadow-sm`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filters</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ status: e.target.value as any })}
            className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                : 'bg-white border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Priority:</label>
          <select
            value={filter.priority}
            onChange={(e) => setFilter({ priority: e.target.value as any })}
            className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                : 'bg-white border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            <option value="all">All</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Category:</label>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ category: e.target.value })}
            className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                : 'bg-white border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            <option value="all">All</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter({ sortBy: e.target.value as any })}
            className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                : 'bg-white border-gray-300 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
          
          <button
            onClick={() => setFilter({ sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' })}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            {filter.sortOrder === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </button>
        </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">Tags:</span>
            </div>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  const currentTags = filter.tags || [];
                  const newTags = currentTags.includes(tag)
                    ? currentTags.filter(t => t !== tag)
                    : [...currentTags, tag];
                  setFilter({ tags: newTags });
                }}
                className={`px-2 py-1 rounded-full text-xs transition-colors ${
                  filter.tags?.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FilterBar;