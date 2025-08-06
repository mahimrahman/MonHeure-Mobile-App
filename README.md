# MonHeure - Time Tracking App

A modern, intuitive time tracking application built with React Native and Expo. Track your work hours with precision, view detailed analytics, and manage your time efficiently with a beautiful, native iOS-style interface.

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
- **Clean Time Logs** with detailed entries
- **Time Validation** ensuring punch-out after punch-in
- **Notes Support** for adding context to entries
- **Inline Editing** for quick modifications

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
- **Error Handling** with comprehensive, user-friendly alerts
- **Database Statistics** tracking total entries and hours worked
- **Pull to Refresh** on all data screens
- **Professional PDF Design** for reports

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator (optional)

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
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS Simulator / `a` for Android Emulator

## 📱 Screens

### Home Screen (UI Features)
- **Enhanced animations** with bounce and rotation effects
- **Multiple glow layers** for visual depth
- **Haptic feedback** on all interactions
- **Time editing** with validation
- **24-hour time picker** for precise selection
- **Real-time session timer** display
- **Dashboard cards** showing today's hours, weekly hours, and total sessions

### Dashboard Screen (UI Features)
- **Productivity Score** with dynamic calculation and color-coded feedback
- **Enhanced navigation** with 4-icon system (Home, Dashboard, History, Settings)
- **Real-time status indicators** with dynamic play/pause icons
- **Comprehensive analytics** with work days tracking
- **Quick actions** with functional navigation to other screens
- **Staggered animations** for different card sections
- **Success/Error haptic feedback** on refresh
- **Enhanced visual design** with improved shadows and spacing

### History Screen (UI Features)
- **Time validation** ensuring data integrity
- **Notes support** for entry context
- **Inline editing** modal for quick changes
- **Clean list design** with proper spacing
- **Date formatting** with full day/month/year display

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
- **@react-native-community/datetimepicker** - Native date/time selection
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

### Development Tips

- Use Expo DevTools for debugging
- Enable React Native Debugger for better debugging
- Use TypeScript strict mode for better code quality
- Test on both iOS and Android regularly
- Clear cache when experiencing unexpected behavior

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