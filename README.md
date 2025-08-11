# MonHeure - Time Tracking App

[![React Native](https://img.shields.io/badge/React%20Native-0.79.4-blue?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.0-black?style=for-the-badge&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-2.0.11-green?style=for-the-badge)](https://www.nativewind.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A modern, intuitive time tracking application built with React Native and Expo. Track your work hours with precision, view detailed analytics, and manage your time efficiently with a beautiful, native iOS-style interface with optimized performance and smooth animations.

## ✨ Features

### 🕐 Core Time Tracking
- **One-Tap Punch In/Out** with haptic feedback
- **Real-time Session Timer** showing current work duration
- **Enhanced Glow Effects** with multiple visual layers
- **Time Editing** with validation and 24-hour format support
- **24-hour Format** time picker for precise time selection

### 🌙 Global Dark Mode Support
- **Full-App Dark Mode** with consistent theming
- **Theme Context** for seamless theme switching
- **Automatic Theme Persistence** across app sessions

### 📊 Enhanced Dashboard & Analytics
- **Productivity Score** with dynamic calculation and color-coded feedback
- **Today's Summary** with hours worked and sessions count
- **Weekly Overview** with productivity insights and work days tracking
- **Pull to Refresh** functionality with haptic feedback
- **Avatar Support** for personalized experience
- **Real-time Status** indicators with dynamic icons

### 📅 Modern Calendar & History
- **Smart Search & Filtering** with real-time search through notes and dates
- **Advanced Filtering Options** (All, Today, Week, Month) for quick access
- **Statistics Dashboard** showing total records and hours for filtered results
- **Enhanced Record Cards** with color-coded sections and better visual hierarchy
- **Smart Date Formatting** displaying "Today", "Yesterday", or short dates
- **Native Time Pickers** for precise time editing with validation
- **Time Validation** ensuring punch-out after punch-in
- **Notes Support** for adding context to entries with enhanced display
- **Inline Editing** for quick modifications with improved modal design

### 📈 Comprehensive Reporting System
- **Date Range Selection** with custom picker
- **Detailed Analytics** with total hours, days, and averages
- **PDF Report Generation** with professional formatting
- **Share Reports** via email or other apps
- **Weekend/Weekday Tracking** with visual indicators
- **Holiday Detection** for accurate reporting
- **Interactive Charts** and data visualization

### ⚙️ iPhone-Style Settings
- **Native iOS Design** with proper grouping and hierarchy
- **Settings Groups**: Appearance, Data Management, Support, About
- **iOS-Style Settings Rows** with icons, titles, and subtitles
- **Theme Toggle** with switch component
- **Data Management** (Export, Import, Clear Data)
- **Support Options** (Share App, Send Feedback)
- **About Section** with app version and legal info

### 🎨 Modern UI Design
- **Smooth Animations** powered by `react-native-reanimated`
- **Haptic Feedback** for enhanced user experience
- **Consistent Design Language** across all screens
- **Professional Typography** and spacing

### 🔧 Advanced Features
- **Smart Search & Filtering** with real-time search through records and advanced filtering options
- **Statistics Dashboard** with real-time calculations for filtered data
- **Error Handling** with comprehensive, user-friendly alerts
- **Database Statistics** tracking total entries and hours worked
- **Pull to Refresh** on all data screens
- **Professional PDF Design** for reports

### ⚡ Performance Optimizations
- **Optimized Animations** with reduced complexity and faster durations
- **Memory Management** with memoized components and callbacks
- **Smart Data Filtering** with efficient search algorithms and memoized statistics
- **Smooth Scrolling** with optimized re-renders and better list performance
- **Fast Navigation** with optimized handlers and consistent patterns
- **Reduced CPU Usage** with simplified animation sequences
- **Better Touch Response** with optimized haptic feedback timing

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Expo CLI** - Install globally: `npm install -g @expo/cli`
- **Git** - [Download here](https://git-scm.com/)
- **iOS Simulator** (macOS) or **Android Emulator** (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MonHeure-Mobile-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Physical Device**: Install Expo Go app and scan QR code

### Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Clear cache and restart
npx expo start --clear
```

## 📱 Screens

### Home Screen (UI Features)
- **Optimized animations** with reduced complexity and faster durations
- **Enhanced button interactions** with smooth scale animations
- **Real-time session timer** with optimized updates
- **Memoized UI components** for better performance
- **Simplified navigation** with 4-icon system
- **Better loading states** with improved visual feedback

### Dashboard Screen (UI Features)
- **Productivity Score** with dynamic calculation and color-coded feedback
- **Enhanced navigation** with 4-icon system (Home, Dashboard, History, Settings)
- **Real-time status indicators** with dynamic play/pause icons
- **Comprehensive analytics** with work days tracking
- **Quick actions** with functional navigation to other screens
- **Optimized animations** with simplified sequences
- **Success/Error haptic feedback** on refresh operations
- **Enhanced visual design** with improved shadows and spacing

### History Screen (UI Features)
- **Smart Search & Filtering** with real-time search bar and advanced filter tabs
- **Statistics Dashboard** showing total records and hours with beautiful visual cards
- **Enhanced Record Cards** with color-coded sections (start, end, duration) and better visual hierarchy
- **Smart Date Formatting** displaying "Today", "Yesterday", or short dates for better readability
- **Native Time Pickers** using `@react-native-community/datetimepicker` for precise time editing
- **Advanced Time Validation** ensuring end time is after start time with user-friendly alerts
- **Enhanced Notes Display** with chat bubble icons and better visual presentation
- **Improved Delete Functionality** with styled delete buttons and confirmation dialogs
- **Filter Tabs System** with All, Today, Week, and Month options for quick data access
- **Real-time Statistics** that update based on current search and filter selections
- **Enhanced Modal Design** with scrollable content and better button layout
- **Optimized list rendering** with better performance and smooth scrolling
- **Enhanced touch feedback** with consistent haptic responses and visual feedback
- **Improved loading states** with descriptive feedback and better visual design

### Report Screen (UI Features)
- **Date range picker** with custom selection
- **Comprehensive analytics** with detailed statistics
- **PDF generation** with professional formatting
- **Share functionality** via email and other apps
- **Interactive charts** and data visualization
- **Weekend/weekday tracking** with visual indicators
- **Holiday detection** for accurate reporting

### Settings Screen (UI Features)
- **iPhone-style design** with native iOS appearance
- **Settings groups** with proper organization
- **iOS-style settings rows** with icons and subtitles
- **Theme toggle** with switch component
- **Data management** options (Export, Import, Clear)
- **Support section** with feedback options
- **About section** with app information

## 🛠 Tech Stack

### Core Framework
- **React Native** - Cross-platform mobile development
- **Expo SDK 53** - Development platform and tools
- **TypeScript** - Type safety and better development experience

### Styling & UI
- **NativeWind** - Tailwind CSS for React Native
- **react-native-reanimated** - Smooth animations and interactions
- **expo-haptics** - Haptic feedback for enhanced UX

### Navigation
- **Expo Router** - File-based navigation system

### State Management
- **Zustand** - Lightweight state management with persistence

### Database & Storage
- **expo-sqlite** - Robust local database storage
- **AsyncStorage** - Settings and preferences storage

### UI Components
- **@react-native-community/datetimepicker** - Native date/time selection with enhanced functionality
- **react-native-safe-area-context** - Safe area handling
- **expo-linear-gradient** - Gradient effects

### Reporting & Sharing
- **react-native-html-to-pdf** - PDF report generation
- **react-native-share** - Share functionality
- **react-native-chart-kit** - Data visualization

### Development Tools
- **Metro** - JavaScript bundler
- **Babel** - JavaScript compiler with plugins
- **Tailwind CSS** - Utility-first CSS framework

## 📁 Project Structure

```
MonHeure-Mobile-App/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout configuration
│   ├── index.tsx          # Home screen
│   ├── dashboard.tsx      # Dashboard screen
│   ├── history.tsx        # History screen
│   ├── report.tsx         # Report screen
│   └── settings.tsx       # Settings screen
├── screens/               # Screen components
│   ├── HomeScreen.tsx     # Main time tracking interface
│   ├── DashboardScreen.tsx # Analytics and overview
│   ├── HistoryScreen.tsx  # Time logs and history
│   ├── ReportScreen.tsx   # Comprehensive reporting
│   └── SettingsScreen.tsx # App settings and preferences
├── utils/                 # Utility functions and contexts
│   ├── database.ts        # Database operations
│   ├── punchStore.ts      # Zustand state management
│   ├── themeContext.tsx   # Theme management
│   ├── timeCalculations.ts # Time calculation utilities
│   ├── shareUtils.ts      # Sharing functionality
│   └── pdfGenerator.ts    # PDF report generation
├── components/            # Reusable components
│   └── DateRangePicker.tsx # Custom date range picker
├── assets/               # Images, fonts, and static files
├── global.css            # Tailwind CSS directives
├── tailwind.config.js    # Tailwind configuration
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler configuration
└── package.json          # Dependencies and scripts
```

## 📚 Additional Documentation

For detailed information about specific features, see:
- **[DATABASE_FEATURES.md](DATABASE_FEATURES.md)** - Database operations and schema
- **[HISTORY_FEATURES.md](HISTORY_FEATURES.md)** - Time logs and history functionality
- **[REPORT_FEATURES.md](REPORT_FEATURES.md)** - Reporting and analytics features

## 🎯 Recent Updates

### Enhanced History Screen with Advanced Features (Latest)
- **Smart Search & Filtering System** with real-time search through notes and dates
- **Advanced Filtering Options** with All, Today, Week, and Month tabs for quick data access
- **Statistics Dashboard** showing total records and hours with beautiful visual cards and real-time updates
- **Enhanced Record Cards** with color-coded sections (start, end, duration) and improved visual hierarchy
- **Smart Date Formatting** displaying "Today", "Yesterday", or short dates for better readability
- **Native Time Pickers** using `@react-native-community/datetimepicker` for precise time editing
- **Advanced Time Validation** ensuring end time is after start time with user-friendly error alerts
- **Enhanced Notes Display** with chat bubble icons and better visual presentation
- **Improved Delete Functionality** with styled delete buttons and confirmation dialogs
- **Real-time Statistics** that update based on current search and filter selections
- **Enhanced Modal Design** with scrollable content, better button layout, and improved UX
- **Performance Optimizations** with memoized statistics and efficient filtering algorithms

### Performance Optimizations & Smoothness Improvements (Latest)
- **Reduced Animation Complexity** with simplified sequences and faster durations (400-600ms)
- **Memory Management** with memoized components using `React.memo` and `useCallback`
- **Optimized Re-renders** with proper dependency arrays and memoized calculations
- **Enhanced Touch Interactions** with optimized haptic feedback timing
- **Smooth Scrolling** with reduced animation values and better list performance
- **Fast Navigation** with optimized handlers and consistent 4-icon navigation
- **Better Loading States** with improved visual feedback and descriptive text
- **Reduced CPU Usage** by removing complex animation sequences and unnecessary calculations

### Enhanced Dashboard with Productivity Score (Latest)
- **Dynamic Productivity Score** with color-coded feedback (Green ≥80%, Yellow ≥60%, Red <60%)
- **Enhanced Navigation** with 4-icon system (Home, Dashboard, History, Settings)
- **Real-time Status Indicators** with dynamic play/pause icons
- **Comprehensive Analytics** with work days tracking and additional metrics
- **Functional Quick Actions** with navigation to Report, History, and Settings
- **Staggered Animations** for different card sections with smooth transitions
- **Success/Error Haptic Feedback** on refresh operations
- **Enhanced Visual Design** with improved shadows, spacing, and contrast

### Enhanced iPhone-Style Settings (Latest)
- **Native iOS Design** with proper grouping and visual hierarchy
- **Settings Groups**: Appearance, Data Management, Support, About
- **iOS-Style Settings Rows** with icons, titles, and subtitles
- **Theme Toggle** with native switch component
- **Data Management** options with proper destructive styling
- **Support Section** with feedback and sharing options
- **About Section** with app version and legal information
- **App Icon** display at bottom with version info
- **Consistent Spacing** and typography matching iOS standards

### Comprehensive Reporting System (Latest)
- **Date Range Selection** with custom picker component
- **Detailed Analytics** with total hours, days, and averages
- **PDF Report Generation** with professional formatting
- **Share Reports** via email and other applications
- **Weekend/Weekday Tracking** with visual indicators
- **Holiday Detection** for accurate reporting
- **Interactive Charts** and data visualization

### Enhanced Home Screen Animations (Latest)
- **Multiple glow layers** for enhanced visual depth
- **Enhanced button animations** with bounce and rotation effects
- **Improved haptic feedback** for better user experience
- **Better visual hierarchy** with proper spacing and typography
- **Consistent dark mode support** across all elements
- **Time editing functionality** with validation
- **24-hour time picker** for precise time selection

### Modern Navigation System
- **4-Icon Navigation** (Home, Dashboard, History, Settings) with top-level icons
- **Active state indicators** with purple highlighting
- **Smooth transitions** between screens
- **Consistent navigation** across all screens

## 🔧 Configuration Files

### Babel Configuration (`babel.config.js`)
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
      'expo-router/babel',
    ],
  };
};
```

### Metro Configuration (`metro.config.js`)
```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for native modules
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add support for NativeWind
config.resolver.sourceExts.push('css');

module.exports = config;
```

### Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler errors**
   ```bash
   npx expo start --clear
   ```

2. **NativeWind styles not working**
   - Ensure `global.css` is imported in `_layout.tsx`
   - Check `babel.config.js` has `nativewind/babel` plugin
   - Verify `tailwind.config.js` content paths

3. **Reanimated animations not working**
   - Ensure `react-native-reanimated/plugin` is in babel config
   - Restart the development server

4. **SQLite database issues**
   - Check database initialization in `punchStore.ts`
   - Verify table creation scripts

5. **PDF generation errors**
   - Ensure `react-native-html-to-pdf` is properly installed
   - Check file permissions on device

6. **Performance issues**
   - Clear Metro cache: `npx expo start --clear`
   - Restart development server
   - Check for memory leaks in animations
   - Verify all `useCallback` and `useMemo` dependencies

### Development Tips

- Use Expo DevTools for debugging
- Enable React Native Debugger for better debugging
- Use TypeScript strict mode for better code quality
- Test on both iOS and Android regularly
- Clear cache when experiencing unexpected behavior
- Monitor performance with React DevTools Profiler
- Use `console.log` sparingly in production builds

## 🎨 Design Philosophy

MonHeure follows modern mobile design principles:

- **Native Feel**: Mimics iOS and Android native patterns
- **Accessibility**: Proper touch targets, contrast, and screen reader support
- **Performance**: Optimized animations and smooth interactions
- **Consistency**: Unified design language across all screens
- **Simplicity**: Clean, uncluttered interface focused on core functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for excellent libraries and tools
- **Tailwind CSS** for the utility-first styling approach
- **Zustand** for lightweight state management
- **react-native-reanimated** for smooth animations
- **expo-haptics** for enhanced user feedback

---

**MonHeure** - Time tracking made simple and beautiful. ⏰✨ 