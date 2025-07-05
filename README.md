# MonHeure - Time Tracking Mobile App

A modern React Native mobile application built with Expo for efficient time tracking and punch-in/punch-out management with comprehensive reporting, analytics, and beautiful UI design.

## 🚀 Features

### 🎯 Core Time Tracking
- **Large Circular Punch Button**: Vibrant gradient button (blue to purple) with smooth animations
- **Real-time Status Display**: Shows current punch status with time information
- **One-tap Operation**: Simple, intuitive time tracking with visual feedback
- **Glow Effects**: Subtle animations and visual feedback on interactions
- **Session Persistence**: State survives app restarts and crashes

### 📊 Enhanced Dashboard & Analytics
- **Horizontally Scrollable Stat Cards**: 
  - "This Week" (Blue gradient)
  - "Last 2 Weeks" (Teal gradient) 
  - "This Month" (Orange gradient)
  - "This Year" (Violet gradient)
- **Interactive Charts**: Bar and line charts with `react-native-chart-kit`
- **Time Period Toggle**: Switch between week/month/year views
- **Productivity Insights**: Best day tracking, consistency metrics
- **Smooth Animations**: Staggered entrance animations and transitions

### 📅 Modern Calendar & History
- **Interactive Calendar View**: Visual calendar with activity dots using `react-native-calendars`
- **Slide-up Day Cards**: Tap any date to see detailed punch information
- **Color-coded Status**: 
  - 🟢 Green dots: Completed days (punch-in + punch-out)
  - 🟡 Yellow dots: In-progress days (punch-in only)
- **Full CRUD Operations**: Create, read, update, and delete punch records
- **Swipe Gestures**: Swipe down to dismiss day cards
- **Pastel Backgrounds**: Beautiful gradient backgrounds for different statuses

### 📈 Comprehensive Reporting
- **Custom Date Range Reports**: Select any date range with interactive date picker
- **Summary Dashboard**: Total days, records, hours, and average per day
- **Detailed Records**: All punch-in/out entries grouped by day with notes
- **PDF Export**: Generate professional PDF reports with `react-native-html-to-pdf`
- **Share & Email**: Share reports via email or other apps with `react-native-share`
- **Quick Actions**: One-tap for common ranges (last 2 weeks, last month, today)

### 🎨 Modern UI Design
- **Gradient Backgrounds**: Beautiful color gradients throughout the app
- **Rounded Corners**: Modern card design with proper border radius
- **Soft Shadows**: Subtle shadows for depth and visual hierarchy
- **Smooth Animations**: Spring-based animations with proper easing
- **Touch-Friendly**: Large touch targets and generous spacing
- **Responsive Design**: Works seamlessly on all screen sizes

### 🔧 Advanced Features
- **Global State Management**: Zustand-powered state management with persistence
- **AsyncStorage Database**: Robust local database storage with full CRUD operations
- **Sample Data Generation**: Load sample data for testing and demonstration
- **Data Export**: Export all data with comprehensive reporting
- **Data Integrity**: Proper validation and error handling
- **Pull to Refresh**: Swipe down to refresh data across all screens

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
- **react-native-chart-kit** for analytics and data visualization
- **react-native-html-to-pdf** for professional PDF export
- **react-native-share** for cross-platform sharing
- **@react-native-community/datetimepicker** for date/time selection
- **react-native-modal** for modal dialogs
- **expo-linear-gradient** for beautiful gradient effects
- **react-native-reanimated** for smooth animations

## 📱 Screenshots & UI Features

The app features a modern, intuitive interface with:

### 🏠 Home Screen
- **Large circular gradient button** (72x72) that toggles between "Punch In" and "Punch Out"
- **Vibrant gradients**: Blue to purple for punch-in, red gradient for punch-out
- **Status text**: Shows current punch status with time information
- **Glow effects**: Subtle animations and visual feedback
- **Calendar-style card**: Today's punches in a clean, organized layout
- **Smooth animations**: Spring-based animations with proper easing

### 📊 Dashboard Screen
- **Horizontally scrollable stat cards** with gradient backgrounds and icons
- **Interactive charts**: Bar and line charts with custom styling
- **Time period toggle**: Switch between week/month/year views
- **Productivity insights**: Enhanced metrics with visual indicators
- **Quick actions**: Touchable cards with gradient backgrounds

