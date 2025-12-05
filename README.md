# Strategic Planner Dashboard

A modern, responsive React.js calendar dashboard web app for strategic planning and goal tracking from December 2025 to September 2027.

## Features

### ✅ Core Layout
- **Left Column**: 12 stacked month cards (December 2025 - September 2027)
- **Right Side**: Dynamic display of selected month's targets, achievement steps, and monthly summary

### ✅ Permanent Monthly Strategy Data
- Complete preloaded monthly roadmap from December 2025 to September 2027
- Each month includes:
  - Strategic targets
  - How to achieve steps
  - Monthly goals summary
- Data persists using localStorage (saved forever unless manually edited/deleted)

### ✅ Daily Date Marking System
- Click any date to add personal notes
- Double-click to mark as ✅ completed
- Visual progress indicators for each month
- Blue dots indicate days with notes
- Green checkmarks show completed days

### ✅ Monthly Summary Panel
- Fixed editable summary section for each month
- Personal reflections section separate from master strategy
- Users can add insights without overwriting original plan

### ✅ Dark / Light Mode
- Toggle button in header
- Theme preference saved permanently
- Smooth transitions between themes

### ✅ Advanced Features
- **Automatic Progress Tracking**: Monthly progress percentage based on completed days
- **Editable Goals**: Modify targets and steps without breaking master plan
- **Search Functionality**: Find specific goals, targets, and summaries across all months

- **Lock Mode**: Prevent accidental edits
- **Data Backup**: Export/import all data as JSON
- **Reset Function**: Restore original master plan

## Tech Stack

- **React.js** with functional components and hooks
- **Tailwind CSS** for styling and responsive design
- **Lucide React** for icons
- **Vite** for fast development and building
- **localStorage** for persistent data storage

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

### Navigation
- Click any month card on the left to view its details
- Use the search bar to find specific content across all months
- Toggle between light/dark themes using the moon/sun icon

### Daily Progress
- **Single Click**: Add/edit personal notes for any day
- **Double Click**: Mark day as completed/incomplete
- Progress bars show completion percentage for each month

### Editing Content
- Click edit icons (pencil) to modify targets, steps, or summaries
- Use lock mode (lock icon) to prevent accidental changes
- Personal reflections are separate from master strategy data

### Data Management
- **Export**: Download all data as JSON backup
- **Import**: Restore data from JSON backup
- **Reset**: Restore original master plan (with confirmation)

## Project Structure

```
src/
├── components/
│   ├── Calendar.jsx          # Daily calendar with progress tracking
│   ├── MonthCard.jsx         # Month overview cards
│   ├── MonthDetail.jsx       # Detailed month view
│   ├── NoteModal.jsx         # Daily note editing modal
│   ├── SearchBar.jsx         # Search functionality
│   └── SearchResults.jsx     # Search results display
├── data/
│   └── masterPlan.js         # Complete strategic roadmap data
├── utils/
│   ├── storage.js            # localStorage management
│   └── pdfExport.js          # PDF export functionality
├── App.jsx                   # Main application component
└── main.jsx                  # Application entry point
```

## Features in Detail

### Strategic Planning
- 22 months of detailed strategic planning
- Each month contains 4 targets and 4 achievement steps
- Comprehensive monthly summaries for context

### Progress Tracking
- Visual progress indicators on month cards
- Color-coded progress (red < 40%, orange 40-60%, yellow 60-80%, green 80%+)
- Daily completion tracking with calendar interface

### Data Persistence
- All user data stored in localStorage
- Automatic saving of notes, progress, and edits
- Data survives browser restarts and system reboots

### Responsive Design
- Fully responsive for desktop and mobile
- Clean, minimalist planner aesthetic
- Smooth animations and transitions
- Accessible color schemes for both themes

## Browser Compatibility

- Modern browsers with ES6+ support
- localStorage support required
- Tested on Chrome, Firefox, Safari, and Edge