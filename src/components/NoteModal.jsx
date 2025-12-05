import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

const NoteModal = ({ 
  isOpen, 
  onClose, 
  monthKey, 
  day, 
  existingNote, 
  onSave, 
  onDelete 
}) => {
  const [note, setNote] = useState('');
  
  useEffect(() => {
    setNote(existingNote || '');
  }, [existingNote, isOpen]);
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    if (note.trim()) {
      onSave(monthKey, day, note.trim());
    } else if (existingNote) {
      onDelete(monthKey, day);
    }
    onClose();
  };
  
  const handleDelete = () => {
    onDelete(monthKey, day);
    onClose();
  };
  
  const monthData = monthKey.split('-');
  const monthName = new Date(parseInt(monthData[0]), parseInt(monthData[1]) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Note for {monthName} {day}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add your note for this day..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
        
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            {existingNote && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;