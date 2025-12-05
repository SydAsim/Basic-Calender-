// Storage utilities for persistent data management
const STORAGE_KEYS = {
  MASTER_PLAN: 'planner_master_plan',
  USER_NOTES: 'planner_user_notes',
  DAILY_PROGRESS: 'planner_daily_progress',
  THEME: 'planner_theme',
  USER_SUMMARIES: 'planner_user_summaries',
  SETTINGS: 'planner_settings'
};

// Initialize storage with master plan data
export const initializeStorage = (masterPlanData) => {
  const existingData = localStorage.getItem(STORAGE_KEYS.MASTER_PLAN);
  if (!existingData) {
    localStorage.setItem(STORAGE_KEYS.MASTER_PLAN, JSON.stringify(masterPlanData));
  }
  
  // Initialize other storage if not exists
  if (!localStorage.getItem(STORAGE_KEYS.USER_NOTES)) {
    localStorage.setItem(STORAGE_KEYS.USER_NOTES, JSON.stringify({}));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS)) {
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify({}));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USER_SUMMARIES)) {
    localStorage.setItem(STORAGE_KEYS.USER_SUMMARIES, JSON.stringify({}));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
      lockMode: false,
      autoSave: true
    }));
  }
};

// Master plan operations
export const getMasterPlan = () => {
  const data = localStorage.getItem(STORAGE_KEYS.MASTER_PLAN);
  return data ? JSON.parse(data) : {};
};

export const updateMasterPlan = (monthKey, updatedData) => {
  const masterPlan = getMasterPlan();
  masterPlan[monthKey] = { ...masterPlan[monthKey], ...updatedData };
  localStorage.setItem(STORAGE_KEYS.MASTER_PLAN, JSON.stringify(masterPlan));
  return masterPlan;
};

// User notes operations
export const getUserNotes = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_NOTES);
  return data ? JSON.parse(data) : {};
};

export const updateUserNote = (monthKey, day, note) => {
  const notes = getUserNotes();
  if (!notes[monthKey]) notes[monthKey] = {};
  notes[monthKey][day] = note;
  localStorage.setItem(STORAGE_KEYS.USER_NOTES, JSON.stringify(notes));
  return notes;
};

export const deleteUserNote = (monthKey, day) => {
  const notes = getUserNotes();
  if (notes[monthKey] && notes[monthKey][day]) {
    delete notes[monthKey][day];
    localStorage.setItem(STORAGE_KEYS.USER_NOTES, JSON.stringify(notes));
  }
  return notes;
};

// Daily progress operations
export const getDailyProgress = () => {
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
  return data ? JSON.parse(data) : {};
};

export const toggleDayCompletion = (monthKey, day) => {
  const progress = getDailyProgress();
  if (!progress[monthKey]) progress[monthKey] = {};
  progress[monthKey][day] = !progress[monthKey][day];
  localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(progress));
  return progress;
};

export const getMonthProgress = (monthKey) => {
  const progress = getDailyProgress();
  const monthProgress = progress[monthKey] || {};
  const completedDays = Object.values(monthProgress).filter(Boolean).length;
  const totalDays = new Date(
    parseInt(monthKey.split('-')[0]), 
    parseInt(monthKey.split('-')[1]), 
    0
  ).getDate();
  
  // If no days are marked, return 0
  if (completedDays === 0) return 0;
  
  return Math.round((completedDays / totalDays) * 100);
};

// Enhanced progress calculation with target completion
export const getEnhancedMonthProgress = (monthKey) => {
  const masterPlan = getMasterPlan();
  const monthData = masterPlan[monthKey];
  if (!monthData) return { overall: 0, daily: 0, targets: 0 };
  
  // Daily progress (existing logic)
  const dailyProgress = getMonthProgress(monthKey);
  
  // Target completion progress (based on user notes or custom tracking)
  const userNotes = getUserNotes();
  const monthNotes = userNotes[monthKey] || {};
  const targetCompletionNotes = Object.values(monthNotes).filter(note => 
    note && (note.toLowerCase().includes('target') || note.toLowerCase().includes('complete'))
  ).length;
  const targetProgress = Math.min(Math.round((targetCompletionNotes / monthData.targets.length) * 100), 100);
  
  // Overall progress (weighted average: 60% daily, 40% targets)
  const overallProgress = Math.round((dailyProgress * 0.6) + (targetProgress * 0.4));
  
  return {
    overall: overallProgress,
    daily: dailyProgress,
    targets: targetProgress
  };
};

// User summaries operations
export const getUserSummaries = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_SUMMARIES);
  return data ? JSON.parse(data) : {};
};

export const updateUserSummary = (monthKey, summary) => {
  const summaries = getUserSummaries();
  summaries[monthKey] = summary;
  localStorage.setItem(STORAGE_KEYS.USER_SUMMARIES, JSON.stringify(summaries));
  return summaries;
};

// Theme operations
export const getTheme = () => {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  return theme;
};

// Settings operations
export const getSettings = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : { lockMode: false, autoSave: true };
};

