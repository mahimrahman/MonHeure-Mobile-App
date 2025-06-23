# MonHeure - Time Tracking Mobile App

A React Native mobile application built with Expo for efficient time tracking and punch-in/punch-out management.

## 🚀 Features

- **Punch In/Out System**: Simple one-tap time tracking
- **Daily Time Management**: Track work hours with visual indicators
- **Time Editing**: Edit punch-in and punch-out times if needed
- **Calendar-Based History**: Visual calendar with punch activity, day selection, and edit/delete support
- **Custom Date Range Reports**: Select any two-week range, view all entries, and see total hours
- **PDF Export & Sharing**: Generate professional PDF reports and share via email or other apps
- **Persistent Storage**: Data saved locally using AsyncStorage
- **Modern UI**: Clean, intuitive interface with Tailwind CSS styling

## 🆕 Major Screens & Features

### History Screen
- **Calendar View**: Interactive calendar (using `react-native-calendars`) with dots for punch activity
- **Day Details**: Tap a day to see punch-in/out times, total hours, and notes
- **Edit/Delete**: Edit or delete entries with a modal
- **Sample Data**: Load sample data for quick testing
- **Pull to Refresh**: Swipe down to refresh

### Report Screen
- **Custom Date Range**: Select any two-week (or custom) range with a date picker
- **Summary Dashboard**: See total days, records, hours, and average per day
- **Scrollable Entries**: All punch-in/out entries grouped by day
- **PDF Export**: Generate a professional PDF report (`react-native-html-to-pdf`)
- **Share/Email**: Share the PDF via email or other apps (`react-native-share`)
- **Quick Actions**: One-tap for common ranges (last 2 weeks, last month, today)

## 🛠 Tech Stack

- **React Native** with **Expo SDK 50**
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS for React Native)
- **React Navigation** for navigation
- **Expo Vector Icons** for beautiful icons
- **AsyncStorage** for local data persistence
- **react-native-calendars** for calendar UI
- **react-native-html-to-pdf** for PDF export
- **react-native-share** for sharing/export
- **@react-native-community/datetimepicker** for date selection

## 📱 Screenshots

The app features a clean, modern interface with:
- Large punch button that changes color based on work status
- Daily time display with editable punch times
- Calendar-based history and reporting
- Modal-based time picker for corrections
- Responsive design that works on all screen sizes

## 🚦 Quick Start

### Prerequisites

- Node.js (v16 or higher)
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
   expo start
   ```

4. **Run on your device**
   - Install Expo Go on your mobile device
   - Scan the QR code displayed in the terminal
   - The app will load on your device

## 📁 Project Structure

```
MonHeure-Mobile-App/
├── screens/
│   ├── HomeScreen.tsx      # Main punch in/out interface
│   ├── DashboardScreen.tsx # Analytics dashboard
│   ├── HistoryScreen.tsx   # Calendar-based history view
│   ├── ReportScreen.tsx    # Custom date range reporting & export
│   └── SettingsScreen.tsx  # App settings
├── components/
│   ├── EditPunchModal.tsx  # Modal for editing punch records
│   └── DateRangePicker.tsx # Date range picker for reports
├── types/
│   ├── nativewind.d.ts     # NativeWind type definitions
│   └── punch.ts           # Punch data types
├── utils/
│   ├── timeCalculations.ts # Time calculation utilities
│   ├── storage.ts         # AsyncStorage helpers
│   ├── sampleData.ts      # Sample data generator
│   ├── pdfGenerator.ts    # PDF report generator
│   └── shareUtils.ts      # Sharing utilities
├── package.json           # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🎯 Core Functionality

### Punch In/Out System
- **Green Button**: Punch in (start work)
- **Red Button**: Punch out (end work)
- **Visual Feedback**: Button color and icon change based on status
- **One Tap**: Simple, quick time tracking

### Time Management
- **Daily Tracking**: Separate records for each day
- **Time Display**: Formatted punch-in and punch-out times
- **Editable Times**: Tap on times to edit using a time picker
- **Data Persistence**: All data saved locally

### Calendar-Based History
- **Calendar UI**: See punch activity at a glance
- **Day Details**: Tap a day for all entries
- **Edit/Delete**: Manage entries with a modal
- **Sample Data**: Load for quick testing

### Custom Date Range Reports
- **Date Picker**: Select any range (default: last 2 weeks)
- **Summary**: Total days, records, hours, avg/day
- **Scrollable List**: All entries grouped by day
- **PDF Export**: Generate a professional report
- **Share/Email**: Export via email or other apps

## 🎨 Styling

The app uses **NativeWind** (Tailwind CSS for React Native) for consistent styling:
- Responsive design
- Modern color scheme
- Clean typography
- Smooth animations and transitions

## 🔧 Development

### Adding New Features
1. Create new screen components in `screens/`
2. Add navigation routes in `App.tsx`
3. Style using Tailwind classes
4. Add types in `types/` directory

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- Async/await for data operations

## 📦 Building for Production

### Android APK
```bash
expo build:android
```

### iOS App Store
```bash
expo build:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Open an issue in the repository
- **Documentation**: See HISTORY_FEATURES.md and REPORT_FEATURES.md for details
- **Expo Docs**: [expo.dev](https://expo.dev) for Expo-specific questions

## 🔮 Future Enhancements

- [ ] Multi-user support
- [ ] Cloud synchronization
- [ ] Advanced reporting (CSV, Excel, analytics)
- [ ] Time analytics and charts
- [ ] Export functionality (CSV, PDF, Excel)
- [ ] Dark mode support
- [ ] Offline capabilities
- [ ] Report history and management

---

**Built with ❤️ using React Native and Expo** 