### 📅 History Screen
- **Interactive calendar** with color-coded activity dots
- **Slide-up day cards**: Modal interface with swipe-to-dismiss
- **Pastel backgrounds**: Gradient backgrounds for different record statuses
- **Edit/Delete buttons**: Icon-based buttons with proper styling
- **Smooth transitions**: Spring animations for all interactions

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
│   ├── HomeScreen.tsx      # Redesigned punch interface with gradient button
│   ├── DashboardScreen.tsx # Enhanced analytics with charts and stat cards
│   ├── HistoryScreen.tsx   # Modern calendar with slide-up day cards
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
│   ├── timeCalculations.ts # Enhanced time calculation utilities with chart data
│   ├── storage.ts         # AsyncStorage helpers for settings
│   ├── sampleData.ts      # Sample data generator for testing
│   ├── pdfGenerator.ts    # Professional PDF report generator
│   ├── shareUtils.ts      # Cross-platform sharing utilities
│   ├── designSystem.ts    # Design system utilities
│   └── punchStore.ts      # Enhanced state management
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

### Enhanced Punch In/Out System
- **Large Gradient Button**: 72x72 circular button with vibrant gradients
- **Visual Status**: Button color and icon change based on work status
- **Status Text**: Real-time display of current punch status
- **Glow Effects**: Subtle animations for visual feedback
- **One Tap Operation**: Simple, quick time tracking
- **Session Persistence**: State survives app restarts and crashes

### Modern Calendar-Based History
- **Interactive Calendar**: See punch activity at a glance with color-coded dots
- **Slide-up Day Cards**: Tap any date for comprehensive punch record view
- **Swipe Gestures**: Swipe down to dismiss day cards
- **Pastel Backgrounds**: Beautiful gradient backgrounds for different statuses
- **Edit/Delete**: Full CRUD operations with icon-based buttons
- **Sample Data**: Load sample data for testing and demonstration

### Advanced Dashboard & Analytics
- **Stat Cards**: Horizontally scrollable cards with gradient backgrounds
- **Interactive Charts**: Bar and line charts with custom styling
- **Time Period Toggle**: Switch between week/month/year views
- **Productivity Insights**: Enhanced metrics with visual indicators
- **Smooth Animations**: Staggered entrance animations for all elements

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

The app uses **NativeWind** (Tailwind CSS for React Native) with modern design principles:
- **Gradient Backgrounds**: Beautiful color gradients throughout the app
- **Rounded Corners**: Modern card design with proper border radius
- **Soft Shadows**: Subtle shadows for depth and visual hierarchy
- **Smooth Animations**: Spring-based animations with proper easing
- **Responsive Design**: Adapts to all screen sizes and orientations
- **Touch-Friendly**: Large touch targets and generous spacing
- **Accessibility**: Proper contrast ratios and visual feedback

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

### Animation System
```typescript
// Spring animations for smooth interactions
const buttonScale = useSharedValue(1);
const cardOpacity = useSharedValue(0);

// Animated styles
const buttonAnimatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: buttonScale.value }],
}));
```

### Adding New Features
1. Create new screen components in `screens/`
2. Add navigation routes in `app/` directory (Expo Router)
3. Style using Tailwind classes via NativeWind
4. Add types in `types/` directory
5. Implement database operations in `utils/database.ts`
6. Update Zustand store in `utils/punchStore.ts` if needed
7. Add animations using react-native-reanimated

### Code Style
- **TypeScript** for type safety and better development experience
- **Functional Components** with React hooks for state management
- **Zustand** for global state management with persistence
- **Tailwind CSS** for consistent, maintainable styling
- **React Native Reanimated** for smooth animations
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

### 🎨 UI/UX Redesign (Latest)
- **Home Screen**: Large circular gradient button with glow effects and status text
- **Dashboard**: Horizontally scrollable stat cards with gradient backgrounds
- **History Screen**: Slide-up day cards with pastel backgrounds and swipe gestures
- **Enhanced Animations**: Spring-based animations throughout the app
- **Modern Design**: Gradient backgrounds, rounded corners, and soft shadows

### 📊 Enhanced Analytics
- **Interactive Charts**: Bar and line charts with react-native-chart-kit
- **Time Period Toggle**: Switch between week/month/year views
- **Stat Cards**: Beautiful gradient cards with icons and metrics
- **Productivity Insights**: Enhanced metrics with visual indicators

### 🛠 Technical Improvements
- **Expo SDK 53**: Upgraded to latest Expo SDK with React 19
- **React Native Reanimated**: Smooth animations throughout the app
- **Expo Linear Gradient**: Beautiful gradient effects
- **Enhanced State Management**: Improved Zustand store with better persistence
- **Performance Optimization**: Better rendering and animation performance

### 📱 Enhanced Features
- **Calendar View**: Interactive calendar with visual activity indicators
- **PDF Export**: Professional PDF report generation with company branding
- **Data Validation**: Added comprehensive validation for all user inputs
- **Sample Data**: Built-in sample data generator for testing and demonstration
- **Touch Interactions**: Improved touch feedback and gesture handling

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

**Built with ❤️ using React Native, Expo, and modern design principles** 