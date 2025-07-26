# MonHeure - Time Tracking Mobile App

A modern React Native mobile application built with Expo for efficient time tracking and punch-in/punch-out management with comprehensive reporting, analytics, and beautiful UI design.

## 🚀 Features

### 🎯 Core Time Tracking
- **Large Circular Punch Button**: Vibrant gradient button with smooth animations and haptic feedback
- **Real-time Status Display**: Shows current punch status with time information
- **One-tap Operation**: Simple, intuitive time tracking with visual feedback
- **Enhanced Glow Effects**: Multiple glow layers for premium visual effects
- **Session Persistence**: State survives app restarts and crashes
- **Haptic Feedback**: Tactile feedback on all major interactions using expo-haptics
- **Time Editing**: Edit punch-in and punch-out times with validation

### 🌙 Global Dark Mode Support
- **Full-App Dark Mode**: Dark mode applies to the entire app with consistent theming
- **Automatic & Manual Toggle**: Easily switch between light and dark themes from settings
- **Consistent Theming**: All screens, cards, and UI elements adapt to dark mode
- **Theme Context**: Global theme management with React Context

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
- **Pull to Refresh**: Swipe down to refresh dashboard data

### 📅 Modern Calendar & History
- **Interactive Calendar View**: Visual calendar with activity dots using `react-native-calendars`
- **Slide-up Day Cards**: Tap any date to see detailed punch information
- **Color-coded Status**: 
  - 🟢 Green dots: Completed days (punch-in + punch-out)
  - 🟡 Yellow dots: In-progress days (punch-in only)
- **Full CRUD Operations**: Create, read, update, and delete punch records
- **Swipe Gestures**: Swipe down to dismiss day cards
- **Pastel Backgrounds**: Beautiful gradient backgrounds for different statuses
- **Time Validation**: Ensures punch-out time is after punch-in time

### 📈 Comprehensive Reporting
- **Modern Reports Page**: Animated background, glassmorphism, and a summary header for a premium look
- **Custom Date Range Reports**: Select any date range with interactive date picker
- **Summary Dashboard**: Total days, records, hours, and average per day
- **Beautiful Record Cards**: Grouped by day, with gradients and clear status
- **Quick Actions**: One-tap for common ranges (last 2 weeks, last month, today) with vibrant icons and micro-interactions
- **PDF Export**: Generate professional PDF reports with `react-native-html-to-pdf`
- **Share & Email**: Share reports via email or other apps (feature temporarily disabled in SDK 53)

### ⚙️ Enhanced Settings & Preferences
- **Grouped Settings Sections**: Organized into logical categories with colorful indicators
  - **Preferences** (Blue gradient) - Default punch times
  - **Appearance** (Purple gradient) - Theme and dashboard view
  - **Notifications** (Green gradient) - Punch out reminders
  - **Data Management** (Orange gradient) - Store reset, data export/import
  - **Danger Zone** (Red gradient) - Data clearing
- **Colorful Icons**: Each setting has a colored icon with subtle background
- **Smart Toggles**: Custom-colored switches for theme and notifications
- **Visual Indicators**: Checkmarks for selected options, chevrons for navigation
- **Danger Zone**: Prominent red warning area for irreversible actions
- **Enhanced Modal**: Improved confirmation dialogs with warning icons
- **Data Export/Import**: Export and import all data as JSON
- **Share App**: Share the app with friends (feature temporarily disabled in SDK 53)

