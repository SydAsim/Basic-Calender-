import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { validateData, createAutoBackup, getAutoBackups } from '../utils/storage';

const DataIntegrityCheck = () => {
  const [issues, setIssues] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const [backups, setBackups] = useState([]);

  const runIntegrityCheck = async () => {
    setIsChecking(true);
    
    // Simulate checking delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const validationIssues = validateData();
    setIssues(validationIssues);
    setLastCheck(new Date());
    setBackups(getAutoBackups());
    
    setIsChecking(false);
  };

  useEffect(() => {
    runIntegrityCheck();
  }, []);

  const createBackup = () => {
    const success = createAutoBackup();
    if (success) {
      setBackups(getAutoBackups());
    }
  };

  if (issues.length === 0 && !isChecking) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
              Data Integrity: All Good
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Your data is secure and backed up. Last check: {lastCheck?.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {isChecking ? (
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          ) : issues.length > 0 ? (
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          )}
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Data Integrity Check
          </h3>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={runIntegrityCheck}
            disabled={isChecking}
            className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : 'Check Now'}
          </button>
          <button
            onClick={createBackup}
            className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800"
          >
            Backup Now
          </button>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Found {issues.length} issue{issues.length !== 1 ? 's' : ''}:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {issues.map((issue, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-yellow-500">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {backups.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Available backups: {backups.length}
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Latest: {backups[0]?.date}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataIntegrityCheck;