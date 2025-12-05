import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ masterPlan, onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = searchInPlan(searchTerm.trim().toLowerCase());
      onSearchResults(results);
    } else {
      onSearchResults([]);
    }
  }, [searchTerm, masterPlan]);
  
  const searchInPlan = (term) => {
    const results = [];
    
    Object.entries(masterPlan).forEach(([monthKey, monthData]) => {
      // Search in targets
      monthData.targets.forEach((target, index) => {
        if (target.toLowerCase().includes(term)) {
          results.push({
            monthKey,
            month: monthData.month,
            type: 'target',
            index,
            content: target,
            context: 'Target'
          });
        }
      });
      
      // Search in how to achieve
      monthData.howToAchieve.forEach((step, index) => {
        if (step.toLowerCase().includes(term)) {
          results.push({
            monthKey,
            month: monthData.month,
            type: 'step',
            index,
            content: step,
            context: 'How to Achieve'
          });
        }
      });
      
      // Search in monthly summary
      if (monthData.monthlySummary.toLowerCase().includes(term)) {
        results.push({
          monthKey,
          month: monthData.month,
          type: 'summary',
          content: monthData.monthlySummary,
          context: 'Monthly Summary'
        });
      }
    });
    
    return results;
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setIsExpanded(false);
  };
  
  return (
    <div className="relative">
      <div className={`flex items-center transition-all duration-200 ${
        isExpanded ? 'w-80' : 'w-10'
      }`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Search goals, targets, and summaries..."
            className={`w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              !isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Click outside to collapse */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            if (!searchTerm) {
              setIsExpanded(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;