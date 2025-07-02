# MonHeure - Time Tracking Mobile App

A React Native mobile application built with Expo for efficient time tracking and punch-in/punch-out management with comprehensive reporting and data management features.

## 🚀 Features

### Core Time Tracking
- **Punch In/Out System**: Simple one-tap time tracking with visual status indicators
- **Daily Time Management**: Track work hours with real-time calculations
- **Time Editing**: Edit punch-in and punch-out times with validation
- **Notes Support**: Add notes to punch records for better tracking
- **Global State Management**: Zustand-powered state management with persistence across sessions

### Advanced History & Calendar
- **Interactive Calendar View**: Visual calendar with activity indicators using `react-native-calendars`
- **Day Details**: Tap any date to see punch-in/out times, total hours, and notes
- **Full CRUD Operations**: Create, read, update, and delete punch records
- **Visual Status Indicators**: 
  - Green dots: Completed days (punch-in + punch-out)
  - Yellow dots: In-progress days (punch-in only)
  - Blue highlight: Currently selected date

### Comprehensive Reporting
- **Custom Date Range Reports**: Select any date range with interactive date picker
- **Summary Dashboard**: Total days, records, hours, and average per day
- **Detailed Records**: All punch-in/out entries grouped by day with notes
- **PDF Export**: Generate professional PDF reports with `react-native-html-to-pdf`
- **Share & Email**: Share reports via email or other apps with `react-native-share`
- **Quick Actions**: One-tap for common ranges (last 2 weeks, last month, today)

### Data Management
- **AsyncStorage Database**: Robust local database storage with full CRUD operations
- **Sample Data Generation**: Load sample data for testing and demonstration
- **Data Export**: Export all data with comprehensive reporting
- **Data Integrity**: Proper validation and error handling
- **State Persistence**: Automatic state restoration across app sessions

### Settings & Preferences
- **Theme Toggle**: Switch between dark and light mode (persisted)
- **Clear All Data**: Permanently delete all stored data with confirmation
- **Store State Management**: Reset Zustand store state independently
- **Pull to Refresh**: Swipe down to refresh data across all screens
- **Responsive Design**: Works seamlessly on all screen sizes

## 🛠 Tech Stack

- **React Native** with **Expo SDK 53**
- **React 19** and **React Native 0.79.4**
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS for React Native) for styling
- **Expo Router** for file-based navigation
- **Zustand** for global state management with persistence
- **Expo Vector Icons** for beautiful icons
- **AsyncStorage** for robust local database storage and settings
- **react-native-calendars** for interactive calendar UI
- **react-native-html-to-pdf** for professional PDF export
- **react-native-share** for cross-platform sharing
- **@react-native-community/datetimepicker** for date/time selection
- **react-native-modal** for modal dialogs
- **react-native-chart-kit** for analytics and charts

## 📱 Screenshots & UI Features

The app features a clean, modern interface with:
- **Large punch button** that changes color based on work status (green for punch-in, red for punch-out)
- **Daily time display** with editable punch times and real-time calculations
- **Interactive calendar** with visual activity indicators and day selection
- **Modal-based time picker** for corrections with 24-hour format validation
- **Professional PDF reports** with company branding and complete data export
- **Real-time status indicators** showing current punch state across all screens
- **Responsive design** that works seamlessly on all screen sizes

## 🚦 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MonHeure-Mobile-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Install Expo Go on your mobile device
   - Scan the QR code displayed in the terminal
   - The app will load on your device

## 📁 Project Structure

```
MonHeure-Mobile-App/
├── app/                    # Expo Router file-based navigation
│   ├── _layout.tsx        # Root layout with tab navigation
│   ├── index.tsx          # Home screen route
│   ├── dashboard.tsx      # Dashboard screen route
│   ├── history.tsx        # History screen route
│   ├── report.tsx         # Report screen route
│   └── settings.tsx       # Settings screen route
├── screens/
│   ├── HomeScreen.tsx      # Main punch in/out interface with daily overview
│   ├── DashboardScreen.tsx # Analytics dashboard with productivity insights
│   ├── HistoryScreen.tsx   # Calendar-based history with full CRUD operations
│   ├── ReportScreen.tsx    # Custom date range reporting & PDF export
│   └── SettingsScreen.tsx  # Preferences, theme, data management
├── components/
│   ├── EditPunchModal.tsx  # Modal for editing punch records with validation
│   └── DateRangePicker.tsx # Interactive date range picker for reports
├── types/
│   ├── nativewind.d.ts     # NativeWind type definitions
│   └── punch.ts           # Punch data types and interfaces
├── utils/
│   ├── database.ts        # AsyncStorage database operations and CRUD functions
│   ├── punchStore.ts      # Zustand global state management store
│   ├── timeCalculations.ts # Time calculation utilities
│   ├── storage.ts         # AsyncStorage helpers for settings
│   ├── sampleData.ts      # Sample data generator for testing
│   ├── pdfGenerator.ts    # Professional PDF report generator
│   └── shareUtils.ts      # Cross-platform sharing utilities
├── package.json          # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── metro.config.js      # Metro bundler configuration
```