export const updateSettings = (newSettings) => {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, ...newSettings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
  return updatedSettings;
};

// Export data for backup
export const exportAllData = () => {
  return {
    masterPlan: getMasterPlan(),
    userNotes: getUserNotes(),
    dailyProgress: getDailyProgress(),
    userSummaries: getUserSummaries(),
    theme: getTheme(),
    settings: getSettings(),
    exportDate: new Date().toISOString()
  };
};

// Import data from backup
export const importAllData = (data) => {
  if (data.masterPlan) {
    localStorage.setItem(STORAGE_KEYS.MASTER_PLAN, JSON.stringify(data.masterPlan));
  }
  if (data.userNotes) {
    localStorage.setItem(STORAGE_KEYS.USER_NOTES, JSON.stringify(data.userNotes));
  }
  if (data.dailyProgress) {
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(data.dailyProgress));
  }
  if (data.userSummaries) {
    localStorage.setItem(STORAGE_KEYS.USER_SUMMARIES, JSON.stringify(data.userSummaries));
  }
  if (data.theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, data.theme);
  }
  if (data.settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
  }
};

// Auto-backup functionality
export const createAutoBackup = () => {
  const data = exportAllData();
  const backupKey = `planner_auto_backup_${Date.now()}`;
  try {
    localStorage.setItem(backupKey, JSON.stringify(data));
    
    // Keep only the last 5 auto-backups
    const allKeys = Object.keys(localStorage);
    const backupKeys = allKeys.filter(key => key.startsWith('planner_auto_backup_'))
      .sort()
      .reverse();
    
    // Remove old backups, keep only 5 most recent
    backupKeys.slice(5).forEach(key => {
      localStorage.removeItem(key);
    });
    
    return true;
  } catch (error) {
    console.warn('Auto-backup failed:', error);
    return false;
  }
};

// Get available auto-backups
export const getAutoBackups = () => {
  const allKeys = Object.keys(localStorage);
  const backupKeys = allKeys.filter(key => key.startsWith('planner_auto_backup_'));
  
  return backupKeys.map(key => {
    const timestamp = parseInt(key.replace('planner_auto_backup_', ''));
    return {
      key,
      timestamp,
      date: new Date(timestamp).toLocaleString()
    };
  }).sort((a, b) => b.timestamp - a.timestamp);
};

// Restore from auto-backup
export const restoreFromAutoBackup = (backupKey) => {
  try {
    const backupData = localStorage.getItem(backupKey);
    if (backupData) {
      const data = JSON.parse(backupData);
      importAllData(data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return false;
  }
};

// Data validation
export const validateData = () => {
  const issues = [];
  
  try {
    const masterPlan = getMasterPlan();
    if (!masterPlan || Object.keys(masterPlan).length === 0) {
      issues.push('Master plan data is missing or empty');
    }
    
    const userNotes = getUserNotes();
    const dailyProgress = getDailyProgress();
    const userSummaries = getUserSummaries();
    
    // Check if data structures are valid
    if (typeof userNotes !== 'object') issues.push('User notes data is corrupted');
    if (typeof dailyProgress !== 'object') issues.push('Daily progress data is corrupted');
    if (typeof userSummaries !== 'object') issues.push('User summaries data is corrupted');
    
  } catch (error) {
    issues.push(`Data validation error: ${error.message}`);
  }
  
  return issues;
};

// Target completion tracking
export const getTargetCompletion = () => {
  const data = localStorage.getItem('planner_target_completion');
  return data ? JSON.parse(data) : {};
};

export const updateTargetCompletion = (monthKey, targetIndex, completed) => {
  const completions = getTargetCompletion();
  if (!completions[monthKey]) completions[monthKey] = {};
  completions[monthKey][targetIndex] = completed;
  localStorage.setItem('planner_target_completion', JSON.stringify(completions));
  return completions;
};

export const getTargetProgress = (monthKey) => {
  const completions = getTargetCompletion();
  const monthCompletions = completions[monthKey] || {};
  const masterPlan = getMasterPlan();
  const monthData = masterPlan[monthKey];
  
  if (!monthData) return 0;
  
  const completedTargets = Object.values(monthCompletions).filter(Boolean).length;
  const totalTargets = monthData.targets.length;
  
  return totalTargets > 0 ? Math.round((completedTargets / totalTargets) * 100) : 0;
};

// Progress calculation based on daily notes completion
export const getNotesBasedProgress = (monthKey) => {
  const userNotes = getUserNotes();
  const monthNotes = userNotes[monthKey] || {};
  const notesCount = Object.keys(monthNotes).length;
  
  const totalDays = new Date(
    parseInt(monthKey.split('-')[0]), 
    parseInt(monthKey.split('-')[1]), 
    0
  ).getDate();
  
  const notesProgress = Math.round((notesCount / totalDays) * 100);
  
  return {
    overall: notesProgress,
    notesCount: notesCount,
    totalDays: totalDays,
    percentage: notesProgress
  };
};