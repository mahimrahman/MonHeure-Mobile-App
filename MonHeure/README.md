# MonHeure - Time Management App

A cross-platform mobile application built with React Native (Expo) for efficient time tracking and productivity management.

## Features

- **Home Screen**: Quick overview of daily activities and time tracking
- **Dashboard**: Analytics and insights with productivity trends
- **Reports**: Generate and export detailed reports in various formats
- **History**: Timeline view of past activities and time records
- **Settings**: App configuration and user preferences

## Tech Stack

- **React Native** with **Expo** for cross-platform development
- **TypeScript** for type safety
- **Tailwind CSS** via **NativeWind** for styling
- **React Navigation** for bottom tab navigation
- **Expo Vector Icons** for beautiful icons

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MonHeure
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platform**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For web
   npm run web
   ```

## Project Structure

```
MonHeure/
├── App.tsx                 # Main app component with navigation
├── screens/                # Screen components
│   ├── HomeScreen.tsx      # Home screen with overview
│   ├── DashboardScreen.tsx # Analytics and insights
│   ├── ReportScreen.tsx    # Report generation
│   ├── HistoryScreen.tsx   # Activity history
│   └── SettingsScreen.tsx  # App settings
├── assets/                 # App icons and images
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── babel.config.js       # Babel configuration
```

## Navigation

The app uses React Navigation with a bottom tab navigator featuring 5 main tabs:

1. **Home** - Daily overview and quick actions
2. **Dashboard** - Analytics and productivity insights
3. **Report** - Generate and export reports
4. **History** - Timeline of past activities
5. **Settings** - App configuration and preferences

## Styling

The app uses Tailwind CSS through NativeWind for consistent and responsive styling. All components are styled using Tailwind classes for a modern, clean interface.

## Development

### Adding New Screens

1. Create a new screen component in the `screens/` directory
2. Import and add it to the navigation in `App.tsx`
3. Style using Tailwind CSS classes

### Customizing Styles

- Modify `tailwind.config.js` for theme customization
- Use Tailwind classes in components for styling
- Add custom styles in component files when needed

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.