### 🎨 Modern UI Design
- **Modern Color Palette**: Soft, professional colors with Indigo (#6366F1), Teal (#14B8A6), Amber (#F59E0B), and Violet (#8B5CF6)
- **Gradient Backgrounds**: Beautiful color gradients throughout the app using the new palette
- **Rounded Corners**: Modern card design with consistent `rounded-xl` (12px) and `rounded-2xl` (16px) border radius
- **Soft Shadows**: Subtle `shadow-md` shadows for depth and visual hierarchy
- **Smooth Animations**: Spring-based animations with proper easing using react-native-reanimated
- **Touch-Friendly**: Large touch targets and generous spacing
- **Responsive Design**: Works seamlessly on all screen sizes and orientations
- **Consistent Typography**: `text-lg` classes for uniform text sizing
- **Safe Area Support**: Uses `SafeAreaView` and `SafeAreaProvider` for proper layout on all devices
- **Dark Mode Ready**: All UI elements and backgrounds adapt to dark mode for a seamless experience

### 🦾 Accessibility & Native Feel
- **Accessible Touch Targets**: All buttons and interactive elements have at least 44x44pt tap area
- **Contrast & Labels**: Proper color contrast and accessibility labels throughout
- **Haptic Feedback**: Uses `expo-haptics` for tactile feedback on all major interactions
- **Platform-Specific Tweaks**: Android ripple effects, iOS haptics, and native-feeling transitions
- **Screen Reader Support**: Accessibility roles and hints for all major controls

### 🔧 Advanced Features
- **Global State Management**: Zustand-powered state management with persistence
- **SQLite Database**: Robust local database storage with full CRUD operations
- **Sample Data Generation**: Load sample data for testing and demonstration
- **Data Export/Import**: Export and import all data as JSON
- **Data Integrity**: Proper validation and error handling
- **Pull to Refresh**: Swipe down to refresh data across all screens
- **Error Handling**: Comprehensive error handling with user-friendly alerts

## 🛠 Tech Stack

- **React Native** with **Expo SDK 53**
- **React 19** and **React Native 0.79.4**
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS for React Native) for styling
- **Expo Router** for file-based navigation
- **Zustand** for global state management with persistence
- **Expo Vector Icons** for beautiful icons
- **SQLite** for robust local database storage
- **AsyncStorage** for settings and preferences
- **react-native-calendars** for interactive calendar UI
- **react-native-chart-kit** for analytics and data visualization
- **react-native-html-to-pdf** for professional PDF export
- **react-native-share** for cross-platform sharing
- **@react-native-community/datetimepicker** for date/time selection
- **react-native-modal** for modal dialogs
- **expo-linear-gradient** for beautiful gradient effects
- **react-native-reanimated** for smooth animations
- **expo-haptics** for haptic feedback
- **react-native-safe-area-context** for safe area support

## 🎨 Design System

The app features a modern, cohesive design system with:

