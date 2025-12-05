import { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Lock, 
  Unlock, 
  Download,
  Upload,
  RotateCcw,
  Calendar
} from 'lucide-react';

import MonthCard from './components/MonthCard';
import MonthDetail from './components/MonthDetail';
import NoteModal from './components/NoteModal';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import DataIntegrityCheck from './components/DataIntegrityCheck';

import { masterPlanData, getAllMonths } from './data/masterPlan';
import {
  initializeStorage,
  getMasterPlan,
  updateMasterPlan,
  getUserNotes,
  updateUserNote,
  deleteUserNote,
  getDailyProgress,
  toggleDayCompletion,
  getMonthProgress,
  getEnhancedMonthProgress,
  getNotesBasedProgress,
  getUserSummaries,
  updateUserSummary,
  getTheme,
  setTheme,
  getSettings,
  updateSettings,
  exportAllData,
  importAllData,
  createAutoBackup,
  getAutoBackups,
  restoreFromAutoBackup,
  validateData
} from './utils/storage';

function App() {
  // State management
  const [selectedMonth, setSelectedMonth] = useState('2025-12');
  const [masterPlan, setMasterPlan] = useState({});
  const [userNotes, setUserNotes] = useState({});
  const [dailyProgress, setDailyProgress] = useState({});
  const [userSummaries, setUserSummaries] = useState({});
  const [theme, setCurrentTheme] = useState('light');
  const [settings, setCurrentSettings] = useState({ lockMode: false, autoSave: true });
  const [showDataCheck, setShowDataCheck] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Modal states
  const [noteModal, setNoteModal] = useState({ isOpen: false, monthKey: '', day: 0 });
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Initialize app
  useEffect(() => {
    initializeStorage(masterPlanData);
    loadAllData();
    
    // Validate data integrity
    const issues = validateData();
    if (issues.length > 0) {
      console.warn('Data validation issues:', issues);
      setShowDataCheck(true);
    }
    
    // Create auto-backup on app start
    createAutoBackup();
  }, []);
  
  // Auto-backup every 5 minutes when data changes
  useEffect(() => {
    const interval = setInterval(() => {
      createAutoBackup();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [masterPlan, userNotes, dailyProgress, userSummaries]);
  
  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const loadAllData = () => {
    setMasterPlan(getMasterPlan());
    setUserNotes(getUserNotes());
    setDailyProgress(getDailyProgress());
    setUserSummaries(getUserSummaries());
    setCurrentTheme(getTheme());
    setCurrentSettings(getSettings());
  };
  
  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };
  
  // Lock mode toggle
  const toggleLockMode = () => {
    const newSettings = { ...settings, lockMode: !settings.lockMode };
    setCurrentSettings(newSettings);
    updateSettings(newSettings);
  };
  
  // Month selection
  const handleMonthSelect = (monthKey) => {
    setSelectedMonth(monthKey);
    setShowSearchResults(false);
  };
  
  // Day operations
  const handleDayClick = (day) => {
    if (settings.lockMode) return;
    
    const existingNote = userNotes[selectedMonth]?.[day] || '';
    setNoteModal({
      isOpen: true,
      monthKey: selectedMonth,
      day,
      existingNote
    });
  };
  
  const handleDayToggle = (day) => {
    if (settings.lockMode) return;
    
    const newProgress = toggleDayCompletion(selectedMonth, day);
    setDailyProgress(newProgress);
    
    // Create backup after significant changes
    setTimeout(() => createAutoBackup(), 1000);
  };
  
  // Note operations
  const handleNoteSave = (monthKey, day, note) => {
    const newNotes = updateUserNote(monthKey, day, note);
    setUserNotes(newNotes);
    
    // Create backup after note changes
    setTimeout(() => createAutoBackup(), 1000);
  };
  
  const handleNoteDelete = (monthKey, day) => {
    const newNotes = deleteUserNote(monthKey, day);
    setUserNotes(newNotes);
  };

  // Force re-render when notes change to update progress
  const handleNotesChange = () => {
    // Trigger a re-render by updating the notes state
    setUserNotes(getUserNotes());
  };
  
  // Summary operations
  const handleUserSummaryUpdate = (monthKey, summary) => {
    const newSummaries = updateUserSummary(monthKey, summary);
    setUserSummaries(newSummaries);
  };
  
  // Master plan operations
  const handleMasterPlanUpdate = (monthKey, updatedData) => {
    if (settings.lockMode) return;
    
    const newMasterPlan = updateMasterPlan(monthKey, updatedData);
    setMasterPlan(newMasterPlan);
  };
  
  // Search operations
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };
  
  const handleSearchResultClick = (monthKey) => {
    setSelectedMonth(monthKey);
    setShowSearchResults(false);
  };
  
  // Data export/import
  const handleExportData = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        importAllData(data);
        loadAllData();
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      localStorage.clear();
      initializeStorage(masterPlanData);
      loadAllData();
      setSelectedMonth('2025-12');
    }
  };
  
  const allMonths = getAllMonths();
  const selectedMonthData = masterPlan[selectedMonth];
  const monthProgress = getMonthProgress(selectedMonth);
  const selectedUserSummary = userSummaries[selectedMonth];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-600 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left side - Theme toggle on mobile, title on desktop */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              {/* Theme Toggle - Left side on mobile */}
              <button
                onClick={toggleTheme}
                className="sm:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-50 truncate">
                Strategic Planner
              </h1>
              <div className="relative hidden sm:block">
                <SearchBar 
                  masterPlan={masterPlan}
                  onSearchResults={handleSearchResults}
                />
                {showSearchResults && (
                  <SearchResults
                    results={searchResults}
                    onResultClick={handleSearchResultClick}
                    onClose={() => setShowSearchResults(false)}
                  />
                )}
              </div>
            </div>
            
            {/* Right side - Other controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Mobile Search */}
              <div className="relative sm:hidden">
                <SearchBar 
                  masterPlan={masterPlan}
                  onSearchResults={handleSearchResults}
                />
                {showSearchResults && (
                  <SearchResults
                    results={searchResults}
                    onResultClick={handleSearchResultClick}
                    onClose={() => setShowSearchResults(false)}
                  />
                )}
              </div>
              
              {/* Export/Import - Hidden on mobile */}
              <button
                onClick={handleExportData}
                className="hidden sm:block p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Export Data"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <label className="hidden sm:block p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" title="Import Data">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={handleResetData}
                className="hidden sm:block p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Reset All Data"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              {/* Lock Mode */}
              <button
                onClick={toggleLockMode}
                className={`p-2 rounded-lg transition-colors ${
                  settings.lockMode
                    ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={settings.lockMode ? 'Unlock Editing' : 'Lock Editing'}
              >
                {settings.lockMode ? <Lock className="w-4 h-4 sm:w-5 sm:h-5" /> : <Unlock className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              
              {/* Theme Toggle - Right side on desktop only */}
              <button
                onClick={toggleTheme}
                className="hidden sm:block p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Left Sidebar - Month Cards */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Monthly Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:space-y-0 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto scrollbar-hide">
                {allMonths.map(monthKey => {
                  const monthData = masterPlan[monthKey];
                  const progress = getMonthProgress(monthKey);
                  const enhancedProgress = getNotesBasedProgress(monthKey);
                  
                  if (!monthData) return null;
                  
                  return (
                    <MonthCard
                      key={monthKey}
                      monthKey={monthKey}
                      monthData={monthData}
                      progress={progress}
                      enhancedProgress={enhancedProgress}
                      isSelected={selectedMonth === monthKey}
                      onClick={() => handleMonthSelect(monthKey)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Right Content - Month Details */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Data Integrity Check */}
            {showDataCheck && (
              <DataIntegrityCheck />
            )}
             
            {selectedMonthData ? (
              <MonthDetail
                monthKey={selectedMonth}
                monthData={selectedMonthData}
                progress={monthProgress}
                enhancedProgress={getNotesBasedProgress(selectedMonth)}
                dailyProgress={dailyProgress}
                userNotes={userNotes}
                userSummary={selectedUserSummary}
                onDayClick={handleDayClick}
                onDayToggle={handleDayToggle}
                onUpdateUserSummary={handleUserSummaryUpdate}
                onUpdateMonthData={handleMasterPlanUpdate}
                onUpdateUserNote={handleNoteSave}
                onDeleteUserNote={handleNoteDelete}
                onNotesChange={handleNotesChange}
                isLocked={settings.lockMode}
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Select a month to view details
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Choose from the monthly overview on the {window.innerWidth >= 1024 ? 'left' : 'bottom'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Note Modal */}
      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal({ ...noteModal, isOpen: false })}
        monthKey={noteModal.monthKey}
        day={noteModal.day}
        existingNote={userNotes[noteModal.monthKey]?.[noteModal.day]}
        onSave={handleNoteSave}
        onDelete={handleNoteDelete}
      />
      
      {/* Mobile Bottom Actions */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-30">
        <div className="flex items-center justify-around">
          <button
            onClick={handleExportData}
            className="flex flex-col items-center space-y-1 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Download className="w-5 h-5" />
            <span className="text-xs">Export</span>
          </button>
          
          <label className="flex flex-col items-center space-y-1 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer">
            <Upload className="w-5 h-5" />
            <span className="text-xs">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleResetData}
            className="flex flex-col items-center space-y-1 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-xs">Reset</span>
          </button>
          
          <div className="flex flex-col items-center space-y-1 p-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 dark:text-green-400">Saved</span>
          </div>
        </div>
      </div>

      {/* Status Indicators - Desktop */}
      <div className="hidden sm:block fixed bottom-4 right-4 space-y-2 z-30">
        {/* Lock Mode Indicator */}
        {settings.lockMode && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm">
            <Lock className="w-4 h-4" />
            <span className="font-medium">Edit Mode Locked</span>
          </div>
        )}
        
        {/* Data Persistence Indicator */}
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm opacity-75">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Auto-saving</span>
        </div>
      </div>
    </div>
  );
}

export default App;