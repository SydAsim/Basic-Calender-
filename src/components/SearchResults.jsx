import React from 'react';
import { Target, CheckSquare, FileText, Calendar } from 'lucide-react';

const SearchResults = ({ results, onResultClick, onClose }) => {
  if (results.length === 0) return null;
  
  const getIcon = (type) => {
    switch (type) {
      case 'target':
        return <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'step':
        return <CheckSquare className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'summary':
        return <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };
  
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };
  
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-20">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <span className="text-sm">Close</span>
          </button>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={index}
            onClick={() => {
              onResultClick(result.monthKey);
              onClose();
            }}
            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getIcon(result.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {result.month}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                    {result.context}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {highlightText(result.content, '')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;