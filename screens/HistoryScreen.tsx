import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
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

  // Animation values
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);

  // Load punch data on component mount
  useEffect(() => {
    loadPunchData();
  }, []);

  // Start animations on mount
  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 600 });
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

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleEditRecord = (record: PunchRecord) => {
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

  const handleDeleteRecord = async (recordId: string) => {
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
  };

  const handleLoadSampleData = async () => {
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

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-6 border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-800 mb-2">History</Text>
        <Text className="text-gray-600 text-lg">View and manage your punch records</Text>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Calendar */}
        <Animated.View 
          style={useAnimatedStyle(() => ({
            opacity: cardOpacity.value,
            transform: [{ translateY: cardTranslateY.value }],
          }))}
          className="bg-white m-6 rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                ...markedDates[selectedDate],
                selected: true,
                selectedColor: '#0ea5e9',
              },
            }}
            theme={{
              selectedDayBackgroundColor: '#0ea5e9',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#0ea5e9',
              dayTextColor: '#374151',
              textDisabledColor: '#d1d5db',
              dotColor: '#22c55e',
              selectedDotColor: '#ffffff',
              arrowColor: '#0ea5e9',
              monthTextColor: '#374151',
              indicatorColor: '#0ea5e9',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </Animated.View>

        {/* Selected Date Info */}
        <Animated.View 
          style={useAnimatedStyle(() => ({
            opacity: cardOpacity.value,
            transform: [{ translateY: cardTranslateY.value }],
          }))}
          className="bg-white mx-6 rounded-3xl shadow-xl p-6 mb-6 border border-gray-100"
        >
          <View className="flex-row items-center mb-4">
            <View className="w-3 h-3 rounded-full bg-blue-500 mr-3" />
            <Text className="text-xl font-bold text-gray-800">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          {selectedDateRecords.length > 0 ? (
            <View className="space-y-4">
              {selectedDateRecords.map((record, index) => (
                <View key={record.id} className="bg-gray-50 rounded-2xl p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: getStatusColor(record) }}
                      />
                      <Text className="font-semibold text-gray-800">
                        Record #{index + 1}
                      </Text>
                    </View>
                    <Text className="text-sm font-medium" style={{ color: getStatusColor(record) }}>
                      {getStatusText(record)}
                    </Text>
                  </View>
                  
                  <View className="space-y-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-600">Punch In:</Text>
                      <Text className="font-mono font-semibold text-blue-600">
                        {formatTime(record.punchIn)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-600">Punch Out:</Text>
                      <Text className="font-mono font-semibold text-red-600">
                        {formatTime(record.punchOut)}
                      </Text>
                    </View>
                    {record.totalHours && (
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-600">Duration:</Text>
                        <Text className="font-semibold text-green-600">
                          {formatDuration(record.totalHours)}
                        </Text>
                      </View>
                    )}
                    {record.notes && (
                      <View className="mt-2 pt-2 border-t border-gray-200">
                        <Text className="text-gray-600 text-sm">Notes: {record.notes}</Text>
                      </View>
                    )}
                  </View>
                  
                  <View className="flex-row justify-end space-x-2 mt-3">
                    <TouchableOpacity
                      onPress={() => handleEditRecord(record)}
                      className="bg-blue-100 px-4 py-2 rounded-xl"
                    >
                      <Text className="text-blue-600 font-medium text-sm">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteRecord(record.id)}
                      className="bg-red-100 px-4 py-2 rounded-xl"
                    >
                      <Text className="text-red-600 font-medium text-sm">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-8">
              <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-lg mt-2">No records for this date</Text>
              <Text className="text-gray-400 text-sm mt-1">Punch in to start tracking</Text>
            </View>
          )}
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
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="add-circle" size={24} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">Load Sample Data</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Edit Modal */}
      <EditPunchModal
        isVisible={isEditModalVisible}
        record={editingRecord}
        onSave={handleSaveRecord}
        onClose={() => setIsEditModalVisible(false)}
      />
    </View>
  );
} 