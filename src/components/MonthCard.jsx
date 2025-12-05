import React from 'react';
import { Calendar, Target, CheckCircle } from 'lucide-react';

const MonthCard = ({ 
  monthKey, 
  monthData, 
  progress, 
  enhancedProgress,
  isSelected, 
  onClick 
}) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-accent-emerald-500';
    if (progress >= 60) return 'bg-accent-amber-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getProgressTextColor = (progress) => {
    if (progress >= 80) return 'text-accent-emerald-600 dark:text-accent-emerald-400';
    if (progress >= 60) return 'text-accent-amber-600 dark:text-accent-amber-400';
    if (progress >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const displayProgress = enhancedProgress?.overall ?? progress;
  
  return (
    <div
      className={`
        p-4 rounded-xl cursor-pointer transition-all duration-200 
        ${isSelected 
          ? 'glass-card border-2 border-accent-blue-500 bg-accent-blue-50 dark:bg-gray-800 card-shadow-lg' 
          : 'glass-card hover:card-shadow border hover:border-gray-300 dark:hover:border-gray-500'
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className="p-2 rounded-lg bg-accent-blue-500 text-white">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-50 text-sm sm:text-base truncate">
            {monthData.month}
          </h3>
        </div>
        <div className={`text-sm font-bold ${getProgressTextColor(displayProgress)} flex-shrink-0`}>
          {displayProgress}%
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Target className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {monthData.targets.length} targets
            </span>
          </div>
          {enhancedProgress && (
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {enhancedProgress.notesCount}/{enhancedProgress.totalDays} notes
              </span>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(displayProgress)}`}
            style={{ width: `${displayProgress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
        {monthData.monthlySummary}
      </div>
    </div>
  );
};

export default MonthCard;