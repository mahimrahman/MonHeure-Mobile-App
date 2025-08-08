import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { usePunchStatus, usePunchActions } from '../utils/punchStore';
import { useTheme } from '../utils/themeContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { isPunchedIn, currentPunchInTime, isLoading } = usePunchStatus();
  const { punchIn, punchOut, refreshTodayData } = usePunchActions();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [editingTime, setEditingTime] = useState<'start' | 'end' | null>(null);
  const [editStartTime, setEditStartTime] = useState<Date>(new Date());
  const [editEndTime, setEditEndTime] = useState<Date>(new Date());
  const [sessionTimer, setSessionTimer] = useState(0);

  // Optimized animation values
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);

  // Memoized values for better performance
  const buttonColor = useMemo(() => 
    isPunchedIn ? '#EF4444' : '#10B981', [isPunchedIn]
  );

  const buttonText = useMemo(() => 
    isPunchedIn ? 'Punch Out' : 'Punch In', [isPunchedIn]
  );

  const buttonIcon = useMemo(() => 
    isPunchedIn ? 'stop' : 'play', [isPunchedIn]
  );

  // Optimized session timer
  useEffect(() => {
    if (!isPunchedIn || !currentPunchInTime) {
      setSessionTimer(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const startTime = new Date(currentPunchInTime).getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      setSessionTimer(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPunchedIn, currentPunchInTime]);

  // Optimized animations
  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 400 });
    cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  const handlePunchPress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Optimized button animation
    buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 200 }, () => {
      buttonScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    });

    try {
      if (isPunchedIn) {
        await punchOut();
      } else {
        await punchIn();
      }
    } catch (error) {
      console.error('Punch error:', error);
      Alert.alert('Error', 'Failed to update punch status');
    }
  }, [isPunchedIn, punchIn, punchOut]);

  const handleEditTime = useCallback((type: 'start' | 'end') => {
    Haptics.selectionAsync();
    setEditingTime(type);
    setShowTimeModal(true);
  }, []);

  const handleTimeChange = useCallback((event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimeModal(false);
    }
    
    if (selectedDate) {
      if (editingTime === 'start') {
        setEditStartTime(selectedDate);
      } else {
        setEditEndTime(selectedDate);
      }
    }
  }, [editingTime]);

  const handleSaveTime = useCallback(async () => {
    try {
      // Implementation for saving edited time
      setShowTimeModal(false);
      setEditingTime(null);
      await refreshTodayData();
    } catch (error) {
      console.error('Error saving time:', error);
      Alert.alert('Error', 'Failed to save time');
    }
  }, [refreshTodayData]);

  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Optimized animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center">
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <View className="items-center">
            <Ionicons name="time" size={48} color={isDarkMode ? '#8B5CF6' : '#6366F1'} />
            <Text className="text-gray-600 dark:text-gray-300 text-lg font-medium mt-4">Loading...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
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
          onPress={() => router.push('/dashboard')}
        >
          <Ionicons name="analytics" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
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

      <View className="flex-1 px-6 pb-8">
        <Animated.View style={cardAnimatedStyle} className="flex-1 justify-center">
          {/* Main Punch Button */}
          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={handlePunchPress}
              activeOpacity={0.8}
              className="w-48 h-48 rounded-full justify-center items-center shadow-lg"
              style={{ backgroundColor: buttonColor }}
            >
              <Animated.View style={buttonAnimatedStyle} className="items-center">
                <Ionicons name={buttonIcon} size={48} color="white" />
                <Text className="text-white text-lg font-semibold mt-2">{buttonText}</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Session Timer */}
          {isPunchedIn && sessionTimer > 0 && (
            <View className="items-center mb-6">
              <Text className="text-gray-600 dark:text-gray-300 text-sm mb-2">Current Session</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(sessionTimer)}
              </Text>
            </View>
          )}

          {/* Dashboard Section */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Today's Overview
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-green-500 rounded-lg justify-center items-center mr-3">
                    <Ionicons name="time" size={20} color="white" />
                  </View>
                  <Text className="text-gray-900 dark:text-white font-medium">Today's Hours</Text>
                </View>
                <Text className="text-gray-600 dark:text-gray-300 font-semibold">8h 30m</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-500 rounded-lg justify-center items-center mr-3">
                    <Ionicons name="calendar" size={20} color="white" />
                  </View>
                  <Text className="text-gray-900 dark:text-white font-medium">This Week</Text>
                </View>
                <Text className="text-gray-600 dark:text-gray-300 font-semibold">42h 15m</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-purple-500 rounded-lg justify-center items-center mr-3">
                    <Ionicons name="list" size={20} color="white" />
                  </View>
                  <Text className="text-gray-900 dark:text-white font-medium">Total Sessions</Text>
                </View>
                <Text className="text-gray-600 dark:text-gray-300 font-semibold">12</Text>
              </View>
            </View>
          </View>

          {/* Reset Today Button */}
          <TouchableOpacity
            onPress={() => Alert.alert('Reset Today', 'Reset today\'s data?')}
            className="mt-6 bg-gray-200 dark:bg-gray-700 py-3 px-6 rounded-lg"
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 dark:text-gray-300 text-center font-medium">
              Reset Today
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Time Edit Modal */}
      <Modal
        visible={showTimeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white dark:bg-gray-800 rounded-xl p-6 m-4 w-80">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Edit {editingTime === 'start' ? 'Start' : 'End'} Time
            </Text>
            
            <DateTimePicker
              value={editingTime === 'start' ? editStartTime : editEndTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleTimeChange}
            />
            
            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={() => setShowTimeModal(false)}
                className="bg-gray-300 dark:bg-gray-600 py-2 px-4 rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 dark:text-gray-300 font-medium">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSaveTime}
                className="bg-blue-500 py-2 px-4 rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-white font-medium">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 