## 🎯 Core Functionality

### Global State Management with Zustand
- **Persistent State**: Punch status and data persist across app sessions
- **Real-time Updates**: All screens automatically update when state changes
- **Database Sync**: Automatic synchronization between store and database
- **Helper Hooks**: `usePunchStatus()`, `useTodayData()`, `usePunchActions()`

### Punch In/Out System
- **Visual Status**: Button color and icon change based on work status
- **One Tap Operation**: Simple, quick time tracking
- **Real-time Updates**: Immediate visual feedback and data persistence
- **Validation**: Ensures punch-out time is after punch-in time
- **Session Persistence**: State survives app restarts and crashes

### Calendar-Based History
- **Interactive Calendar**: See punch activity at a glance with color-coded dots
- **Day Details**: Tap any date for comprehensive punch record view
- **Edit/Delete**: Full CRUD operations with modal-based editing
- **Sample Data**: Load 30 days of sample data for testing and demonstration
- **Real-time Sync**: Updates automatically when punch state changes

### Custom Date Range Reports
- **Flexible Date Selection**: Choose any date range with interactive picker
- **Comprehensive Summary**: Total days, records, hours, and average calculations
- **Detailed Records**: All entries grouped by day with complete information
- **Professional PDF Export**: Beautiful, formatted reports with company branding
- **Multiple Share Options**: Email, messaging, or save to device

### Data Management
- **AsyncStorage Database**: Robust, performant local storage with full CRUD operations
- **Data Integrity**: Proper validation, error handling, and transaction support
- **Sample Data**: Generate realistic sample data for testing and demonstration
- **Export Capabilities**: Complete data export with professional formatting
- **State Persistence**: Automatic state restoration and database synchronization

## 🎨 Styling & UI

The app uses **NativeWind** (Tailwind CSS for React Native) for consistent styling:
- **Responsive Design**: Adapts to all screen sizes and orientations
- **Modern Color Scheme**: Professional color palette with status indicators
- **Clean Typography**: Readable fonts with proper hierarchy
- **Smooth Animations**: Subtle transitions and loading states
- **Accessibility**: Proper contrast ratios and touch targets

## 🔧 Development

### State Management with Zustand
```typescript
// Get current punch status
const { isPunchedIn, currentPunchInTime } = usePunchStatus();

// Get today's data
const { todayEntries, totalHoursToday } = useTodayData();

// Perform punch actions
const { punchIn, punchOut, updateCurrentPunch } = usePunchActions();
```

### Adding New Features
1. Create new screen components in `screens/`
2. Add navigation routes in `app/` directory (Expo Router)
3. Style using Tailwind classes via NativeWind
4. Add types in `types/` directory
5. Implement database operations in `utils/database.ts`
6. Update Zustand store in `utils/punchStore.ts` if needed

### Code Style
- **TypeScript** for type safety and better development experience
- **Functional Components** with React hooks for state management
- **Zustand** for global state management with persistence
- **Tailwind CSS** for consistent, maintainable styling
- **Async/await** for database and storage operations
- **Error Handling** with proper user feedback

### Database Operations
- **AsyncStorage Integration**: All punch data stored in local AsyncStorage database
- **CRUD Operations**: Full create, read, update, delete functionality
- **Query Optimization**: Efficient queries with proper data structure
- **Transaction Support**: Data integrity with proper error handling
- **State Synchronization**: Automatic sync between Zustand store and database

## 📦 Building for Production

### Android APK
```bash
npx expo build:android
```

### iOS App Store
```bash
npx expo build:ios
```

## 🔄 Recent Updates

### Expo SDK 53 Upgrade
- Upgraded from Expo SDK 50 to SDK 53
- Updated to React 19 and React Native 0.79.4
- Migrated to Expo Router for file-based navigation
- Updated all dependencies to latest compatible versions

### Zustand State Management
- Implemented global state management with Zustand
- Added persistence across app sessions
- Real-time state synchronization across all screens
- Automatic database synchronization
- Helper hooks for common state access patterns

### Database Migration
- Migrated from SQLite to AsyncStorage for better compatibility
- Maintained all CRUD operations and data integrity
- Improved performance and reliability
- Better integration with Zustand state management

### Enhanced Features
- **Calendar View**: Interactive calendar with visual activity indicators
- **PDF Export**: Professional PDF report generation with company branding
- **Enhanced UI**: Improved design with better visual feedback and animations
- **Data Validation**: Added comprehensive validation for all user inputs
- **Sample Data**: Built-in sample data generator for testing and demonstration

## 🐛 Known Issues

- **Sharing Features**: Temporarily disabled due to native module linking issues in SDK 53
- **Unmaintained Packages**: Some packages like `react-native-html-to-pdf` are unmaintained but functional

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using React Native and Expo** 