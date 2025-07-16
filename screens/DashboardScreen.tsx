import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { getTimeStats, generateChartData, TimeStats, ChartData } from '../utils/timeCalculations';
import { usePunchStatus, useTodayData, usePunchActions } from '../utils/punchStore';

const { width } = Dimensions.get('window');

type ChartViewType = 'week' | 'month' | 'year';

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
  const [chartView, setChartView] = useState<ChartViewType>('week');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Animation values
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);
  const chartOpacity = useSharedValue(0);
  const chartTranslateY = useSharedValue(50);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stats, chart] = await Promise.all([
        getTimeStats(),
        generateChartData(chartView)
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
  }, [chartView]);

  // Start animations on mount
  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    
    setTimeout(() => {
      chartOpacity.value = withTiming(1, { duration: 800 });
      chartTranslateY.value = withSpring(0, { damping: 12, stiffness: 80 });
    }, 300);
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

  // Enhanced chart toggle with haptics
  const handleChartToggle = (view: ChartViewType) => {
    Haptics.selectionAsync();
    setChartView(view);
  };

  const StatCard = ({ 
    title, 
    hours, 
    days, 
    average, 
    gradient, 
    icon, 
    delay = 0 
  }: { 
    title: string; 
    hours: number; 
    days: number; 
    average: number;
    gradient: string[];
    icon: string;
    delay?: number;
  }) => {
    const cardAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: cardOpacity.value,
        transform: [{ translateY: cardTranslateY.value }],
      };
    });

    return (
      <Animated.View style={cardAnimatedStyle} className="mr-4 min-w-[160px]">
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-6 shadow-md"
          accessibilityRole="button"
          accessibilityLabel={`${title} statistics`}
          accessibilityHint={`Shows ${title} time tracking data`}
          {...(Platform.OS === 'android' ? { android_ripple: { color: '#FFFFFF', borderless: false, radius: 80 } } : {})}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="w-10 h-10 bg-white/20 rounded-full justify-center items-center">
              <Ionicons name={icon as any} size={20} color="white" accessibilityIgnoresInvertColors />
            </View>
            <View className="w-3 h-3 rounded-full bg-white/30" />
          </View>
          
          <Text className="text-white/90 text-sm font-medium mb-2">{title}</Text>
          <Text className="text-white text-2xl font-bold mb-1">{formatHours(hours)}</Text>
          <Text className="text-white/80 text-xs">{days} days • {formatHours(average)}/day</Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  const ChartToggle = () => {
    const toggleAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: chartOpacity.value,
        transform: [{ translateY: chartTranslateY.value }],
      };
    });

    return (
      <Animated.View style={toggleAnimatedStyle} className="flex-row bg-white rounded-2xl p-1 mb-6 shadow-md">
        {(['week', 'month', 'year'] as ChartViewType[]).map((view) => (
          <TouchableOpacity
            key={view}
            onPress={() => handleChartToggle(view)}
            className={`flex-1 py-3 px-4 rounded-xl ${
              chartView === view 
                ? 'bg-gradient-to-r from-primary-indigo to-primary-violet' 
                : 'bg-transparent'
            }`}
            accessibilityRole="button"
            accessibilityLabel={`${view} view`}
            accessibilityHint={`Switch to ${view} chart view`}
            style={{ minHeight: 44 }}
            {...(Platform.OS === 'android' ? { android_ripple: { color: '#6366F1', borderless: false, radius: 20 } } : {})}
          >
            <Text className={`text-center font-semibold ${
              chartView === view ? 'text-white' : 'text-text-secondary'
            }`}>
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  if (loading || isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-light justify-center items-center">
        <View className="bg-white rounded-2xl p-8 shadow-md">
          <Text className="text-text-secondary text-lg font-medium">Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="p-6">
          {/* Header */}
          <Animated.View style={useAnimatedStyle(() => ({
            opacity: cardOpacity.value,
            transform: [{ translateY: cardTranslateY.value }],
          }))} className="mb-8">
            <Text className="text-3xl font-bold text-text-primary mb-2">Dashboard</Text>
            <Text className="text-text-secondary text-lg">Your time tracking analytics</Text>
          </Animated.View>

          {/* Current Status Card */}
          <Animated.View 
            style={useAnimatedStyle(() => ({
              opacity: cardOpacity.value,
              transform: [{ translateY: cardTranslateY.value }],
            }))}
            className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100"
          >
            <View className="flex-row items-center mb-4">
              <View className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-indigo to-primary-violet mr-3" />
              <Text className="text-xl font-bold text-text-primary">Current Status</Text>
            </View>
            
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className={`w-4 h-4 rounded-full mr-3 ${isPunchedIn ? 'bg-primary-amber' : 'bg-primary-teal'}`} />
                <Text className="text-text-primary font-semibold text-lg">
                  {isPunchedIn ? 'Currently Working' : 'Not Working'}
                </Text>
              </View>
              {isPunchedIn && currentPunchInTime && (
                <View className="bg-indigo-100 px-4 py-2 rounded-2xl">
                  <Text className="text-primary-indigo font-medium">
                    Since {formatTime(currentPunchInTime)}
                  </Text>
                </View>
              )}
            </View>
            
            {totalHoursToday > 0 && (
              <View className="pt-4 border-t border-gray-200">
                <View className="flex-row justify-between items-center">
                  <Text className="text-text-secondary font-medium">Today's Hours:</Text>
                  <View className="bg-teal-100 px-4 py-2 rounded-2xl">
                    <Text className="text-primary-teal text-lg font-bold">
                      {totalHoursToday.toFixed(2)}h
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>

          {/* Time Stats Cards - Horizontal Scrollable */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-text-primary mb-4">Time Overview</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              {timeStats && (
                <>
                  <StatCard
                    title="This Week"
                    hours={timeStats.thisWeek.totalHours}
                    days={timeStats.thisWeek.daysWorked}
                    average={timeStats.thisWeek.averageHoursPerDay}
                    gradient={['#6366F1', '#4F46E5', '#4338CA']}
                    icon="calendar"
                    delay={0}
                  />
                  <StatCard
                    title="Last 2 Weeks"
                    hours={timeStats.lastTwoWeeks.totalHours}
                    days={timeStats.lastTwoWeeks.daysWorked}
                    average={timeStats.lastTwoWeeks.averageHoursPerDay}
                    gradient={['#14B8A6', '#0D9488', '#0F766E']}
                    icon="time"
                    delay={100}
                  />
                  <StatCard
                    title="This Month"
                    hours={timeStats.thisMonth.totalHours}
                    days={timeStats.thisMonth.daysWorked}
                    average={timeStats.thisMonth.averageHoursPerDay}
                    gradient={['#F59E0B', '#D97706', '#B45309']}
                    icon="trending-up"
                    delay={200}
                  />
                  <StatCard
                    title="This Year"
                    hours={timeStats.thisYear.totalHours}
                    days={timeStats.thisYear.daysWorked}
                    average={timeStats.thisYear.averageHoursPerDay}
                    gradient={['#8B5CF6', '#7C3AED', '#6D28D9']}
                    icon="stats-chart"
                    delay={300}
                  />
                </>
              )}
            </ScrollView>
          </View>

          {/* Chart Toggle */}
          <ChartToggle />

          {/* Enhanced Chart */}
          {chartData && (
            <Animated.View 
              style={useAnimatedStyle(() => ({
                opacity: chartOpacity.value,
                transform: [{ translateY: chartTranslateY.value }],
              }))}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100"
            >
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-text-primary">
                  {chartView === 'week' ? 'This Week' : 
                   chartView === 'month' ? 'This Month' : 'This Year'}'s Hours
                </Text>
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full bg-primary-indigo mr-2" />
                  <Text className="text-text-secondary text-sm">Hours worked</Text>
                </View>
              </View>
              
              <BarChart
                data={chartData}
                width={width - 80}
                height={250}
                yAxisLabel=""
                yAxisSuffix="h"
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  barPercentage: 0.8,
                  propsForLabels: {
                    fontSize: 12,
                    fontWeight: '600',
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: 'rgba(156, 163, 175, 0.2)',
                    strokeWidth: 1,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
                showBarTops={true}
                showValuesOnTopOfBars={true}
                fromZero={true}
              />
            </Animated.View>
          )}

          {/* Line Chart Alternative */}
          {chartData && (
            <Animated.View 
              style={useAnimatedStyle(() => ({
                opacity: chartOpacity.value,
                transform: [{ translateY: chartTranslateY.value }],
              }))}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100"
            >
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-text-primary">Trend Analysis</Text>
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full bg-primary-teal mr-2" />
                  <Text className="text-text-secondary text-sm">Daily trend</Text>
                </View>
              </View>
              
              <LineChart
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
                  color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  strokeWidth: 3,
                  propsForLabels: {
                    fontSize: 12,
                    fontWeight: '600',
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: 'rgba(156, 163, 175, 0.2)',
                    strokeWidth: 1,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#14B8A6',
                    fill: '#ffffff',
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
                bezier
                showDots={true}
                showValuesOnTopOfDots={true}
                fromZero={true}
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
                  <View className="flex-row items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-green-500 rounded-full justify-center items-center mr-3">
                        <Ionicons name="trending-up" size={20} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-semibold text-lg">Best Day This Week</Text>
                        <Text className="text-gray-500 text-sm">Average performance</Text>
                      </View>
                    </View>
                    <Text className="font-bold text-gray-800 text-lg">
                      {timeStats.thisWeek.averageHoursPerDay > 0 ? formatHours(timeStats.thisWeek.averageHoursPerDay) : 'No data'}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-blue-500 rounded-full justify-center items-center mr-3">
                        <Ionicons name="calendar" size={20} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-semibold text-lg">Days Worked This Month</Text>
                        <Text className="text-gray-500 text-sm">Consistency tracker</Text>
                      </View>
                    </View>
                    <Text className="font-bold text-gray-800 text-lg">{timeStats.thisMonth.daysWorked}</Text>
                  </View>
                  <View className="flex-row items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-orange-500 rounded-full justify-center items-center mr-3">
                        <Ionicons name="time" size={20} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-800 font-semibold text-lg">Total Hours This Year</Text>
                        <Text className="text-gray-500 text-sm">Annual achievement</Text>
                      </View>
                    </View>
                    <Text className="font-bold text-gray-800 text-lg">{formatHours(timeStats.thisYear.totalHours)}</Text>
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
              <TouchableOpacity className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl items-center border border-blue-100">
                <View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center mb-2">
                  <Ionicons name="refresh" size={24} color="white" />
                </View>
                <Text className="text-blue-600 font-medium">Refresh</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl items-center border border-green-100">
                <View className="w-12 h-12 bg-green-500 rounded-full justify-center items-center mb-2">
                  <Ionicons name="share" size={24} color="white" />
                </View>
                <Text className="text-green-600 font-medium">Export</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl items-center border border-orange-100">
                <View className="w-12 h-12 bg-orange-500 rounded-full justify-center items-center mb-2">
                  <Ionicons name="settings" size={24} color="white" />
                </View>
                <Text className="text-orange-600 font-medium">Settings</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 