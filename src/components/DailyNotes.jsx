import React, { useState } from 'react';
import { 
  StickyNote, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  Calendar
} from 'lucide-react';

const DailyNotes = ({ 
  monthKey,
  userNotes,
  onUpdateNote,
  onDeleteNote,
  onNotesChange,
  isLocked
}) => {
  const [editingNote, setEditingNote] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newNoteDay, setNewNoteDay] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const monthNotes = userNotes[monthKey] || {};
  const noteEntries = Object.entries(monthNotes).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  const handleEditNote = (day, content) => {
    setEditingNote(day);
    setEditedContent(content);
  };

  const handleSaveEdit = () => {
    if (editedContent.trim()) {
      onUpdateNote(monthKey, editingNote, editedContent.trim());
    } else {
      onDeleteNote(monthKey, editingNote);
    }
    setEditingNote(null);
    setEditedContent('');
    if (onNotesChange) onNotesChange();
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditedContent('');
  };

  const handleAddNew = () => {
    if (newNoteDay && newNoteContent.trim()) {
      onUpdateNote(monthKey, newNoteDay, newNoteContent.trim());
      setIsAddingNew(false);
      setNewNoteDay('');
      setNewNoteContent('');
      if (onNotesChange) onNotesChange();
    }
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewNoteDay('');
    setNewNoteContent('');
  };

  const getDaysInMonth = () => {
    const [year, month] = monthKey.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const getAvailableDays = () => {
    const totalDays = getDaysInMonth();
    const usedDays = Object.keys(monthNotes).map(Number);
    return Array.from({ length: totalDays }, (_, i) => i + 1)
      .filter(day => !usedDays.includes(day));
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-accent-amber-500 text-white">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Daily Notes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {noteEntries.length} notes recorded
            </p>
          </div>
        </div>
        {!isLocked && !isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-accent-amber-500 text-white rounded-lg hover:bg-accent-amber-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Note</span>
          </button>
        )}
      </div>

      {/* Add new note form */}
      {isAddingNew && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-500">
          <div className="flex items-center space-x-3 mb-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={newNoteDay}
              onChange={(e) => setNewNoteDay(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="">Select day...</option>
              {getAvailableDays().map(day => (
                <option key={day} value={day}>Day {day}</option>
              ))}
            </select>
          </div>
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Write your note for this day..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm resize-none"
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={handleCancelAdd}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNew}
              disabled={!newNoteDay || !newNoteContent.trim()}
              className="flex items-center space-x-1 px-3 py-1 bg-accent-amber-500 text-white rounded-md hover:bg-accent-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Save className="w-3 h-3" />
              <span>Save</span>
            </button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {noteEntries.length === 0 ? (
        <div className="text-center py-8">
          <StickyNote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
            No notes yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {isLocked ? 'Unlock to add daily notes' : 'Click "Add Note" to start recording your daily thoughts'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {noteEntries.map(([day, content]) => (
            <div key={day} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {day}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Day {day}
                  </span>
                </div>
                {!isLocked && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditNote(day, content)}
                      className="p-1 text-gray-500 hover:text-accent-blue-600 dark:hover:text-accent-blue-400"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        onDeleteNote(monthKey, day);
                        if (onNotesChange) onNotesChange();
                      }}
                      className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              
              {editingNote === day ? (
                <div className="space-y-3">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center space-x-1 px-3 py-1 bg-accent-blue-500 text-white rounded-md hover:bg-accent-blue-600 text-sm"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                  {content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyNotes;