import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import Modal from 'react-native-modal';
import { PunchRecord } from '../types/punch';
import { 
  fetchAllEntries, 
  fetchEntriesForDay, 
  updatePunchEntry, 
  deletePunchEntry 
} from '../utils/database';
import EditPunchModal from '../components/EditPunchModal';
import { generateSampleData } from '../utils/sampleData';
import { usePunchActions } from '../utils/punchStore';

const { width, height } = Dimensions.get('window');

interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor: string;
    selected?: boolean;
    selectedColor?: string;
  };
}

export default function HistoryScreen() {
  const { refreshTodayData } = usePunchActions();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [punchRecords, setPunchRecords] = useState<PunchRecord[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDateRecords, setSelectedDateRecords] = useState<PunchRecord[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PunchRecord | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [isDayCardVisible, setIsDayCardVisible] = useState(false);

  // Animation values
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);
  const dayCardOpacity = useSharedValue(0);
  const dayCardTranslateY = useSharedValue(100);
  const calendarScale = useSharedValue(1);
  const recordItemScale = useSharedValue(1);
  const recordItemOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);

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
  }, []);

  // Update selected date records when selectedDate or punchRecords change
  useEffect(() => {
    const records = punchRecords.filter(record => record.date === selectedDate);
    setSelectedDateRecords(records);
  }, [selectedDate, punchRecords]);

  // Update marked dates when punchRecords change
  useEffect(() => {
    const marked: MarkedDates = {};
    punchRecords.forEach(record => {
      if (record.punchIn || record.punchOut) {
        marked[record.date] = {
          marked: true,
          dotColor: record.punchOut ? '#22c55e' : '#f59e0b',
        };
      }
    });
    setMarkedDates(marked);
  }, [punchRecords]);

  const loadPunchData = async () => {
    try {
      const data = await fetchAllEntries();
      setPunchRecords(data);
    } catch (error) {
      console.error('Error loading punch data:', error);
      Alert.alert('Error', 'Failed to load punch data');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      loadPunchData(),
      refreshTodayData()
    ]);
    setRefreshing(false);
  }, [refreshTodayData]);

  // Enhanced date selection with haptics
  const handleDateSelect = (day: DateData) => {
    Haptics.selectionAsync();
    setSelectedDate(day.dateString);
    showDayCard();
  };

  const showDayCard = () => {
    setIsDayCardVisible(true);
    dayCardOpacity.value = withTiming(1, { duration: 300 });
    dayCardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    calendarScale.value = withSequence(
      withSpring(0.98, { duration: 200 }),
      withSpring(1, { duration: 200 })
    );
    
    // Animate record items when they appear
    setTimeout(() => {
      recordItemOpacity.value = withTiming(1, { duration: 400 });
      recordItemScale.value = withSpring(1, { damping: 12, stiffness: 80 });
    }, 300);
  };

  const hideDayCard = () => {
    // Reset record item animations
    recordItemOpacity.value = withTiming(0, { duration: 200 });
    recordItemScale.value = withSpring(0.8, { damping: 15, stiffness: 100 });
    
    dayCardOpacity.value = withTiming(0, { duration: 200 });
    dayCardTranslateY.value = withSpring(100, { damping: 15, stiffness: 100 });
    setTimeout(() => {
      setIsDayCardVisible(false);
    }, 200);
  };

  // Enhanced edit record with haptics
  const handleEditRecord = (record: PunchRecord) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingRecord(record);
    setIsEditModalVisible(true);
  };

  const handleSaveRecord = async (updatedRecord: PunchRecord) => {
    try {
      await updatePunchEntry(parseInt(updatedRecord.id), updatedRecord);
      await Promise.all([
        loadPunchData(),
        refreshTodayData()
      ]);
      Alert.alert('✅ Success', 'Punch record updated successfully');
    } catch (error) {
      console.error('Error updating record:', error);
      Alert.alert('❌ Error', 'Failed to update punch record');
    }
  };

  // Enhanced delete record with haptics
  const handleDeleteRecord = async (recordId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this punch record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePunchEntry(parseInt(recordId));
              await Promise.all([
                loadPunchData(),
                refreshTodayData()
              ]);
              Alert.alert('✅ Success', 'Punch record deleted successfully');
            } catch (error) {
              console.error('Error deleting record:', error);
              Alert.alert('❌ Error', 'Failed to delete punch record');
            }
          }
        }
      ]
    );
  };

  // Enhanced load sample data with haptics
  const handleLoadSampleData = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await generateSampleData();
      await Promise.all([
        loadPunchData(),
        refreshTodayData()
      ]);
      Alert.alert('✅ Success', 'Sample data loaded successfully');
    } catch (error) {
      console.error('Error loading sample data:', error);
      Alert.alert('❌ Error', 'Failed to load sample data');
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (record: PunchRecord) => {
    if (record.punchIn && record.punchOut) return '#22c55e'; // Completed
    if (record.punchIn && !record.punchOut) return '#f59e0b'; // In progress
    return '#6b7280'; // No data
  };

  const getStatusText = (record: PunchRecord) => {
    if (record.punchIn && record.punchOut) return 'Completed';
    if (record.punchIn && !record.punchOut) return 'In Progress';
    return 'No Data';
  };

  const getStatusGradient = (record: PunchRecord) => {
    if (record.punchIn && record.punchOut) return ['#dcfce7', '#bbf7d0']; // Green
    if (record.punchIn && !record.punchOut) return ['#fef3c7', '#fde68a']; // Yellow
    return ['#f3f4f6', '#e5e7eb']; // Gray
  };

  // Animated styles
  const calendarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: calendarScale.value }],
    };
  });

  const dayCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: dayCardOpacity.value,
      transform: [{ translateY: dayCardTranslateY.value }],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const recordItemAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: recordItemOpacity.value,
      transform: [{ scale: recordItemScale.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Header */}
      <Animated.View style={headerAnimatedStyle} className="bg-white pt-12 pb-6 px-6 border-b border-gray-100 shadow-sm">
        <Text className="text-3xl font-bold text-text-primary mb-2">History</Text>
        <Text className="text-text-secondary text-lg">View and manage your punch records</Text>
      </Animated.View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Calendar */}
        <Animated.View 
          style={[useAnimatedStyle(() => ({
            opacity: cardOpacity.value,
            transform: [{ translateY: cardTranslateY.value }],
          })), calendarAnimatedStyle]}
          className="bg-white m-6 rounded-2xl shadow-md overflow-hidden border border-gray-100"
        >
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                ...markedDates[selectedDate],
                selected: true,
                selectedColor: '#6366F1',
              },
            }}
            theme={{
              selectedDayBackgroundColor: '#6366F1',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#6366F1',
              dayTextColor: '#374151',
              textDisabledColor: '#d1d5db',
              dotColor: '#14B8A6',
              selectedDotColor: '#ffffff',
              arrowColor: '#6366F1',
              monthTextColor: '#374151',
              indicatorColor: '#6366F1',
              textDayFontWeight: '600',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '700',
              textDayFontSize: 16,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 14,
              'stylesheet.calendar.header': {
                dayHeader: {
                  color: '#6b7280',
                  fontWeight: '600',
                },
              },
            }}
          />
        </Animated.View>

        {/* Sample Data Button */}
        <Animated.View 
          style={useAnimatedStyle(() => ({
            opacity: cardOpacity.value,
            transform: [{ translateY: cardTranslateY.value }],
          }))}
          className="mx-6 mb-6"
        >
          <TouchableOpacity
            onPress={handleLoadSampleData}
            className="bg-gradient-to-r from-primary-violet to-primary-indigo rounded-2xl p-4 shadow-md"
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Load sample data"
            accessibilityHint="Load sample punch records for testing"
            style={{ minHeight: 44 }}
            {...(Platform.OS === 'android' ? { android_ripple: { color: '#FFFFFF', borderless: false, radius: 20 } } : {})}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="add-circle" size={24} color="white" accessibilityIgnoresInvertColors />
              <Text className="text-white font-semibold text-lg ml-2">Load Sample Data</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Day Card Modal */}
      <Modal
        isVisible={isDayCardVisible}
        onBackdropPress={hideDayCard}
        onSwipeComplete={hideDayCard}
        swipeDirection={['down']}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <Animated.View style={dayCardAnimatedStyle}>
          <View className="bg-white rounded-t-2xl shadow-md border border-gray-100 max-h-[80%]">
            {/* Handle */}
            <View className="items-center pt-4 pb-2">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Header */}
            <View className="px-6 pb-4 border-b border-gray-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-indigo to-primary-violet mr-3" />
                  <Text className="text-2xl font-bold text-text-primary">
                    {formatDate(selectedDate)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={hideDayCard}
                  className="w-8 h-8 bg-gray-100 rounded-full justify-center items-center"
                  accessibilityRole="button"
                  accessibilityLabel="Close day card"
                  style={{ minWidth: 44, minHeight: 44 }}
                  {...(Platform.OS === 'android' ? { android_ripple: { color: '#6366F1', borderless: false, radius: 22 } } : {})}
                >
                  <Ionicons name="close" size={20} color="#6b7280" accessibilityIgnoresInvertColors />
                </TouchableOpacity>
              </View>
            </View>

            {/* Content */}
            <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
              {selectedDateRecords.length > 0 ? (
                <View className="space-y-4">
                  {selectedDateRecords.map((record, index) => (
                    <Animated.View key={record.id} style={recordItemAnimatedStyle} className="overflow-hidden rounded-2xl">
                      <LinearGradient
                        colors={getStatusGradient(record)}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="p-5 border border-gray-200"
                      >
                        <View className="flex-row items-center justify-between mb-4">
                          <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-white/80 rounded-full justify-center items-center mr-3">
                              <Ionicons 
                                name={record.punchOut ? "checkmark-circle" : "time"} 
                                size={20} 
                                color={getStatusColor(record)} 
                                accessibilityIgnoresInvertColors
                              />
                            </View>
                            <View>
                              <Text className="font-bold text-gray-800 text-lg">
                                Record #{index + 1}
                              </Text>
                              <Text className="text-sm font-medium" style={{ color: getStatusColor(record) }}>
                                {getStatusText(record)}
                              </Text>
                            </View>
                          </View>
                        </View>
                        
                        <View className="space-y-3">
                          <View className="flex-row justify-between items-center p-3 bg-white/60 rounded-xl">
                            <View className="flex-row items-center">
                              <Ionicons name="log-in" size={16} color="#3b82f6" accessibilityIgnoresInvertColors />
                              <Text className="text-gray-700 font-medium ml-2">Punch In</Text>
                            </View>
                            <Text className="font-mono font-bold text-blue-600 text-lg">
                              {formatTime(record.punchIn)}
                            </Text>
                          </View>
                          
                          <View className="flex-row justify-between items-center p-3 bg-white/60 rounded-xl">
                            <View className="flex-row items-center">
                              <Ionicons name="log-out" size={16} color="#ef4444" accessibilityIgnoresInvertColors />
                              <Text className="text-gray-700 font-medium ml-2">Punch Out</Text>
                            </View>
                            <Text className="font-mono font-bold text-red-600 text-lg">
                              {formatTime(record.punchOut)}
                            </Text>
                          </View>
                          
                          {record.totalHours && (
                            <View className="flex-row justify-between items-center p-3 bg-white/60 rounded-xl">
                              <View className="flex-row items-center">
                                <Ionicons name="time" size={16} color="#22c55e" accessibilityIgnoresInvertColors />
                                <Text className="text-gray-700 font-medium ml-2">Total Hours</Text>
                              </View>
                              <Text className="font-bold text-green-600 text-lg">
                                {formatDuration(record.totalHours)}
                              </Text>
                            </View>
                          )}
                          
                          {record.notes && (
                            <View className="p-3 bg-white/60 rounded-xl">
                              <View className="flex-row items-center mb-2">
                                <Ionicons name="document-text" size={16} color="#6b7280" accessibilityIgnoresInvertColors />
                                <Text className="text-gray-700 font-medium ml-2">Notes</Text>
                              </View>
                              <Text className="text-gray-600 text-sm">{record.notes}</Text>
                            </View>
                          )}
                        </View>
                        
                        <View className="flex-row justify-end space-x-3 mt-4">
                          <TouchableOpacity
                            onPress={() => handleEditRecord(record)}
                            className="flex-row items-center bg-blue-500 px-4 py-3 rounded-xl shadow-sm"
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel="Edit record"
                            style={{ minHeight: 44 }}
                            {...(Platform.OS === 'android' ? { android_ripple: { color: '#FFFFFF', borderless: false, radius: 20 } } : {})}
                          >
                            <Ionicons name="create" size={16} color="white" accessibilityIgnoresInvertColors />
                            <Text className="text-white font-semibold ml-2">Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteRecord(record.id)}
                            className="flex-row items-center bg-red-500 px-4 py-3 rounded-xl shadow-sm"
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel="Delete record"
                            style={{ minHeight: 44 }}
                            {...(Platform.OS === 'android' ? { android_ripple: { color: '#FFFFFF', borderless: false, radius: 20 } } : {})}
                          >
                            <Ionicons name="trash" size={16} color="white" accessibilityIgnoresInvertColors />
                            <Text className="text-white font-semibold ml-2">Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </LinearGradient>
                    </Animated.View>
                  ))}
                </View>
              ) : (
                <View className="items-center py-12">
                  <View className="w-20 h-20 bg-gray-100 rounded-full justify-center items-center mb-4">
                    <Ionicons name="calendar-outline" size={32} color="#9ca3af" accessibilityIgnoresInvertColors />
                  </View>
                  <Text className="text-gray-600 text-xl font-semibold mb-2">No records for this date</Text>
                  <Text className="text-gray-400 text-center">Punch in to start tracking your time</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>

      {/* Edit Modal */}
      <EditPunchModal
        isVisible={isEditModalVisible}
        record={editingRecord}
        onSave={handleSaveRecord}
        onClose={() => setIsEditModalVisible(false)}
      />
    </SafeAreaView>
  );
} 