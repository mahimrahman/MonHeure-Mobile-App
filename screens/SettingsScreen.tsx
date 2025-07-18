import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing,
  withDelay
} from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { clearAllData, exportData, importData } from '../utils/database';
import { usePunchStore, usePunchActions } from '../utils/punchStore';
import { shareApp } from '../utils/shareUtils';

const DASHBOARD_VIEWS = ['Weekly', 'Monthly', 'Yearly'];

export default function SettingsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoBackup: true,
    hapticFeedback: true,
  });

  // Default punch times
  const [defaultPunchIn, setDefaultPunchIn] = useState('09:00');
  const [defaultPunchOut, setDefaultPunchOut] = useState('18:00');
  const [showPunchInPicker, setShowPunchInPicker] = useState(false);
  const [showPunchOutPicker, setShowPunchOutPicker] = useState(false);

  // Dashboard view
  const [dashboardView, setDashboardView] = useState('Weekly');

  // Theme
  const [darkTheme, setDarkTheme] = useState(false);

  // Notification
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationId, setNotificationId] = useState<string | null>(null);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(30);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  const { refreshTodayData } = usePunchActions();

  // Load settings from AsyncStorage
  useEffect(() => {
    (async () => {
      const punchIn = await AsyncStorage.getItem('defaultPunchIn');
      const punchOut = await AsyncStorage.getItem('defaultPunchOut');
      const view = await AsyncStorage.getItem('dashboardView');
      const theme = await AsyncStorage.getItem('theme');
      const notif = await AsyncStorage.getItem('notificationsEnabled');
      setDefaultPunchIn(punchIn || '09:00');
      setDefaultPunchOut(punchOut || '18:00');
      setDashboardView(view || 'Weekly');
      setDarkTheme(theme === 'dark');
      setNotificationsEnabled(notif === 'true');
    })();
  }, []);

  // Start animations on mount
  useEffect(() => {
    // Animate header
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });

    // Animate cards with delay
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    cardTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  // Save settings to AsyncStorage
  const saveSetting = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  };

  // Time picker helpers
  const handleTimeChange = (type: 'in' | 'out', event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowPunchInPicker(false);
      setShowPunchOutPicker(false);
      return;
    }
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      if (type === 'in') {
        setDefaultPunchIn(time);
        saveSetting('defaultPunchIn', time);
        setShowPunchInPicker(false);
      } else {
        setDefaultPunchOut(time);
        saveSetting('defaultPunchOut', time);
        setShowPunchOutPicker(false);
      }
    }
  };

  // Dashboard view
  const handleDashboardViewChange = (view: string) => {
    setDashboardView(view);
    saveSetting('dashboardView', view);
  };

  // Theme toggle
  const handleThemeToggle = () => {
    setDarkTheme((prev) => {
      const newTheme = !prev;
      saveSetting('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  // Notification scheduling
  useEffect(() => {
    if (notificationsEnabled) {
      schedulePunchOutNotification();
    } else {
      cancelPunchOutNotification();
    }
    saveSetting('notificationsEnabled', notificationsEnabled ? 'true' : 'false');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsEnabled]);

  const schedulePunchOutNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Don\'t forget to punch out!',
        body: 'It\'s 6:00 PM. Remember to punch out if you haven\'t already.',
      },
      trigger: {
        hour: 18,
        minute: 0,
        repeats: true,
      },
    });
    setNotificationId(id as string);
  };

  const cancelPunchOutNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    setNotificationId(null);
  };

  // Enhanced settings toggle with haptics
  const handleToggle = (key: string, value: boolean) => {
    Haptics.selectionAsync();
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Enhanced clear data with haptics
  const handleClearData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your punch records. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await refreshTodayData();
              Alert.alert('✅ Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('❌ Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  // Enhanced export data with haptics
  const handleExportData = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const data = await exportData();
      Alert.alert('✅ Success', 'Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('❌ Error', 'Failed to export data');
    }
  };

  // Enhanced import data with haptics
  const handleImportData = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await importData();
      await refreshTodayData();
      Alert.alert('✅ Success', 'Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      Alert.alert('❌ Error', 'Failed to import data');
    }
  };

  // Enhanced share app with haptics
  const handleShareApp = () => {
    Haptics.selectionAsync();
    shareApp();
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshTodayData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshTodayData]);

  const settingGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive reminders and updates',
          icon: 'notifications',
          type: 'toggle',
          value: settings.notifications,
          onToggle: (value) => handleToggle('notifications', value),
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          icon: 'moon',
          type: 'toggle',
          value: settings.darkMode,
          onToggle: (value) => handleToggle('darkMode', value),
        },
        {
          id: 'autoBackup',
          title: 'Auto Backup',
          subtitle: 'Automatically backup your data',
          icon: 'cloud-upload',
          type: 'toggle',
          value: settings.autoBackup,
          onToggle: (value) => handleToggle('autoBackup', value),
        },
        {
          id: 'hapticFeedback',
          title: 'Haptic Feedback',
          subtitle: 'Vibrate on interactions',
          icon: 'phone-portrait',
          type: 'toggle',
          value: settings.hapticFeedback,
          onToggle: (value) => handleToggle('hapticFeedback', value),
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          id: 'export',
          title: 'Export Data',
          subtitle: 'Export your punch records',
          icon: 'download',
          type: 'button',
          onPress: handleExportData,
        },
        {
          id: 'import',
          title: 'Import Data',
          subtitle: 'Import punch records from file',
          icon: 'upload',
          type: 'button',
          onPress: handleImportData,
        },
        {
          id: 'clear',
          title: 'Clear All Data',
          subtitle: 'Permanently delete all records',
          icon: 'trash',
          type: 'button',
          onPress: handleClearData,
          danger: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'share',
          title: 'Share App',
          subtitle: 'Share MonHeure with friends',
          icon: 'share-social',
          type: 'button',
          onPress: handleShareApp,
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: 'chatbubble-ellipses',
          type: 'link',
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          icon: 'shield-checkmark',
          type: 'link',
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          subtitle: 'Read our terms of service',
          icon: 'document-text',
          type: 'link',
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'version',
          title: 'Version',
          subtitle: '1.0.0',
          icon: 'information-circle',
          type: 'link',
        },
        {
          id: 'licenses',
          title: 'Open Source Licenses',
          subtitle: 'View third-party licenses',
          icon: 'library',
          type: 'link',
        },
      ],
    },
  ];

  // Helper to parse time string to Date
  const parseTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onPress, 
    iconColor = '#3b82f6',
    showSwitch = false,
    switchValue = false,
    onSwitchChange = () => {},
    showChevron = true,
    showCheckmark = false,
    isSelected = false,
    gradientColors = null
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    iconColor?: string;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    showChevron?: boolean;
    showCheckmark?: boolean;
    isSelected?: boolean;
    gradientColors?: string[];
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-5 border-b border-gray-100 last:border-b-0"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 rounded-2xl justify-center items-center mr-4 overflow-hidden">
          {gradientColors ? (
            <LinearGradient
              colors={gradientColors}
              className="w-full h-full justify-center items-center"
            >
              <Ionicons name={icon as any} size={22} color="white" />
            </LinearGradient>
          ) : (
            <View className="w-full h-full justify-center items-center" style={{ backgroundColor: `${iconColor}15` }}>
              <Ionicons name={icon as any} size={22} color={iconColor} />
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-gray-800 font-bold text-lg">{title}</Text>
          {subtitle && <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>}
        </View>
      </View>
      
      <View className="flex-row items-center">
        {value && (
          <View className="bg-gray-100 px-3 py-1 rounded-full mr-3">
            <Text className="text-gray-700 font-semibold text-sm">{value}</Text>
          </View>
        )}
        {showCheckmark && isSelected && (
          <View className="w-7 h-7 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full justify-center items-center mr-3">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        )}
        {showSwitch ? (
          <Switch 
            value={switchValue} 
            onValueChange={onSwitchChange}
            trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
            thumbColor={switchValue ? '#ffffff' : '#f3f4f6'}
            ios_backgroundColor="#e5e7eb"
          />
        ) : showChevron ? (
          <View className="w-8 h-8 bg-gray-100 rounded-full justify-center items-center">
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ 
    title, 
    subtitle, 
    gradientColors, 
    icon 
  }: {
    title: string;
    subtitle?: string;
    gradientColors: string[];
    icon: string;
  }) => (
    <View className="p-6 border-b border-gray-100">
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 rounded-2xl mr-4 overflow-hidden">
          <LinearGradient
            colors={gradientColors}
            className="w-full h-full justify-center items-center"
          >
            <Ionicons name={icon as any} size={20} color="white" />
          </LinearGradient>
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-800">{title}</Text>
          {subtitle && <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Header */}
      <Animated.View style={headerAnimatedStyle} className="bg-white pt-12 pb-6 px-6 border-b border-gray-100 shadow-sm">
        <Text className="text-3xl font-bold text-text-primary mb-2">Settings</Text>
        <Text className="text-text-secondary text-lg">Customize your experience</Text>
      </Animated.View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="p-6 space-y-6">
          {settingGroups.map((group, groupIndex) => (
            <Animated.View key={group.title} style={cardAnimatedStyle}>
              <View className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <View className="px-6 py-4 border-b border-gray-100">
                  <Text className="text-lg font-bold text-text-primary">{group.title}</Text>
                </View>
                
                <View className="divide-y divide-gray-100">
                  {group.items.map((item, index) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={item.onPress}
                      disabled={item.type === 'toggle'}
                      activeOpacity={0.7}
                      className="px-6 py-4 flex-row items-center justify-between"
                      accessibilityRole={item.type === 'toggle' ? 'switch' : 'button'}
                      accessibilityLabel={item.title}
                      accessibilityHint={item.subtitle}
                      style={{ minHeight: 44 }}
                      {...(Platform.OS === 'android' && item.type !== 'toggle' ? { 
                        android_ripple: { 
                          color: item.danger ? '#FEE2E2' : '#F3F4F6', 
                          borderless: false, 
                          radius: 20 
                        } 
                      } : {})}
                    >
                      <View className="flex-row items-center flex-1">
                        <View className={`w-10 h-10 rounded-full justify-center items-center mr-4 ${
                          item.danger 
                            ? 'bg-red-100' 
                            : 'bg-gradient-to-r from-primary-indigo to-primary-violet'
                        }`}>
                          <Ionicons 
                            name={item.icon as any} 
                            size={20} 
                            color={item.danger ? '#EF4444' : 'white'} 
                            accessibilityIgnoresInvertColors
                          />
                        </View>
                        <View className="flex-1">
                          <Text className={`font-semibold text-lg ${
                            item.danger ? 'text-red-600' : 'text-text-primary'
                          }`}>
                            {item.title}
                          </Text>
                          <Text className="text-text-secondary text-sm mt-1">
                            {item.subtitle}
                          </Text>
                        </View>
                      </View>
                      
                      {item.type === 'toggle' ? (
                        <Switch
                          value={item.value}
                          onValueChange={item.onToggle}
                          trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
                          thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                          ios_backgroundColor="#E5E7EB"
                          accessibilityRole="switch"
                          accessibilityLabel={`${item.title} toggle`}
                        />
                      ) : (
                        <Ionicons 
                          name="chevron-forward" 
                          size={20} 
                          color="#9CA3AF" 
                          accessibilityIgnoresInvertColors
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Animated.View>
          ))}

          {/* App Info Card */}
          <Animated.View style={cardAnimatedStyle}>
            <View className="bg-gradient-to-r from-primary-indigo to-primary-violet rounded-2xl p-6 shadow-md">
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-white/20 rounded-full justify-center items-center mr-4">
                  <Ionicons name="time" size={28} color="white" accessibilityIgnoresInvertColors />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-xl font-bold">MonHeure</Text>
                  <Text className="text-white/80 text-sm">Time tracking made simple</Text>
                </View>
              </View>
              
              <Text className="text-white/90 text-sm leading-5">
                Track your work hours, generate reports, and stay productive with our intuitive time tracking app.
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Time Pickers */}
      {showPunchInPicker && (
        <DateTimePicker
          value={parseTime(defaultPunchIn)}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleTimeChange('in', event, date)}
        />
      )}
      {showPunchOutPicker && (
        <DateTimePicker
          value={parseTime(defaultPunchOut)}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleTimeChange('out', event, date)}
        />
      )}
    </SafeAreaView>
  );
} 