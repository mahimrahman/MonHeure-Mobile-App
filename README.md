# MonHeure - Time Tracking Mobile App

A React Native mobile application built with Expo for efficient time tracking and punch-in/punch-out management.

## 🚀 Features

- **Punch In/Out System**: Simple one-tap time tracking
- **Daily Time Management**: Track work hours with visual indicators
- **Time Editing**: Edit punch-in and punch-out times if needed
- **Daily Reset**: Testing functionality to reset daily records
- **Persistent Storage**: Data saved locally using AsyncStorage
- **Modern UI**: Clean, intuitive interface with Tailwind CSS styling

## 🛠 Tech Stack

- **React Native** with **Expo SDK 50**
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS for React Native)
- **React Navigation** for navigation
- **Expo Vector Icons** for beautiful icons
- **AsyncStorage** for local data persistence
- **React Native Modal** for time editing

## 📱 Screenshots

The app features a clean, modern interface with:
- Large punch button that changes color based on work status
- Daily time display with editable punch times
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
│   ├── HistoryScreen.tsx   # Time history view
│   ├── ReportScreen.tsx    # Report generation
│   └── SettingsScreen.tsx  # App settings
├── types/
│   ├── nativewind.d.ts     # NativeWind type definitions
│   └── punch.ts           # Punch data types
├── utils/
│   └── timeCalculations.ts # Time calculation utilities
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

### Testing Features
- **Reset Function**: Clear today's data for testing
- **Multiple Punch Handling**: Proper error handling for edge cases

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
- **Documentation**: Check the code comments for implementation details
- **Expo Docs**: [expo.dev](https://expo.dev) for Expo-specific questions

## 🔮 Future Enhancements

- [ ] Multi-user support
- [ ] Cloud synchronization
- [ ] Advanced reporting
- [ ] Time analytics
- [ ] Export functionality
- [ ] Dark mode support
- [ ] Offline capabilities

---

**Built with ❤️ using React Native and Expo** 