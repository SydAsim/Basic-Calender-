import React from 'react';
import { Check } from 'lucide-react';

const Calendar = ({ 
  monthKey, 
  dailyProgress, 
  userNotes, 
  onDayClick, 
  onDayToggle,
  isLocked 
}) => {
  const [year, month] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  
  const monthProgress = dailyProgress[monthKey] || {};
  const monthNotes = userNotes[monthKey] || {};
  
  return (
    <div className="relative">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center p-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </span>
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map(day => (
          <div key={`empty-${day}`} className="h-10 sm:h-12"></div>
        ))}
        
        {days.map(day => {
          const isCompleted = monthProgress[day];
          const hasNote = monthNotes[day];
          
          return (
            <div
              key={day}
              className={`
                h-10 sm:h-12 flex items-center justify-center text-sm font-medium cursor-pointer rounded-lg transition-all duration-200 relative
                ${isCompleted 
                  ? 'bg-accent-emerald-500 text-white shadow-md' 
                  : hasNote
                  ? 'bg-accent-amber-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
                ${isLocked ? 'cursor-not-allowed opacity-50' : ''}
              `}
              onClick={() => !isLocked && onDayClick(day)}
              onDoubleClick={() => !isLocked && onDayToggle(day)}
              title={
                isCompleted ? 'Completed (double-click to toggle)' : 
                hasNote ? 'Has note (click to edit)' : 
                'Click to add note, double-click to mark complete'
              }
            >
              <span className="relative flex items-center justify-center w-full h-full">
                {day}
                {isCompleted && (
                  <Check className="absolute -top-0.5 -right-0.5 w-3 h-3 text-white" />
                )}
                {hasNote && !isCompleted && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-white rounded-full"></div>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;