# MonHeure - Time Tracking App

A modern, elegant time tracking mobile application built with React Native and Expo. Track your work hours with a beautiful, intuitive interface that supports both light and dark themes.

![MonHeure App](https://img.shields.io/badge/React%20Native-0.79.4-blue?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-53.0.0-black?style=for-the-badge&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue?style=for-the-badge&logo=typescript)
![NativeWind](https://img.shields.io/badge/NativeWind-2.0.11-green?style=for-the-badge)

## ✨ Features

### 🎯 Core Time Tracking
- **One-Tap Punch In/Out** - Simple, intuitive time tracking
- **Real-Time Session Timer** - See your current session duration
- **Haptic Feedback** - Tactile response for better UX
- **Time Editing** - Edit punch times with validation
- **24-Hour Format** - Professional time picker interface

### 🎨 Modern UI/UX
- **Clean, Minimal Design** - Inspired by modern design principles
- **Full Dark/Light Mode** - Seamless theme switching
- **Smooth Animations** - React Native Reanimated powered
- **Responsive Layout** - Works on all device sizes
- **Accessibility Support** - Screen reader friendly

### 📊 Dashboard & Analytics
- **Today's Hours** - Real-time daily tracking
- **Weekly Summary** - This week's total hours
- **Session Count** - Total punch sessions
- **Pull to Refresh** - Easy data updates
- **Quick Actions** - Export, share, settings

### 📝 Time Logs & History
- **Comprehensive Logs** - View all your time entries
- **Date & Time Display** - Clear, readable format
- **Duration Calculation** - Automatic time calculations
- **Edit Functionality** - Modify existing entries
- **Notes Support** - Add context to your entries

### ⚙️ Settings & Preferences
- **Theme Toggle** - Light/Dark mode switching
- **Data Management** - Clear all data option
- **Export/Import** - Backup and restore data
- **Share App** - Spread the word
- **Feedback System** - User feedback integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MonHeure-Mobile-App.git
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
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator

## 🛠️ Tech Stack

### Core Framework
- **React Native 0.79.4** - Cross-platform mobile development
- **Expo SDK 53** - Development platform and tools
- **TypeScript 5.1.3** - Type safety and better development experience

### UI & Styling
- **NativeWind 2.0.11** - Tailwind CSS for React Native
- **React Native Reanimated 3.17.4** - Smooth animations
- **Expo Linear Gradient 14.1.5** - Beautiful gradient effects

### State Management & Data
- **Zustand 5.0.6** - Lightweight state management
- **Expo SQLite 15.2.12** - Local database storage
- **AsyncStorage 2.1.2** - Persistent settings storage

### Navigation & UI Components
- **Expo Router 5.1.1** - File-based navigation
- **React Native Safe Area Context 5.4.0** - Safe area handling
- **React Native Modal 14.0.0** - Modal dialogs
- **React Native Share 12.1.0** - Social sharing

### Charts & Data Visualization
- **React Native Chart Kit 6.12.0** - Beautiful charts
- **React Native SVG 15.11.2** - SVG support for charts

### Utilities & Enhancements
- **Expo Haptics 14.1.4** - Tactile feedback
- **Expo Notifications 0.31.3** - Push notifications
- **React Native HTML to PDF 0.12.0** - PDF export
- **React Native Calendars 1.1313.0** - Calendar integration

## 📱 App Structure

```
MonHeure-Mobile-App/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with navigation
│   ├── index.tsx          # Home screen
│   ├── dashboard.tsx      # Dashboard screen
│   ├── history.tsx        # History screen
│   └── settings.tsx       # Settings screen
├── screens/               # Screen components
│   ├── HomeScreen.tsx     # Main punch interface
│   ├── DashboardScreen.tsx # Analytics dashboard
│   ├── HistoryScreen.tsx  # Time logs view
│   └── SettingsScreen.tsx # App settings
├── utils/                 # Utility functions
│   ├── punchStore.ts      # Zustand store
│   ├── themeContext.tsx   # Theme management
│   ├── database.ts        # SQLite operations
│   └── timeCalculations.ts # Time calculations
├── components/            # Reusable components
├── types/                 # TypeScript type definitions
├── assets/               # Images and static files
└── global.css            # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary Purple**: `#8B5CF6` - Main brand color
- **Primary Indigo**: `#6366F1` - Secondary brand color
- **Success Green**: `#14B8A6` - Positive actions
- **Warning Amber**: `#F59E0B` - Caution states
- **Error Red**: `#EF4444` - Error states

### Typography
- **Headings**: Bold, large text for titles
- **Body**: Regular weight for content
- **Captions**: Smaller text for metadata

### Spacing
- **Consistent 4px grid** - All spacing follows 4px increments
- **Rounded corners** - Modern, friendly appearance
- **Subtle shadows** - Depth and hierarchy

## 🔧 Configuration

### Environment Setup
The app uses several configuration files:

- **babel.config.js** - Babel configuration with NativeWind and Reanimated
- **metro.config.js** - Metro bundler configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **tsconfig.json** - TypeScript configuration

### Theme Configuration
The app supports both light and dark themes with automatic switching:

```typescript
// Theme context usage
const { isDarkMode, toggleTheme } = useTheme();
```

## 📊 Database Schema

The app uses SQLite for local data storage:

```sql
CREATE TABLE punch_records (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  punchIn TEXT,
  punchOut TEXT,
  totalHours REAL,
  notes TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
```

## 🚀 Deployment

### Building for Production

1. **Configure app.json**
   ```json
   {
     "expo": {
       "name": "MonHeure",
       "slug": "monheure",
       "version": "1.0.0",
       "platforms": ["ios", "android"]
     }
   }
   ```

2. **Build for iOS**
   ```bash
   npx expo build:ios
   ```

3. **Build for Android**
   ```bash
   npx expo build:android
   ```

### App Store Deployment
- Configure app signing certificates
- Set up App Store Connect
- Submit for review

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

### Development Tips

- Use Expo DevTools for debugging
- Enable React Native Debugger for better debugging
- Use TypeScript strict mode for better code quality
- Test on both iOS and Android regularly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** - For the amazing development platform
- **React Native Community** - For the excellent libraries
- **Tailwind CSS** - For the utility-first CSS framework
- **Ionicons** - For the beautiful icon set

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information

---

**Made with ❤️ for productive time tracking** 