import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
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
  Easing
} from 'react-native-reanimated';
import { PunchRecord } from '../types/punch';
import { fetchEntriesForRange } from '../utils/database';
import DateRangePicker from '../components/DateRangePicker';
import { generatePDFReport } from '../utils/pdfGenerator';
import { shareReport, shareReportAsEmail } from '../utils/shareUtils';

const { width } = Dimensions.get('window');

interface ReportSummary {
  totalHours: number;
  totalDays: number;
  averageHoursPerDay: number;
  totalRecords: number;
  weekendDays: number;
  weekdays: number;
}

export default function ReportScreen() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 13); // 2 weeks ago
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [punchRecords, setPunchRecords] = useState<PunchRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PunchRecord[]>([]);
  const [summary, setSummary] = useState<ReportSummary>({
    totalHours: 0,
    totalDays: 0,
    averageHoursPerDay: 0,
    totalRecords: 0,
    weekendDays: 0,
    weekdays: 0,
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Animation values
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);
  const buttonScale = useSharedValue(1);
  const listItemOpacity = useSharedValue(0);
  const listItemTranslateY = useSharedValue(50);
  const summaryCardScale = useSharedValue(0.8);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);

  // Load punch data on component mount
  useEffect(() => {
    loadPunchData();
  }, []);

  // Start animations on mount
  useEffect(() => {
    // Header animation
    headerOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    
    // Card animation
    cardOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    
    // Summary card animation
    summaryCardScale.value = withSpring(1, { damping: 12, stiffness: 80 });
  }, []);

  // Filter records when date range or punch records change
  useEffect(() => {
    filterRecords();
  }, [startDate, endDate, punchRecords]);

  // Calculate summary when filtered records change
  useEffect(() => {
    calculateSummary();
    
    // Animate list items when data loads
    if (filteredRecords.length > 0) {
      listItemOpacity.value = withTiming(1, { duration: 400 });
      listItemTranslateY.value = withSpring(0, { damping: 12, stiffness: 80 });
    }
  }, [filteredRecords]);

  const loadPunchData = async () => {
    try {
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      const data = await fetchEntriesForRange(startDateStr, endDateStr);
      setPunchRecords(data);
    } catch (error) {
      console.error('Error loading punch data:', error);
      Alert.alert('Error', 'Failed to load punch data');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPunchData();
    setRefreshing(false);
  }, []);

  const filterRecords = () => {
    // Since we're now fetching directly from database for the range,
    // we can just use the punchRecords directly
    const filtered = [...punchRecords];
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredRecords(filtered);
  };

  const calculateSummary = () => {
    const totalHours = filteredRecords.reduce((sum, record) => sum + (record.totalHours || 0), 0);
    const uniqueDates = new Set(filteredRecords.map(record => record.date));
    const totalDays = uniqueDates.size;
    const averageHoursPerDay = totalDays > 0 ? totalHours / totalDays : 0;

    // Calculate weekend vs weekday distribution
    let weekendDays = 0;
    let weekdays = 0;
    
    uniqueDates.forEach(dateStr => {
      const date = new Date(dateStr);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
        weekendDays++;
      } else {
        weekdays++;
      }
    });

    setSummary({
      totalHours,
      totalDays,
      averageHoursPerDay,
      totalRecords: filteredRecords.length,
      weekendDays,
      weekdays,
    });
  };

  // Enhanced PDF generation with haptics
  const handleGeneratePDF = async () => {
    if (filteredRecords.length === 0) {
      Alert.alert('No Data', 'No punch records found for the selected date range');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Button animation
    buttonScale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1.05, { duration: 100 }),
      withSpring(1, { duration: 200 })
    );

    setIsGeneratingPDF(true);
    try {
      const reportData = {
        startDate,
        endDate,
        records: filteredRecords,
        totalHours: summary.totalHours,
        totalDays: summary.totalDays,
      };

      const filePath = await generatePDFReport(reportData);
      
      Alert.alert(
        'PDF Generated',
        'Report has been generated successfully!',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Share', 
            onPress: () => handleShareReport(filePath)
          },
        ]
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF report');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Enhanced share report with haptics
  const handleShareReport = async (filePath: string) => {
    Haptics.selectionAsync();
    const reportTitle = `Time Report ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    
    Alert.alert(
      'Share Report',
      'Choose how you would like to share the report',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: () => shareReport(filePath, reportTitle)
        },
        { 
          text: 'Email', 
          onPress: () => shareReportAsEmail(filePath, reportTitle)
        },
      ]
    );
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (hours?: number) => {
    if (!hours) return '--';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const isWeekend = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  };

  const isHoliday = (dateStr: string) => {
    // Simple holiday detection - you can expand this
    const date = new Date(dateStr);
    const month = date.getMonth();
    const day = date.getDate();
    
    // Common holidays (simplified)
    if (month === 0 && day === 1) return true; // New Year's Day
    if (month === 6 && day === 4) return true; // Independence Day
    if (month === 11 && day === 25) return true; // Christmas
    
    return false;
  };

  const getDayBackground = (dateStr: string) => {
    if (isHoliday(dateStr)) {
      return ['#fef3c7', '#fde68a']; // Yellow gradient for holidays
    }
    if (isWeekend(dateStr)) {
      return ['#fce7f3', '#fbcfe8']; // Pink gradient for weekends
    }
    return ['#f0f9ff', '#e0f2fe']; // Blue gradient for weekdays
  };

  const groupRecordsByDate = () => {
    const grouped: { [key: string]: PunchRecord[] } = {};
    
    filteredRecords.forEach(record => {
      if (!grouped[record.date]) {
        grouped[record.date] = [];
      }
      grouped[record.date].push(record);
    });

    return Object.entries(grouped).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  };

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ translateY: cardTranslateY.value }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const listItemAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: listItemOpacity.value,
      transform: [{ translateY: listItemTranslateY.value }],
    };
  });

  const summaryCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: summaryCardScale.value }],
    };
  });

  if (loading || isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-light justify-center items-center">
        <View className="bg-white rounded-2xl p-8 shadow-md">
          <Text className="text-text-secondary text-lg font-medium">Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Header */}
      <Animated.View style={headerAnimatedStyle} className="bg-white pt-12 pb-6 px-6 border-b border-gray-100 shadow-sm">
        <Text className="text-3xl font-bold text-text-primary mb-2">Reports</Text>
        <Text className="text-text-secondary text-lg">Generate and export your time tracking data</Text>
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
          {/* Enhanced Date Range Picker */}
          <Animated.View style={cardAnimatedStyle}>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </Animated.View>

          {/* Enhanced Summary Cards */}
          <Animated.View style={[cardAnimatedStyle, summaryCardAnimatedStyle]}>
            <View className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <View className="flex-row items-center mb-6">
                <View className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-indigo to-primary-violet mr-3" />
                <Text className="text-2xl font-bold text-text-primary">Summary</Text>
              </View>
              
              <View className="grid grid-cols-2 gap-4">
                <View className="bg-gradient-to-r from-indigo-50 to-violet-50 p-4 rounded-2xl border border-indigo-100">
                  <Text className="text-3xl font-bold text-primary-indigo">{summary.totalDays}</Text>
                  <Text className="text-sm text-primary-indigo font-medium">Days</Text>
                </View>
                <View className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-2xl border border-teal-100">
                  <Text className="text-3xl font-bold text-primary-teal">{summary.totalRecords}</Text>
                  <Text className="text-sm text-primary-teal font-medium">Records</Text>
                </View>
                <View className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-2xl border border-violet-100">
                  <Text className="text-2xl font-bold text-primary-violet">{formatDuration(summary.totalHours)}</Text>
                  <Text className="text-sm text-primary-violet font-medium">Total Hours</Text>
                </View>
                <View className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-100">
                  <Text className="text-2xl font-bold text-primary-amber">{formatDuration(summary.averageHoursPerDay)}</Text>
                  <Text className="text-sm text-primary-amber font-medium">Avg/Day</Text>
                </View>
              </View>

              {/* Day Distribution */}
              <View className="mt-6 pt-6 border-t border-gray-200">
                <Text className="text-lg font-semibold text-text-primary mb-4">Day Distribution</Text>
                <View className="flex-row space-x-4">
                  <View className="flex-1 bg-gradient-to-r from-indigo-50 to-violet-50 p-4 rounded-2xl border border-indigo-100">
                    <Text className="text-2xl font-bold text-primary-indigo">{summary.weekdays}</Text>
                    <Text className="text-sm text-primary-indigo font-medium">Weekdays</Text>
                  </View>
                  <View className="flex-1 bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-2xl border border-rose-100">
                    <Text className="text-2xl font-bold text-rose-600">{summary.weekendDays}</Text>
                    <Text className="text-sm text-rose-600 font-medium">Weekends</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Prominent Generate PDF Button */}
          <Animated.View style={[cardAnimatedStyle, buttonAnimatedStyle]}>
            <TouchableOpacity
              onPress={handleGeneratePDF}
              disabled={isGeneratingPDF || filteredRecords.length === 0}
              activeOpacity={0.9}
              className="overflow-hidden rounded-2xl shadow-md"
              accessibilityRole="button"
              accessibilityLabel={isGeneratingPDF ? 'Generating PDF' : 'Generate PDF Report'}
              accessibilityHint="Generate a PDF report of your time tracking data"
              style={{ minHeight: 44 }}
              {...(Platform.OS === 'android' ? { android_ripple: { color: '#FFFFFF', borderless: false, radius: 20 } } : {})}
            >
              <LinearGradient
                colors={isGeneratingPDF || filteredRecords.length === 0 
                  ? ['#9ca3af', '#6b7280'] 
                  : ['#6366F1', '#8B5CF6', '#14B8A6']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-6"
              >
                <View className="flex-row items-center justify-center">
                  {isGeneratingPDF ? (
                    <ActivityIndicator color="white" size="large" />
                  ) : (
                    <View className="w-12 h-12 bg-white/20 rounded-full justify-center items-center mr-4">
                      <Ionicons name="document-text" size={28} color="white" accessibilityIgnoresInvertColors />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-white font-bold text-xl text-center">
                      {isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF Report'}
                    </Text>
                    <Text className="text-white/80 text-sm text-center mt-1">
                      {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} • {formatDuration(summary.totalHours)}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Enhanced Punch Records List */}
          <Animated.View style={cardAnimatedStyle}>
            <View className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <View className="p-6 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-teal to-primary-indigo mr-3" />
                    <Text className="text-2xl font-bold text-text-primary">Daily Records</Text>
                  </View>
                  <View className="bg-indigo-100 px-3 py-1 rounded-full">
                    <Text className="text-primary-indigo font-medium text-sm">
                      {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
              </View>

              {filteredRecords.length === 0 ? (
                <View className="p-12 items-center">
                  <View className="w-20 h-20 bg-gray-100 rounded-full justify-center items-center mb-4">
                    <Ionicons name="document-outline" size={32} color="#9ca3af" accessibilityIgnoresInvertColors />
                  </View>
                  <Text className="text-gray-600 text-xl font-semibold mb-2 text-center">
                    No punch records found
                  </Text>
                  <Text className="text-gray-400 text-center">
                    Try adjusting the date range or add some punch records
                  </Text>
                </View>
              ) : (
                <ScrollView className="max-h-96">
                  {groupRecordsByDate().map(([date, records]) => (
                    <Animated.View key={date} style={listItemAnimatedStyle} className="overflow-hidden">
                      <LinearGradient
                        colors={getDayBackground(date)}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="px-6 py-4"
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <Text className="font-bold text-gray-800 text-lg">{formatDate(date)}</Text>
                            {(isWeekend(date) || isHoliday(date)) && (
                              <View className="ml-3 bg-white/60 px-2 py-1 rounded-full">
                                <Text className="text-xs font-medium text-gray-700">
                                  {isHoliday(date) ? 'Holiday' : 'Weekend'}
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text className="font-bold text-gray-800">
                            {formatDuration(records.reduce((sum, r) => sum + (r.totalHours || 0), 0))}
                          </Text>
                        </View>
                      </LinearGradient>
                      
                      {records.map((record, index) => (
                        <View key={record.id} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                          <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                              <View className="flex-row items-center space-x-4">
                                <View className="flex-row items-center">
                                  <Ionicons name="log-in" size={16} color="#3b82f6" accessibilityIgnoresInvertColors />
                                  <Text className="text-gray-700 font-mono ml-2">
                                    {formatTime(record.punchIn)}
                                  </Text>
                                </View>
                                <Ionicons name="arrow-forward" size={16} color="#9ca3af" accessibilityIgnoresInvertColors />
                                <View className="flex-row items-center">
                                  <Ionicons name="log-out" size={16} color="#ef4444" accessibilityIgnoresInvertColors />
                                  <Text className="text-gray-700 font-mono ml-2">
                                    {formatTime(record.punchOut)}
                                  </Text>
                                </View>
                              </View>
                              {record.notes && (
                                <Text className="text-sm text-gray-500 mt-2 italic">"{record.notes}"</Text>
                              )}
                            </View>
                            <View className="bg-teal-100 px-3 py-2 rounded-xl">
                              <Text className="font-bold text-primary-teal">
                                {formatDuration(record.totalHours)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </Animated.View>
                  ))}
                </ScrollView>
              )}
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={cardAnimatedStyle}>
            <View className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <View className="flex-row items-center mb-6">
                <View className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 mr-3" />
                <Text className="text-2xl font-bold text-gray-800">Quick Actions</Text>
              </View>
              
              <View className="space-y-4">
                <TouchableOpacity 
                  onPress={() => {
                    const today = new Date();
                    const twoWeeksAgo = new Date();
                    twoWeeksAgo.setDate(today.getDate() - 14);
                    setStartDate(twoWeeksAgo);
                    setEndDate(today);
                  }}
                  className="flex-row items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                  activeOpacity={0.8}
                >
                  <View className="w-10 h-10 bg-blue-500 rounded-full justify-center items-center mr-4">
                    <Ionicons name="calendar" size={20} color="white" />
                  </View>
                  <Text className="text-blue-700 font-semibold text-lg">Last 2 Weeks</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    const today = new Date();
                    const lastMonth = new Date();
                    lastMonth.setMonth(today.getMonth() - 1);
                    setStartDate(lastMonth);
                    setEndDate(today);
                  }}
                  className="flex-row items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100"
                  activeOpacity={0.8}
                >
                  <View className="w-10 h-10 bg-green-500 rounded-full justify-center items-center mr-4">
                    <Ionicons name="calendar-outline" size={20} color="white" />
                  </View>
                  <Text className="text-green-700 font-semibold text-lg">Last Month</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => {
                    const today = new Date();
                    setStartDate(today);
                    setEndDate(today);
                  }}
                  className="flex-row items-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100"
                  activeOpacity={0.8}
                >
                  <View className="w-10 h-10 bg-purple-500 rounded-full justify-center items-center mr-4">
                    <Ionicons name="today" size={20} color="white" />
                  </View>
                  <Text className="text-purple-700 font-semibold text-lg">Today Only</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 