import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing
} from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { clearAllData } from '../utils/database';
import { usePunchStore } from '../utils/punchStore';

const DASHBOARD_VIEWS = ['Weekly', 'Monthly', 'Yearly'];

export default function SettingsScreen() {
  const resetState = usePunchStore(state => state.resetState);
  
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

  // Clear data modal
  const [showClearModal, setShowClearModal] = useState(false);

  // Animation values
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);

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
    cardOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
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

  // Clear all data
  const handleClearAllData = async () => {
    setShowClearModal(false);
    try {
      // Clear SQLite database
      await clearAllData();
      // Clear AsyncStorage settings
      await AsyncStorage.clear();
      // Reset Zustand store state
      resetState();
      Alert.alert('Data Cleared', 'All stored data has been removed.');
      // Optionally, reset state to defaults
      setDefaultPunchIn('09:00');
      setDefaultPunchOut('18:00');
      setDashboardView('Weekly');
      setDarkTheme(false);
      setNotificationsEnabled(false);
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear all data');
    }
  };

  // Reset Zustand store only
  const handleResetStore = () => {
    Alert.alert(
      'Reset Store State',
      'This will reset the current punch state and today\'s data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetState();
            Alert.alert('Success', 'Store state has been reset');
          }
        }
      ]
    );
  };

  // Helper to parse time string to Date
  const parseTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ translateY: cardTranslateY.value }],
    };
  });

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
    isSelected = false
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
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-4 border-b border-gray-100 last:border-b-0"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full justify-center items-center mr-4" style={{ backgroundColor: `${iconColor}20` }}>
          <Ionicons name={icon as any} size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-gray-800 font-semibold text-lg">{title}</Text>
          {subtitle && <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>}
        </View>
      </View>
      
      <View className="flex-row items-center">
        {value && (
          <Text className="text-gray-600 font-medium mr-3">{value}</Text>
        )}
        {showCheckmark && isSelected && (
          <View className="w-6 h-6 bg-green-500 rounded-full justify-center items-center mr-3">
            <Ionicons name="checkmark" size={14} color="white" />
          </View>
        )}
        {showSwitch ? (
          <Switch 
            value={switchValue} 
            onValueChange={onSwitchChange}
            trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
            thumbColor={switchValue ? '#ffffff' : '#f3f4f6'}
          />
        ) : showChevron ? (
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-6 border-b border-gray-100 shadow-sm">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Settings</Text>
        <Text className="text-gray-600 text-lg">Customize your experience</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 space-y-6">
          {/* Preferences Section */}
          <Animated.View style={cardAnimatedStyle}>
            <View className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <View className="p-6 border-b border-gray-100">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mr-3" />
                  <Text className="text-2xl font-bold text-gray-800">Preferences</Text>
                </View>
              </View>
              
              <SettingItem
                icon="time"
                title="Default Punch In"
                subtitle="Set your default start time"
                value={defaultPunchIn}
                onPress={() => setShowPunchInPicker(true)}
                iconColor="#3b82f6"
              />
              
              <SettingItem
                icon="time-outline"
                title="Default Punch Out"
                subtitle="Set your default end time"
                value={defaultPunchOut}
                onPress={() => setShowPunchOutPicker(true)}
                iconColor="#ef4444"
              />
            </View>
          </Animated.View>

          {/* Appearance Section */}
          <Animated.View style={cardAnimatedStyle}>
            <View className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <View className="p-6 border-b border-gray-100">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-3" />
                  <Text className="text-2xl font-bold text-gray-800">Appearance</Text>
                </View>
              </View>
              
              <SettingItem
                icon="color-palette"
                title="Theme"
                subtitle="Choose your preferred theme"
                value={darkTheme ? 'Dark' : 'Light'}
                onPress={handleThemeToggle}
                iconColor="#8b5cf6"
                showSwitch={true}
                switchValue={darkTheme}
                onSwitchChange={handleThemeToggle}
                showChevron={false}
              />
              
              <SettingItem
                icon="grid"
                title="Dashboard View"
                subtitle="Default chart view"
                value={dashboardView}
                onPress={() => {}}
                iconColor="#10b981"
                showChevron={false}
              />
              
              {DASHBOARD_VIEWS.map((view) => (
                <SettingItem
                  key={view}
                  icon={view === 'Weekly' ? 'calendar' : view === 'Monthly' ? 'calendar-outline' : 'bar-chart'}
                  title={view}
                  onPress={() => handleDashboardViewChange(view)}
                  iconColor="#6b7280"
                  showCheckmark={true}
                  isSelected={dashboardView === view}
                  showChevron={false}
                />
              ))}
            </View>
          </Animated.View>

          {/* Notifications Section */}
          <Animated.View style={cardAnimatedStyle}>
            <View className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <View className="p-6 border-b border-gray-100">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mr-3" />
                  <Text className="text-2xl font-bold text-gray-800">Notifications</Text>
                </View>
              </View>
              
              <SettingItem
                icon="notifications"
                title="Punch Out Reminder"
                subtitle="Daily reminder at 6:00 PM"
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                iconColor="#10b981"
                showSwitch={true}
                switchValue={notificationsEnabled}
                onSwitchChange={setNotificationsEnabled}
                showChevron={false}
              />
            </View>
          </Animated.View>

          {/* Data Management Section */}
          <Animated.View style={cardAnimatedStyle}>
            <View className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <View className="p-6 border-b border-gray-100">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 mr-3" />
                  <Text className="text-2xl font-bold text-gray-800">Data Management</Text>
                </View>
              </View>
              
              <SettingItem
                icon="refresh-circle"
                title="Reset Store State"
                subtitle="Reset current punch state"
                onPress={handleResetStore}
                iconColor="#f59e0b"
              />
            </View>
          </Animated.View>

          {/* Danger Zone */}
          <Animated.View style={cardAnimatedStyle}>
            <View className="bg-gradient-to-r from-red-50 to-rose-50 rounded-3xl shadow-xl overflow-hidden border border-red-200">
              <View className="p-6 border-b border-red-200">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-rose-500 mr-3" />
                  <Text className="text-2xl font-bold text-red-800">⚠️ Danger Zone</Text>
                </View>
                <Text className="text-red-600 text-sm mt-2">Irreversible actions</Text>
              </View>
              
              <TouchableOpacity
                onPress={() => setShowClearModal(true)}
                className="p-6 flex-row items-center justify-between"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 bg-red-100 rounded-full justify-center items-center mr-4">
                    <Ionicons name="trash" size={24} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-800 font-bold text-lg">Clear All Data</Text>
                    <Text className="text-red-600 text-sm mt-1">Permanently delete all stored data</Text>
                  </View>
                </View>
                <View className="bg-red-500 px-4 py-2 rounded-xl">
                  <Text className="text-white font-semibold">Delete</Text>
                </View>
              </TouchableOpacity>
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

      {/* Confirmation Modal */}
      <Modal
        visible={showClearModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-red-100 rounded-full justify-center items-center mb-4">
                <Ionicons name="warning" size={32} color="#ef4444" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-2">Clear All Data?</Text>
              <Text className="text-gray-600 text-center leading-6">
                This will permanently delete all your stored data, including punch records and preferences. This action cannot be undone.
              </Text>
            </View>
            
            <View className="space-y-3">
              <TouchableOpacity 
                onPress={handleClearAllData}
                className="bg-red-500 p-4 rounded-2xl"
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold text-lg text-center">Delete All Data</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setShowClearModal(false)}
                className="bg-gray-100 p-4 rounded-2xl"
                activeOpacity={0.8}
              >
                <Text className="text-gray-700 font-semibold text-lg text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 