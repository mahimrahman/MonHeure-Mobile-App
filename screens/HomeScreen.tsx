import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { usePunchStatus, useTodayData, usePunchActions } from '../utils/punchStore';
import { useTheme } from '../utils/themeContext';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

function formatTime(dateString?: string) {
  if (!dateString) return '--:--';
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(startTime?: string, endTime?: string) {
  if (!startTime || !endTime) return '0m';
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `${diffMinutes}m`;
}

export default function HomeScreen() {
  const { isPunchedIn, currentPunchInTime, isLoading } = usePunchStatus();
  const { todayEntries, totalHoursToday } = useTodayData();
  const { punchIn, punchOut, updateCurrentPunch } = usePunchActions();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState<'in' | 'out'>();
  const [editTime, setEditTime] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);

  // Animation values
  const buttonScale = useSharedValue(1);
  const buttonRotation = useSharedValue(0);

  // Get today's punch data from store
  const todayPunch = todayEntries.find(entry => 
    entry.punchIn && entry.date === new Date().toISOString().split('T')[0]
  );

  // Session timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPunchedIn && currentPunchInTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(currentPunchInTime).getTime();
        setSessionTimer(Math.floor((now - start) / 1000));
      }, 1000);
    } else {
      setSessionTimer(0);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn, currentPunchInTime]);

  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: buttonScale.value },
        { rotate: `${buttonRotation.value}deg` }
      ],
    };
  });

  // Enhanced punch in/out logic with haptics
  const handlePunch = async () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Enhanced button animation with bounce effect
    buttonScale.value = withSequence(
      withSpring(0.9, { damping: 8, stiffness: 200 }),
      withSpring(1.1, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 100 })
    );
    
    buttonRotation.value = withSequence(
      withTiming(-8, { duration: 150 }),
      withTiming(8, { duration: 150 }),
      withTiming(0, { duration: 300 })
    );

    try {
      if (!isPunchedIn) {
        await punchIn();
        Alert.alert('✅ Success', 'Punched in successfully!');
      } else {
        await punchOut();
        Alert.alert('✅ Success', 'Punched out successfully!');
      }
    } catch (error) {
      console.error('Error handling punch:', error);
      Alert.alert('❌ Error', 'Failed to save punch record');
    }
  };

  // Enhanced edit modal logic with haptics
  const openEditModal = (type: 'in' | 'out') => {
    Haptics.selectionAsync();
    setEditType(type);
    const currentTime = type === 'in' && todayPunch?.punchIn 
      ? new Date(todayPunch.punchIn) 
      : type === 'out' && todayPunch?.punchOut 
        ? new Date(todayPunch.punchOut) 
        : new Date();
    setEditTime(currentTime);
    setShowEditModal(true);
    setShowPicker(true);
  };

  const handleEditTime = async (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate && todayPunch) {
      try {
        const updates = editType === 'in' 
          ? { punchIn: selectedDate.toISOString() }
          : { punchOut: selectedDate.toISOString() };
        
        await updateCurrentPunch(updates);
        Alert.alert('✅ Success', `${editType === 'in' ? 'Punch In' : 'Punch Out'} time updated!`);
      } catch (error) {
        console.error('Error updating punch time:', error);
        Alert.alert('❌ Error', 'Failed to update punch time');
      }
    }
    setShowEditModal(false);
  };

  // Reset for demo/testing
  const resetToday = async () => {
    try {
      if (todayPunch) {
        await updateCurrentPunch({ 
          punchIn: undefined, 
          punchOut: undefined 
        });
        Alert.alert('✅ Success', 'Today\'s data reset successfully!');
      }
    } catch (error) {
      console.error('Error resetting today:', error);
      Alert.alert('❌ Error', 'Failed to reset today\'s data');
    }
  };

  // Get status text
  const getStatusText = () => {
    if (isPunchedIn && currentPunchInTime) {
      return "You are currently punched in.";
    } else {
      return "You are currently punched out.";
    }
  };

  // Format session timer
  const formatSessionTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 justify-center items-center">
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-md">
          <Text className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="pt-4 pb-6 px-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="time" size={24} color={isDarkMode ? '#8B5CF6' : '#6366F1'} />
            <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">MonHeure</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons 
              name={isDarkMode ? 'sunny' : 'moon'} 
              size={24} 
              color={isDarkMode ? '#F59E0B' : '#6B7280'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Icons */}
      <View className="flex-row justify-center mb-8">
        <TouchableOpacity 
          className="w-12 h-12 bg-purple-500 rounded-lg justify-center items-center mx-2"
          onPress={() => router.push('/')}
        >
          <Ionicons name="time" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg justify-center items-center mx-2"
          onPress={() => router.push('/history')}
        >
          <Ionicons name="list" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg justify-center items-center mx-2"
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center px-6 pb-8">
        {/* Main Punch Button */}
        <View className="items-center mb-8">
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              className={`w-32 h-32 rounded-full justify-center items-center shadow-lg ${
                isPunchedIn 
                  ? 'bg-red-500' 
                  : 'bg-purple-500'
              }`}
              onPress={handlePunch}
              activeOpacity={0.9}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel={isPunchedIn ? 'Punch Out' : 'Punch In'}
              accessibilityHint={isPunchedIn ? 'Tap to end your day' : 'Tap to start your day'}
            >
              <View className="items-center">
                <Ionicons 
                  name={isPunchedIn ? 'square' : 'play'} 
                  size={40} 
                  color="white" 
                  accessibilityIgnoresInvertColors
                />
                <Text className="text-white text-lg font-bold mt-2">
                  {isPunchedIn ? 'PUNCH OUT' : 'PUNCH IN'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Status Text */}
        <View className="mb-8">
          <Text className="text-gray-600 dark:text-gray-300 text-center text-lg">
            {getStatusText()}
          </Text>
        </View>

        {/* Current Session Timer */}
        {isPunchedIn && currentPunchInTime && (
          <View className="mb-8">
            <Text className="text-gray-600 dark:text-gray-300 text-center text-sm mb-2">
              Current session:
            </Text>
            <Text className="text-gray-900 dark:text-white text-center text-3xl font-bold">
              {formatSessionTimer(sessionTimer)}
            </Text>
          </View>
        )}

        {/* Dashboard Section */}
        <View className="w-full">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Your Dashboard
          </Text>
          
          <View className="space-y-4">
            {/* Today's Hours */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-blue-500 rounded-lg justify-center items-center mr-4">
                  <Ionicons name="time" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-white font-semibold text-lg">Today's Hours</Text>
                </View>
                <Text className="text-gray-900 dark:text-white font-bold text-xl">
                  {totalHoursToday > 0 ? `${totalHoursToday.toFixed(1)}h` : '0m'}
                </Text>
              </View>
            </View>

            {/* This Week's Hours */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-green-500 rounded-lg justify-center items-center mr-4">
                  <Ionicons name="calendar" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-white font-semibold text-lg">This Week's Hours</Text>
                </View>
                <Text className="text-gray-900 dark:text-white font-bold text-xl">
                  {totalHoursToday > 0 ? `${(totalHoursToday * 5).toFixed(1)}h` : '0m'}
                </Text>
              </View>
            </View>

            {/* Total Sessions */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-purple-500 rounded-lg justify-center items-center mr-4">
                  <Ionicons name="briefcase" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-white font-semibold text-lg">Total Sessions</Text>
                </View>
                <Text className="text-gray-900 dark:text-white font-bold text-xl">
                  {todayEntries.length}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reset Button for Testing */}
        <TouchableOpacity 
          onPress={resetToday} 
          className="mt-8 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700"
          activeOpacity={0.7}
        >
          <Text className="text-gray-600 dark:text-gray-300 text-sm font-medium">Reset Today (for testing)</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Time Modal */}
      <Modal 
        isVisible={showEditModal} 
        onBackdropPress={() => setShowEditModal(false)}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 items-center mx-4 shadow-2xl">
          <View className="w-16 h-16 bg-purple-500 rounded-full justify-center items-center mb-4">
            <Ionicons name="time" size={32} color="white" />
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Edit {editType === 'in' ? 'Punch In' : 'Punch Out'} Time
          </Text>
          {showPicker && (
            <DateTimePicker
              value={editTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleEditTime}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
} 