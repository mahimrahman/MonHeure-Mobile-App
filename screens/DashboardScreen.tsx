import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
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

  const StatCard = ({ title, hours, days, average }: { title: string; hours: number; days: number; average: number }) => (
    <View className="bg-white p-4 rounded-lg shadow-sm flex-1 min-w-[150px]">
      <Text className="text-sm text-gray-600 mb-1">{title}</Text>
      <Text className="text-2xl font-bold text-blue-500 mb-1">{formatHours(hours)}</Text>
      <Text className="text-xs text-gray-500">{days} days • {formatHours(average)}/day avg</Text>
    </View>
  );

  if (loading || isLoading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-600">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>
          <Text className="text-gray-600 mt-1">Your time tracking analytics</Text>
        </View>

        {/* Current Status Card */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Current Status</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className={`w-3 h-3 rounded-full mr-3 ${isPunchedIn ? 'bg-red-500' : 'bg-green-500'}`} />
              <Text className="text-gray-800 font-medium">
                {isPunchedIn ? 'Currently Working' : 'Not Working'}
              </Text>
            </View>
            {isPunchedIn && currentPunchInTime && (
              <Text className="text-sm text-gray-600">
                Since {formatTime(currentPunchInTime)}
              </Text>
            )}
          </View>
          {totalHoursToday > 0 && (
            <View className="mt-2 pt-2 border-t border-gray-200">
              <Text className="text-sm text-gray-600">Today's Hours: <Text className="font-semibold text-green-600">{totalHoursToday.toFixed(2)}h</Text></Text>
            </View>
          )}
        </View>

        {/* Time Stats Cards */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Time Overview</Text>
          <View className="flex-row flex-wrap gap-3">
            {timeStats && (
              <>
                <StatCard
                  title="This Week"
                  hours={timeStats.thisWeek.totalHours}
                  days={timeStats.thisWeek.daysWorked}
                  average={timeStats.thisWeek.averageHoursPerDay}
                />
                <StatCard
                  title="Last 2 Weeks"
                  hours={timeStats.lastTwoWeeks.totalHours}
                  days={timeStats.lastTwoWeeks.daysWorked}
                  average={timeStats.lastTwoWeeks.averageHoursPerDay}
                />
                <StatCard
                  title="This Month"
                  hours={timeStats.thisMonth.totalHours}
                  days={timeStats.thisMonth.daysWorked}
                  average={timeStats.thisMonth.averageHoursPerDay}
                />
                <StatCard
                  title="This Year"
                  hours={timeStats.thisYear.totalHours}
                  days={timeStats.thisYear.daysWorked}
                  average={timeStats.thisYear.averageHoursPerDay}
                />
              </>
            )}
          </View>
        </View>

        {/* Weekly Chart */}
        {chartData && (
          <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">This Week's Hours</Text>
            <BarChart
              data={chartData}
              width={width - 48}
              height={220}
              yAxisLabel=""
              yAxisSuffix="h"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
          </View>
        )}

        {/* Productivity Insights */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Productivity Insights</Text>
          <View className="space-y-3">
            {timeStats && (
              <>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="trending-up" size={20} color="#10b981" />
                    <Text className="ml-2 text-gray-800">Best Day This Week</Text>
                  </View>
                  <Text className="font-semibold text-gray-800">
                    {timeStats.thisWeek.averageHoursPerDay > 0 ? formatHours(timeStats.thisWeek.averageHoursPerDay) : 'No data'}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar" size={20} color="#3b82f6" />
                    <Text className="ml-2 text-gray-800">Days Worked This Month</Text>
                  </View>
                  <Text className="font-semibold text-gray-800">{timeStats.thisMonth.daysWorked}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="time" size={20} color="#f59e0b" />
                    <Text className="ml-2 text-gray-800">Total Hours This Year</Text>
                  </View>
                  <Text className="font-semibold text-gray-800">{formatHours(timeStats.thisYear.totalHours)}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</Text>
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-blue-50 p-3 rounded-lg items-center">
              <Ionicons name="refresh" size={24} color="#3b82f6" />
              <Text className="text-blue-600 font-medium mt-1">Refresh</Text>
            </View>
            <View className="flex-1 bg-green-50 p-3 rounded-lg items-center">
              <Ionicons name="share" size={24} color="#10b981" />
              <Text className="text-green-600 font-medium mt-1">Export</Text>
            </View>
            <View className="flex-1 bg-orange-50 p-3 rounded-lg items-center">
              <Ionicons name="settings" size={24} color="#f59e0b" />
              <Text className="text-orange-600 font-medium mt-1">Settings</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 