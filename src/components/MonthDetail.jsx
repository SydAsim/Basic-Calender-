import React, { useState } from 'react';
import { 
  Target, 
  CheckSquare, 
  FileText, 
  Edit3, 
  Save, 
  X, 
  Calendar as CalendarIcon,
  TrendingUp,
  Plus,
  Trash2
} from 'lucide-react';
import Calendar from './Calendar';
import DailyNotes from './DailyNotes';

const MonthDetail = ({ 
  monthKey,
  monthData,
  progress,
  enhancedProgress,
  dailyProgress,
  userNotes,
  userSummary,
  onDayClick,
  onDayToggle,
  onUpdateUserSummary,
  onUpdateMonthData,
  onUpdateUserNote,
  onDeleteUserNote,
  onNotesChange,
  isLocked
}) => {
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isEditingUserSummary, setIsEditingUserSummary] = useState(false);
  
  const [editedTargets, setEditedTargets] = useState(monthData.targets);
  const [editedSteps, setEditedSteps] = useState(monthData.howToAchieve);
  const [editedSummary, setEditedSummary] = useState(monthData.monthlySummary);
  const [editedUserSummary, setEditedUserSummary] = useState(userSummary || '');
  
  const handleSaveTargets = () => {
    onUpdateMonthData(monthKey, { targets: editedTargets });
    setIsEditingTargets(false);
  };
  
  const handleSaveSteps = () => {
    onUpdateMonthData(monthKey, { howToAchieve: editedSteps });
    setIsEditingSteps(false);
  };
  
  const handleSaveSummary = () => {
    onUpdateMonthData(monthKey, { monthlySummary: editedSummary });
    setIsEditingSummary(false);
  };
  
  const handleSaveUserSummary = () => {
    onUpdateUserSummary(monthKey, editedUserSummary);
    setIsEditingUserSummary(false);
  };
  
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-accent-emerald-600 dark:text-accent-emerald-400';
    if (progress >= 60) return 'text-accent-amber-600 dark:text-accent-amber-400';
    if (progress >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-accent-blue-500 text-white">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {monthData.month}
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className={`font-semibold ${getProgressColor(enhancedProgress?.overall ?? progress)}`}>
                  {enhancedProgress?.overall ?? progress}% Complete
                </span>
              </div>
              {enhancedProgress && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{enhancedProgress.notesCount}/{enhancedProgress.totalDays} daily notes completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-accent-emerald-500 text-white">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Daily Progress</h3>
        </div>
        <Calendar
          monthKey={monthKey}
          dailyProgress={dailyProgress}
          userNotes={userNotes}
          onDayClick={onDayClick}
          onDayToggle={onDayToggle}
          isLocked={isLocked}
        />
      </div>

      {/* Daily Notes - Right after calendar */}
      <div className="mb-6">
        <DailyNotes
          monthKey={monthKey}
          userNotes={userNotes}
          onUpdateNote={onUpdateUserNote}
          onDeleteNote={onDeleteUserNote}
          onNotesChange={onNotesChange}
          isLocked={isLocked}
        />
      </div>
      
      {/* Primary Targets */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-accent-blue-500 text-white">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Primary Targets</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click to edit directly</p>
            </div>
          </div>
          {!isLocked && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditedTargets([...editedTargets, ''])}
                className="p-2 bg-accent-emerald-500 text-white rounded-lg hover:bg-accent-emerald-600 transition-colors"
                title="Add Target"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (isEditingTargets) {
                    setEditedTargets(monthData.targets);
                  }
                  setIsEditingTargets(!isEditingTargets);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isEditingTargets 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {isEditingTargets ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
        
        {isEditingTargets ? (
          <div className="space-y-3">
            {editedTargets.map((target, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => {
                    const newTargets = [...editedTargets];
                    newTargets[index] = e.target.value;
                    setEditedTargets(newTargets);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your target..."
                />
                <button
                  onClick={() => {
                    const newTargets = editedTargets.filter((_, i) => i !== index);
                    setEditedTargets(newTargets);
                  }}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                onClick={handleSaveTargets}
                className="flex items-center space-x-2 px-4 py-2 bg-accent-emerald-500 text-white rounded-lg hover:bg-accent-emerald-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {monthData.targets.map((target, index) => (
              <div 
                key={index} 
                className={`group flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                  !isLocked ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer' : ''
                }`}
                onClick={() => !isLocked && setIsEditingTargets(true)}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-accent-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-100 leading-relaxed">{target}</p>
                  {!isLocked && (
                    <p className="text-xs text-accent-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                      Click to edit
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Execution Plan */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-accent-emerald-500 text-white">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Execution Plan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your roadmap to success</p>
            </div>
          </div>
          {!isLocked && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditedSteps([...editedSteps, ''])}
                className="p-2 bg-accent-emerald-500 text-white rounded-lg hover:bg-accent-emerald-600 transition-colors"
                title="Add Step"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (isEditingSteps) {
                    setEditedSteps(monthData.howToAchieve);
                  }
                  setIsEditingSteps(!isEditingSteps);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isEditingSteps 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {isEditingSteps ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
        
        {isEditingSteps ? (
          <div className="space-y-3">
            {editedSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => {
                    const newSteps = [...editedSteps];
                    newSteps[index] = e.target.value;
                    setEditedSteps(newSteps);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter execution step..."
                />
                <button
                  onClick={() => {
                    const newSteps = editedSteps.filter((_, i) => i !== index);
                    setEditedSteps(newSteps);
                  }}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                onClick={handleSaveSteps}
                className="flex items-center space-x-2 px-4 py-2 bg-accent-emerald-500 text-white rounded-lg hover:bg-accent-emerald-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {monthData.howToAchieve.map((step, index) => (
              <div 
                key={index} 
                className={`group flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                  !isLocked ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer' : ''
                }`}
                onClick={() => !isLocked && setIsEditingSteps(true)}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-accent-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-100 leading-relaxed">{step}</p>
                  {!isLocked && (
                    <p className="text-xs text-accent-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                      Click to edit
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Monthly Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Summary</h3>
          </div>
          {!isLocked && (
            <button
              onClick={() => {
                if (isEditingSummary) {
                  setEditedSummary(monthData.monthlySummary);
                }
                setIsEditingSummary(!isEditingSummary);
              }}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isEditingSummary ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </button>
          )}
        </div>
        
        {isEditingSummary ? (
          <div className="space-y-3">
            <textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleSaveSummary}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800"
            >
              <Save className="w-3 h-3" />
              <span>Save</span>
            </button>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {monthData.monthlySummary}
          </p>
        )}
      </div>
      
      {/* Monthly Reflections */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Monthly Reflections</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your personal insights and thoughts</p>
            </div>
          </div>
          {!isLocked && (
            <button
              onClick={() => {
                if (isEditingUserSummary) {
                  setEditedUserSummary(userSummary || '');
                }
                setIsEditingUserSummary(!isEditingUserSummary);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isEditingUserSummary 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              {isEditingUserSummary ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </button>
          )}
        </div>
        
        {isEditingUserSummary ? (
          <div className="space-y-4">
            <textarea
              value={editedUserSummary}
              onChange={(e) => setEditedUserSummary(e.target.value)}
              rows={4}
              placeholder="Share your thoughts, insights, challenges, and victories for this month..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            />
            <div className="flex justify-center">
              <button
                onClick={handleSaveUserSummary}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Reflections</span>
              </button>
            </div>
          </div>
        ) : (
          <div 
            className={`p-4 rounded-lg transition-colors ${
              !isLocked ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer' : ''
            } ${userSummary ? 'bg-gray-50 dark:bg-gray-800' : 'border-2 border-dashed border-gray-300 dark:border-gray-600'}`}
            onClick={() => !isLocked && setIsEditingUserSummary(true)}
          >
            {userSummary ? (
              <div>
                <p className="text-gray-800 dark:text-gray-100 leading-relaxed">
                  {userSummary}
                </p>
                {!isLocked && (
                  <p className="text-xs text-purple-500 mt-2 opacity-75">
                    Click to edit your reflections
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                  No reflections yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  {isLocked ? 'Unlock to add your personal thoughts and insights' : 'Click here to add your personal thoughts and insights'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthDetail;