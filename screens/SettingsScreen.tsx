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

  return (
    <ScrollView className={darkTheme ? 'flex-1 bg-gray-900' : 'flex-1 bg-gray-50'}>
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className={darkTheme ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-gray-800'}>Settings</Text>
          <Text className={darkTheme ? 'text-gray-300 mt-1' : 'text-gray-600 mt-1'}>Customize your experience</Text>
        </View>

        {/* Default Punch Times */}
        <View className={darkTheme ? 'bg-gray-800 rounded-lg shadow-sm mb-6 overflow-hidden' : 'bg-white rounded-lg shadow-sm mb-6 overflow-hidden'}>
          <View className="p-4 border-b border-gray-100">
            <Text className={darkTheme ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-800'}>Default Punch Times</Text>
          </View>
          <TouchableOpacity
            className="p-4 flex-row items-center justify-between border-b border-gray-100"
            onPress={() => setShowPunchInPicker(true)}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-in" size={20} color="#3b82f6" />
              <Text className={darkTheme ? 'ml-3 text-white' : 'ml-3 text-gray-800'}>Default Punch In</Text>
            </View>
            <Text className={darkTheme ? 'text-white' : 'text-gray-800'}>{defaultPunchIn}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4 flex-row items-center justify-between"
            onPress={() => setShowPunchOutPicker(true)}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out" size={20} color="#ef4444" />
              <Text className={darkTheme ? 'ml-3 text-white' : 'ml-3 text-gray-800'}>Default Punch Out</Text>
            </View>
            <Text className={darkTheme ? 'text-white' : 'text-gray-800'}>{defaultPunchOut}</Text>
          </TouchableOpacity>
        </View>
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

        {/* Dashboard View Preference */}
        <View className={darkTheme ? 'bg-gray-800 rounded-lg shadow-sm mb-6 overflow-hidden' : 'bg-white rounded-lg shadow-sm mb-6 overflow-hidden'}>
          <View className="p-4 border-b border-gray-100">
            <Text className={darkTheme ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-800'}>Default Dashboard View</Text>
          </View>
          {DASHBOARD_VIEWS.map((view) => (
            <TouchableOpacity
              key={view}
              className="p-4 flex-row items-center justify-between border-b border-gray-100 last:border-b-0"
              onPress={() => handleDashboardViewChange(view)}
            >
              <View className="flex-row items-center">
                <Ionicons name={view === 'Weekly' ? 'calendar' : view === 'Monthly' ? 'calendar-outline' : 'bar-chart'} size={20} color="#3b82f6" />
                <Text className={darkTheme ? 'ml-3 text-white' : 'ml-3 text-gray-800'}>{view}</Text>
              </View>
              {dashboardView === view && <Ionicons name="checkmark-circle" size={20} color="#10b981" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Toggle */}
        <View className={darkTheme ? 'bg-gray-800 rounded-lg shadow-sm mb-6 overflow-hidden' : 'bg-white rounded-lg shadow-sm mb-6 overflow-hidden'}>
          <View className="p-4 border-b border-gray-100">
            <Text className={darkTheme ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-800'}>Theme</Text>
          </View>
          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name={darkTheme ? 'moon' : 'sunny'} size={20} color={darkTheme ? '#f59e0b' : '#3b82f6'} />
              <Text className={darkTheme ? 'ml-3 text-white' : 'ml-3 text-gray-800'}>{darkTheme ? 'Dark' : 'Light'} Mode</Text>
            </View>
            <Switch value={darkTheme} onValueChange={handleThemeToggle} />
          </View>
        </View>

        {/* Notification Toggle */}
        <View className={darkTheme ? 'bg-gray-800 rounded-lg shadow-sm mb-6 overflow-hidden' : 'bg-white rounded-lg shadow-sm mb-6 overflow-hidden'}>
          <View className="p-4 border-b border-gray-100">
            <Text className={darkTheme ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-800'}>Reminders</Text>
          </View>
          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="notifications" size={20} color="#3b82f6" />
              <Text className={darkTheme ? 'ml-3 text-white' : 'ml-3 text-gray-800'}>Punch Out Reminder (6:00 PM)</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          </View>
        </View>

        {/* Clear All Data */}
        <View className={darkTheme ? 'bg-gray-800 rounded-lg shadow-sm mb-6 overflow-hidden' : 'bg-white rounded-lg shadow-sm mb-6 overflow-hidden'}>
          <View className="p-4 border-b border-gray-100">
            <Text className={darkTheme ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-800'}>Danger Zone</Text>
          </View>
          <TouchableOpacity
            className="p-4 flex-row items-center justify-between border-b border-gray-100"
            onPress={handleResetStore}
          >
            <View className="flex-row items-center">
              <Ionicons name="refresh-circle" size={20} color="#f59e0b" />
              <Text className={darkTheme ? 'ml-3 text-yellow-400' : 'ml-3 text-yellow-600'}>Reset Store State</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4 flex-row items-center justify-between"
            onPress={() => setShowClearModal(true)}
          >
            <View className="flex-row items-center">
              <Ionicons name="trash" size={20} color="#ef4444" />
              <Text className={darkTheme ? 'ml-3 text-red-400' : 'ml-3 text-red-600'}>Clear All Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Confirmation Modal */}
        <Modal
          visible={showClearModal}
          transparent
          animationType="fade"
        >
          <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
            <View className={darkTheme ? 'bg-gray-800 rounded-lg p-6 w-80' : 'bg-white rounded-lg p-6 w-80'}>
              <Text className={darkTheme ? 'text-lg font-bold text-white mb-4' : 'text-lg font-bold text-gray-800 mb-4'}>Clear All Data?</Text>
              <Text className={darkTheme ? 'text-gray-300 mb-6' : 'text-gray-600 mb-6'}>
                This will permanently delete all your stored data, including punch records and preferences. This action cannot be undone.
              </Text>
              <View className="flex-row justify-end space-x-4">
                <TouchableOpacity onPress={() => setShowClearModal(false)}>
                  <Text className={darkTheme ? 'text-gray-300 font-semibold' : 'text-gray-700 font-semibold'}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClearAllData}>
                  <Text className="text-red-600 font-semibold">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
} 