### 🎨 **Color Palette**
- **Primary Colors**: Indigo (#6366F1), Teal (#14B8A6), Amber (#F59E0B), Violet (#8B5CF6)
- **Background Colors**: Light (#F9FAFB), Dark (#1F2937), Card (#FFFFFF), **Card Dark (#374151)**
- **Text Colors**: Primary (#111827), Secondary (#6B7280), Inverse (#FFFFFF), **Dark Mode Texts (#F9FAFB, #D1D5DB, #9CA3AF)**
- **Complete Color Scales**: 50-900 scales for each primary color

### 🎨 **Design Tokens**
- **Border Radius**: `rounded-xl` (12px), `rounded-2xl` (16px)
- **Shadows**: `shadow-md` for consistent depth
- **Typography**: `text-lg` for uniform sizing
- **Spacing**: Generous padding and margins
- **Gradients**: Beautiful color transitions
- **Safe Area**: Uses `SafeAreaView` and `SafeAreaProvider` for all layouts
- **Accessibility**: All components have proper roles, labels, and contrast
- **Touch Feedback**: Haptic feedback and ripple effects for all buttons
- **Dark Mode Classes**: All components use Tailwind's `dark:` classes for seamless dark mode

### 🎨 **Component System**
- **Cards**: Consistent styling with rounded corners and shadows
- **Buttons**: Gradient backgrounds with proper touch targets and feedback
- **Charts**: Indigo and Teal color schemes
- **Modals**: Consistent border radius and shadows
- **Status Indicators**: Color-coded using the new palette

## 🦾 Accessibility & Native Experience

- **Safe Area Support**: All screens use `SafeAreaView` and are wrapped in `SafeAreaProvider`
- **Large Tap Targets**: All buttons and interactive elements are at least 44x44pt
- **Contrast & Color**: All text and icons meet accessibility contrast standards
- **Accessibility Labels**: All interactive elements have roles, labels, and hints
- **Haptic Feedback**: Uses `expo-haptics` for tactile feedback on all major actions
- **Platform-Specific Touch**: Android ripple effects, iOS haptics, and smooth transitions
- **Screen Reader Support**: Accessibility roles and hints for all major controls
- **Dark Mode**: All accessibility features are preserved in both light and dark themes

## 📱 Screenshots & UI Features

The app features a modern, intuitive interface with:

### 🏠 Home Screen
- **Large circular gradient button** (72x72) that toggles between "Punch In" and "Punch Out"
- **Enhanced animations**: Spring-based animations with bounce effects and rotation
- **Multiple glow layers**: Premium visual effects with multiple gradient layers
- **Modern gradients**: Indigo to Violet to Teal for punch-in, Amber gradient for punch-out
- **Status text**: Shows current punch status with time information using new text color system
- **Calendar-style card**: Today's punches in a clean, organized layout with consistent border radius
- **Smooth animations**: Spring-based animations with proper easing
- **Dark Mode**: All elements adapt to dark mode for a seamless experience
- **Haptic feedback**: Tactile feedback on all interactions
- **Time editing**: Edit punch-in and punch-out times with validation

### 📊 Dashboard Screen
- **Animated background gradient** for depth and premium feel
- **Summary header** with avatar and greeting
- **Horizontally scrollable stat cards** with glassmorphism and vibrant gradients
- **Interactive charts**: Bar and line charts with Indigo and Teal color schemes
- **Time period toggle**: Switch between week/month/year views with consistent styling
- **Productivity insights**: Enhanced metrics with visual indicators using new colors
- **Quick actions**: Touchable cards with gradient backgrounds, icons, and micro-interactions
- **Dark Mode**: Dashboard and all cards adapt to dark mode
- **Pull to refresh**: Swipe down to refresh dashboard data

### 📈 Reports Page (NEW UI)
- **Animated background gradient** for a modern, premium look
- **Summary header** with report icon and greeting
- **Glassmorphism and blur effects** on summary/stat cards and record cards
- **Beautiful record cards**: Grouped by day, with gradients and clear status
- **Quick actions**: One-tap for common ranges (last 2 weeks, last month, today) with vibrant icons and micro-interactions
- **PDF Export**: Generate professional PDF reports with a single tap
- **Dark Mode**: Reports page and all cards adapt to dark mode

### 📅 History Screen
- **Interactive calendar** with color-coded activity dots
- **Slide-up day cards**: Modal interface with swipe-to-dismiss
- **Pastel backgrounds**: Gradient backgrounds for different record statuses
- **Edit/Delete buttons**: Icon-based buttons with proper styling
- **Smooth transitions**: Spring animations for all interactions
- **Dark Mode**: Calendar, cards, and modals fully support dark mode
- **Time validation**: Ensures punch-out time is after punch-in time

### ⚙️ Settings Screen
- **Grouped sections**: Organized settings with colorful gradient indicators using new palette
- **Modern cards**: Rounded corners with consistent `shadow-md` and borders
- **Interactive elements**: Switches, toggles, and selection indicators with new colors
- **Danger zone**: Prominent warning area for data clearing with updated styling
- **Enhanced modals**: Improved confirmation dialogs with icons and consistent border radius
- **Dark Mode**: Settings and all controls adapt to dark mode

## 🔄 Recent Updates

### ✨ Enhanced Home Screen Animations (Latest)
- **Multiple glow layers**: Premium visual effects with multiple gradient layers
- **Enhanced button animations**: Spring-based animations with bounce effects and rotation
- **Improved haptic feedback**: Tactile feedback on all major interactions
- **Better visual hierarchy**: Enhanced status text and card layouts
- **Consistent dark mode support**: All elements adapt seamlessly to dark mode
- **Time editing functionality**: Edit punch-in and punch-out times with validation

### 🌙 Global Dark Mode
- **Full-App Dark Mode**: Dark mode now applies to the entire app, not just the settings page
- **Tailwind Dark Classes**: All screens and components use Tailwind's `dark:` classes
- **Consistent Theming**: All cards, backgrounds, and text colors adapt to dark mode
- **Theme Context**: Theme context and provider updated for global dark mode

### 🛠 Configuration Fixes
- **Plugin Configuration**: Fixed incorrect plugin configurations in `app.json`
- **Expo Haptics**: Removed from plugins array (not a config plugin)
- **Expo Linear Gradient**: Removed from plugins array (not a config plugin)
- **Metro Configuration**: Updated for better compatibility with SDK 53
- **Package Compatibility**: Ensured all packages are compatible with Expo SDK 53

### 🦾 Full Responsiveness & Accessibility
- **SafeAreaView & SafeAreaProvider**: All screens now use SafeAreaView for proper layout on all devices
- **Scrollable Containers**: All main content areas are scrollable and responsive
- **Large Tap Targets**: All buttons and interactive elements are at least 44x44pt
- **Haptic Feedback**: Uses expo-haptics for tactile feedback on all major actions
- **Platform-Specific Touch**: Android ripple effects, iOS haptics, and smooth transitions
- **Accessibility Improvements**: Proper color contrast, roles, labels, and hints throughout
- **Consistent Spacing**: Uniform padding and margin across all screens
- **New Utility Functions**: Added `exportData`, `importData`, and `shareApp` utilities

### 🎨 UI/UX Redesign
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

### 🎨 Modern Design System
- **New Color Palette**: Soft, professional colors with Indigo (#6366F1), Teal (#14B8A6), Amber (#F59E0B), and Violet (#8B5CF6)
- **Consistent Border Radius**: `rounded-xl` (12px) and `rounded-2xl` (16px) throughout the app
- **Unified Shadows**: `shadow-md` for consistent depth and visual hierarchy
- **Typography System**: `text-lg` classes for uniform text sizing
- **Background Colors**: Light (#F9FAFB) and dark (#1F2937) mode support
- **Text Color System**: Primary (#111827), Secondary (#6B7280), and Inverse (#FFFFFF) colors
- **Gradient Updates**: All gradients updated to use the new color palette
- **Chart Colors**: Charts now use Indigo and Teal color schemes
- **Component Consistency**: All cards, buttons, and modals use the new design system

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MonHeure-Mobile-App.git
   cd MonHeure-Mobile-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. **Add an Avatar Image:**
   - Place a PNG image named `avatar.png` in the `assets` directory at the project root.
   - This image will be used as the user avatar on the dashboard.
   - You can use any placeholder avatar (e.g., from [ui-avatars.com](https://ui-avatars.com/) or your own custom image).

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your device

### Development
- The app uses Expo SDK 53 with React 19
- All styling is done with NativeWind (Tailwind CSS for React Native)
- State management is handled with Zustand
- Database operations use SQLite via expo-sqlite

## 🐛 Known Issues

- **Sharing Features**: Temporarily disabled due to native module linking issues in SDK 53
- **Unmaintained Packages**: Some packages like `react-native-html-to-pdf` are unmaintained but functional
- **Package Updates**: Some packages may need updates for best compatibility with Expo SDK 53

## 📄 Documentation

For detailed information about specific features, see:
- [Database Features](DATABASE_FEATURES.md) - SQLite database implementation
- [History Features](HISTORY_FEATURES.md) - Calendar and CRUD operations
- [Report Features](REPORT_FEATURES.md) - PDF export and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
- Styled with [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- Icons from [Expo Vector Icons](https://icons.expo.fyi/)
- Charts powered by [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit)
- Calendar component from [react-native-calendars](https://github.com/wix/react-native-calendars)
- State management with [Zustand](https://github.com/pmndrs/zustand)
- Animations powered by [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)
- Haptic feedback with [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) 