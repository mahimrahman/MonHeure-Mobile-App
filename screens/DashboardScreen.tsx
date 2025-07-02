import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withDelay
} from 'react-native-reanimated';
import { getTimeStats, generateWeeklyChartData, TimeStats, ChartData } from '../utils/timeCalculations';
import { usePunchStatus, useTodayData, usePunchActions } from '../utils/punchStore';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { isPunchedIn, currentPunchInTime, isLoading } = usePunchStatus();
  const { todayEntries, totalHoursToday } = useTodayData();
  const { refreshTodayData } = usePunchActions();
  
  const [timeStats, setTimeStats] = useState<{
    thisWeek: TimeStats;
    lastTwoWeeks: TimeStats;
    thisMonth: TimeStats;
    thisYear: TimeStats;
  } | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Animation values
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stats, chart] = await Promise.all([
        getTimeStats(),
        generateWeeklyChartData()
      ]);
      setTimeStats(stats);
      setChartData(chart);
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
    cardOpacity.value = withTiming(1, { duration: 600 });
    cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadData(),
      refreshTodayData()
    ]);
    setRefreshing(false);
  };

  const formatHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '--:--';
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const StatCard = ({ title, hours, days, average, delay = 0 }: { 
    title: string; 
    hours: number; 
    days: number; 
    average: number;
    delay?: number;
  }) => {
    const cardAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: cardOpacity.value,
        transform: [{ translateY: cardTranslateY.value }],
      };
    });

    return (
      <Animated.View style={cardAnimatedStyle} className="flex-1 min-w-[150px]">
        <View className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <Text className="text-sm text-gray-600 mb-2 font-medium">{title}</Text>
          <Text className="text-2xl font-bold text-blue-600 mb-2">{formatHours(hours)}</Text>
          <Text className="text-xs text-gray-500">{days} days • {formatHours(average)}/day avg</Text>
        </View>
      </Animated.View>
    );
  };

  if (loading || isLoading) {
    return (
      <View className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-100 justify-center items-center">
        <View className="bg-white rounded-3xl p-8 shadow-2xl">
          <Text className="text-gray-600 text-lg font-medium">Loading dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Dashboard</Text>
          <Text className="text-gray-600 text-lg">Your time tracking analytics</Text>
        </View>

        {/* Current Status Card */}
        <Animated.View 
          style={useAnimatedStyle(() => ({
            opacity: cardOpacity.value,
            transform: [{ translateY: cardTranslateY.value }],
          }))}
          className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100"
        >
          <View className="flex-row items-center mb-4">
            <View className="w-3 h-3 rounded-full bg-blue-500 mr-3" />
            <Text className="text-xl font-bold text-gray-800">Current Status</Text>
          </View>
          
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className={`w-4 h-4 rounded-full mr-3 ${isPunchedIn ? 'bg-red-500' : 'bg-green-500'}`} />
              <Text className="text-gray-800 font-semibold text-lg">
                {isPunchedIn ? 'Currently Working' : 'Not Working'}
              </Text>
            </View>
            {isPunchedIn && currentPunchInTime && (
              <View className="bg-blue-100 px-4 py-2 rounded-2xl">
                <Text className="text-blue-700 font-medium">
                  Since {formatTime(currentPunchInTime)}
                </Text>
              </View>
            )}
          </View>
          
          {totalHoursToday > 0 && (
            <View className="pt-4 border-t border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-medium">Today's Hours:</Text>
                <View className="bg-green-100 px-4 py-2 rounded-2xl">
                  <Text className="text-green-700 text-lg font-bold">
                    {totalHoursToday.toFixed(2)}h
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Time Stats Cards */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Time Overview</Text>
          <View className="flex-row flex-wrap gap-4">
            {timeStats && (
              <>
                <StatCard
                  title="This Week"
                  hours={timeStats.thisWeek.totalHours}
                  days={timeStats.thisWeek.daysWorked}
                  average={timeStats.thisWeek.averageHoursPerDay}
                  delay={0}
                />
                <StatCard
                  title="Last 2 Weeks"
                  hours={timeStats.lastTwoWeeks.totalHours}
                  days={timeStats.lastTwoWeeks.daysWorked}
                  average={timeStats.lastTwoWeeks.averageHoursPerDay}
                  delay={100}
                />
                <StatCard
                  title="This Month"
                  hours={timeStats.thisMonth.totalHours}
                  days={timeStats.thisMonth.daysWorked}
                  average={timeStats.thisMonth.averageHoursPerDay}
                  delay={200}
                />
                <StatCard
                  title="This Year"
                  hours={timeStats.thisYear.totalHours}
                  days={timeStats.thisYear.daysWorked}
                  average={timeStats.thisYear.averageHoursPerDay}
                  delay={300}
                />
              </>
            )}
          </View>
        </View>

        {/* Weekly Chart */}
        {chartData && (
          <Animated.View 
            style={useAnimatedStyle(() => ({
              opacity: cardOpacity.value,
              transform: [{ translateY: cardTranslateY.value }],
            }))}
            className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100"
          >
            <Text className="text-xl font-bold text-gray-800 mb-4">This Week's Hours</Text>
            <BarChart
              data={chartData}
              width={width - 80}
              height={220}
              yAxisLabel=""
              yAxisSuffix="h"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                barPercentage: 0.7,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </Animated.View>
        )}

        {/* Productivity Insights */}
        <Animated.View 
          style={useAnimatedStyle(() => ({
            opacity: cardOpacity.value,
            transform: [{ translateY: cardTranslateY.value }],
          }))}
          className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100"
        >
          <Text className="text-xl font-bold text-gray-800 mb-4">Productivity Insights</Text>
          <View className="space-y-4">
            {timeStats && (
              <>
                <View className="flex-row items-center justify-between p-4 bg-green-50 rounded-2xl">
                  <View className="flex-row items-center">
                    <Ionicons name="trending-up" size={24} color="#22c55e" />
                    <Text className="ml-3 text-gray-800 font-medium">Best Day This Week</Text>
                  </View>
                  <Text className="font-bold text-gray-800">
                    {timeStats.thisWeek.averageHoursPerDay > 0 ? formatHours(timeStats.thisWeek.averageHoursPerDay) : 'No data'}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between p-4 bg-blue-50 rounded-2xl">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar" size={24} color="#3b82f6" />
                    <Text className="ml-3 text-gray-800 font-medium">Days Worked This Month</Text>
                  </View>
                  <Text className="font-bold text-gray-800">{timeStats.thisMonth.daysWorked}</Text>
                </View>
                <View className="flex-row items-center justify-between p-4 bg-orange-50 rounded-2xl">
                  <View className="flex-row items-center">
                    <Ionicons name="time" size={24} color="#f59e0b" />
                    <Text className="ml-3 text-gray-800 font-medium">Total Hours This Year</Text>
                  </View>
                  <Text className="font-bold text-gray-800">{formatHours(timeStats.thisYear.totalHours)}</Text>
                </View>
              </>
            )}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={useAnimatedStyle(() => ({
            opacity: cardOpacity.value,
            transform: [{ translateY: cardTranslateY.value }],
          }))}
          className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        >
          <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row space-x-4">
            <View className="flex-1 bg-blue-50 p-4 rounded-2xl items-center">
              <Ionicons name="refresh" size={28} color="#3b82f6" />
              <Text className="text-blue-600 font-medium mt-2">Refresh</Text>
            </View>
            <View className="flex-1 bg-green-50 p-4 rounded-2xl items-center">
              <Ionicons name="share" size={28} color="#22c55e" />
              <Text className="text-green-600 font-medium mt-2">Export</Text>
            </View>
            <View className="flex-1 bg-orange-50 p-4 rounded-2xl items-center">
              <Ionicons name="settings" size={28} color="#f59e0b" />
              <Text className="text-orange-600 font-medium mt-2">Settings</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
} 