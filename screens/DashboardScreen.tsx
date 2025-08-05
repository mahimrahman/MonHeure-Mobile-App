import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, RefreshControl, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { getTimeStats, TimeStats } from '../utils/timeCalculations';
import { usePunchStatus, useTodayData, usePunchActions } from '../utils/punchStore';
import { useTheme } from '../utils/themeContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { isPunchedIn, currentPunchInTime, isLoading } = usePunchStatus();
  const { todayEntries, totalHoursToday } = useTodayData();
  const { refreshTodayData } = usePunchActions();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  
  const [timeStats, setTimeStats] = useState<{
    thisWeek: TimeStats;
    lastTwoWeeks: TimeStats;
    thisMonth: TimeStats;
    thisYear: TimeStats;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);
  const statsCardScale = useSharedValue(0.9);
  const actionCardOpacity = useSharedValue(0);

  const loadData = async () => {
    try {
      setLoading(true);
      const stats = await getTimeStats();
      setTimeStats(stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Start animations on mount
  useEffect(() => {
    // Header animation
    headerOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    
    // Card animation
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    cardTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
    
    // Stats card animation
    statsCardScale.value = withDelay(400, withSpring(1, { damping: 12, stiffness: 100 }));
    
    // Action card animation
    actionCardOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshTodayData();
      await loadData();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error refreshing data:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatHours = (hours: number) => {
    if (hours === 0) return '0h';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '--:--';
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getProductivityScore = () => {
    if (!timeStats) return 0;
    const weeklyHours = timeStats.thisWeek.totalHours;
    const targetHours = 40; // 8 hours per day, 5 days per week
    return Math.min(Math.round((weeklyHours / targetHours) * 100), 100);
  };

  const getProductivityColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const handleQuickAction = (action: string) => {
    Haptics.selectionAsync();
    switch (action) {
      case 'export':
        router.push('/report');
        break;
      case 'share':
        Alert.alert('Share Progress', 'Share your progress with colleagues!');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'history':
        router.push('/history');
        break;
    }
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ translateY: cardTranslateY.value }],
    };
  });

  const statsCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: statsCardScale.value }],
    };
  });

  const actionCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: actionCardOpacity.value,
    };
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center">
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <View className="items-center">
            <Ionicons name="time" size={48} color={isDarkMode ? '#8B5CF6' : '#6366F1'} />
            <Text className="text-gray-600 dark:text-gray-300 text-lg font-medium mt-4">Loading Dashboard...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const productivityScore = getProductivityScore();
  const productivityColor = getProductivityColor(productivityScore);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Animated.View style={headerAnimatedStyle} className="pt-4 pb-6 px-6">
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
        </Animated.View>

        {/* Navigation Icons */}
        <View className="flex-row justify-center mb-8">
          <TouchableOpacity 
            className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg justify-center items-center mx-2"
            onPress={() => router.push('/')}
          >
            <Ionicons name="time" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-12 h-12 bg-purple-500 rounded-lg justify-center items-center mx-2"
            onPress={() => router.push('/dashboard')}
          >
            <Ionicons name="analytics" size={24} color="white" />
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

        <View className="px-6 pb-8">
          {/* Dashboard Title */}
          <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Dashboard
          </Text>

          <Animated.View style={cardAnimatedStyle} className="space-y-6">
            {/* Current Status */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Current Status
              </Text>
              
              <View className="space-y-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className={`w-12 h-12 rounded-lg justify-center items-center mr-4 ${isPunchedIn ? 'bg-green-500' : 'bg-gray-400'}`}>
                      <Ionicons name={isPunchedIn ? 'play' : 'pause'} size={24} color="white" />
                    </View>
                    <View>
                      <Text className="text-gray-900 dark:text-white font-semibold text-lg">Status</Text>
                      <Text className="text-gray-600 dark:text-gray-300">
                        {isPunchedIn ? 'Currently Working' : 'Not Working'}
                      </Text>
                    </View>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${isPunchedIn ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <Text className={`font-semibold text-sm ${isPunchedIn ? 'text-green-600 dark:text-green-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      {isPunchedIn ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>

                {isPunchedIn && currentPunchInTime && (
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-blue-500 rounded-lg justify-center items-center mr-4">
                        <Ionicons name="time" size={24} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-900 dark:text-white font-semibold text-lg">Started At</Text>
                        <Text className="text-gray-600 dark:text-gray-300">
                          {formatTime(currentPunchInTime)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Productivity Score */}
            <Animated.View style={statsCardAnimatedStyle} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Productivity Score
              </Text>
              
              <View className="items-center">
                <View className="w-24 h-24 rounded-full justify-center items-center mb-4" style={{ backgroundColor: `${productivityColor}20` }}>
                  <Text className="text-2xl font-bold" style={{ color: productivityColor }}>
                    {productivityScore}%
                  </Text>
                </View>
                <Text className="text-gray-600 dark:text-gray-300 text-center">
                  {productivityScore >= 80 ? 'Excellent Progress!' : 
                   productivityScore >= 60 ? 'Good Progress' : 'Keep Going!'}
                </Text>
              </View>
            </Animated.View>

            {/* Today's Summary */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Today's Summary
              </Text>
              
              <View className="space-y-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-green-500 rounded-lg justify-center items-center mr-4">
                      <Ionicons name="time" size={24} color="white" />
                    </View>
                    <View>
                      <Text className="text-gray-900 dark:text-white font-semibold text-lg">Hours Today</Text>
                      <Text className="text-gray-600 dark:text-gray-300">
                        {formatHours(totalHoursToday)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-orange-500 rounded-lg justify-center items-center mr-4">
                      <Ionicons name="list" size={24} color="white" />
                    </View>
                    <View>
                      <Text className="text-gray-900 dark:text-white font-semibold text-lg">Sessions</Text>
                      <Text className="text-gray-600 dark:text-gray-300">
                        {todayEntries.length} sessions
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Weekly Summary */}
            {timeStats && (
              <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  This Week
                </Text>
                
                <View className="space-y-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-blue-500 rounded-lg justify-center items-center mr-4">
                        <Ionicons name="calendar" size={24} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-900 dark:text-white font-semibold text-lg">Total Hours</Text>
                        <Text className="text-gray-600 dark:text-gray-300">
                          {formatHours(timeStats.thisWeek.totalHours)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-purple-500 rounded-lg justify-center items-center mr-4">
                        <Ionicons name="trending-up" size={24} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-900 dark:text-white font-semibold text-lg">Average/Day</Text>
                        <Text className="text-gray-600 dark:text-gray-300">
                          {formatHours(timeStats.thisWeek.averageHoursPerDay)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-indigo-500 rounded-lg justify-center items-center mr-4">
                        <Ionicons name="stats-chart" size={24} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-900 dark:text-white font-semibold text-lg">Work Days</Text>
                        <Text className="text-gray-600 dark:text-gray-300">
                          {timeStats.thisWeek.totalDays} days
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Quick Actions */}
            <Animated.View style={actionCardAnimatedStyle} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </Text>
              
              <View className="space-y-3">
                <TouchableOpacity 
                  className="flex-row items-center justify-between py-3 active:bg-gray-50 dark:active:bg-gray-700 rounded-lg"
                  activeOpacity={0.7}
                  onPress={() => handleQuickAction('export')}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-blue-500 rounded-lg justify-center items-center mr-3">
                      <Ionicons name="download" size={20} color="white" />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-medium">Export Report</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row items-center justify-between py-3 active:bg-gray-50 dark:active:bg-gray-700 rounded-lg"
                  activeOpacity={0.7}
                  onPress={() => handleQuickAction('history')}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-green-500 rounded-lg justify-center items-center mr-3">
                      <Ionicons name="list" size={20} color="white" />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-medium">View History</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row items-center justify-between py-3 active:bg-gray-50 dark:active:bg-gray-700 rounded-lg"
                  activeOpacity={0.7}
                  onPress={() => handleQuickAction('share')}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-purple-500 rounded-lg justify-center items-center mr-3">
                      <Ionicons name="share" size={20} color="white" />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-medium">Share Progress</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row items-center justify-between py-3 active:bg-gray-50 dark:active:bg-gray-700 rounded-lg"
                  activeOpacity={0.7}
                  onPress={() => handleQuickAction('settings')}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-orange-500 rounded-lg justify-center items-center mr-3">
                      <Ionicons name="settings" size={20} color="white" />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-medium">View Settings</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 