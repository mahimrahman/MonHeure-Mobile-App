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
import { PunchRecord } from '../types/punch';
import { storage } from '../utils/storage';
import EditPunchModal from '../components/EditPunchModal';
import { addSampleDataToStorage } from '../utils/sampleData';

interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor: string;
    selected?: boolean;
    selectedColor?: string;
  };
}

export default function HistoryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [punchRecords, setPunchRecords] = useState<PunchRecord[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDateRecords, setSelectedDateRecords] = useState<PunchRecord[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PunchRecord | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  // Load punch data on component mount
  useEffect(() => {
    loadPunchData();
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
          dotColor: record.punchOut ? '#10b981' : '#f59e0b',
        };
      }
    });
    setMarkedDates(marked);
  }, [punchRecords]);

  const loadPunchData = async () => {
    try {
      const data = await storage.getAllPunchRecords();
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

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleEditRecord = (record: PunchRecord) => {
    setEditingRecord(record);
    setIsEditModalVisible(true);
  };

  const handleSaveRecord = async (updatedRecord: PunchRecord) => {
    try {
      await storage.updatePunchRecord(updatedRecord.id, updatedRecord);
      await loadPunchData();
      Alert.alert('Success', 'Punch record updated successfully');
    } catch (error) {
      console.error('Error updating record:', error);
      Alert.alert('Error', 'Failed to update punch record');
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      await storage.deletePunchRecord(recordId);
      await loadPunchData();
      Alert.alert('Success', 'Punch record deleted successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
      Alert.alert('Error', 'Failed to delete punch record');
    }
  };

  const handleLoadSampleData = async () => {
    try {
      await addSampleDataToStorage();
      await loadPunchData();
      Alert.alert('Success', 'Sample data loaded successfully');
    } catch (error) {
      console.error('Error loading sample data:', error);
      Alert.alert('Error', 'Failed to load sample data');
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
    if (record.punchIn && record.punchOut) return '#10b981'; // Completed
    if (record.punchIn && !record.punchOut) return '#f59e0b'; // In progress
    return '#6b7280'; // No data
  };

  const getStatusText = (record: PunchRecord) => {
    if (record.punchIn && record.punchOut) return 'Completed';
    if (record.punchIn && !record.punchOut) return 'In Progress';
    return 'No Data';
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">History</Text>
        <Text className="text-gray-600 mt-1">View and manage your punch records</Text>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Calendar */}
        <View className="bg-white m-4 rounded-lg shadow-sm overflow-hidden">
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                ...markedDates[selectedDate],
                selected: true,
                selectedColor: '#3b82f6',
              },
            }}
            theme={{
              selectedDayBackgroundColor: '#3b82f6',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#3b82f6',
              dayTextColor: '#374151',
              textDisabledColor: '#d1d5db',
              dotColor: '#10b981',
              selectedDotColor: '#ffffff',
              arrowColor: '#3b82f6',
              monthTextColor: '#374151',
              indicatorColor: '#3b82f6',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
          />
        </View>

        {/* Selected Date Info */}
        <View className="bg-white mx-4 rounded-lg shadow-sm p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Text className="text-gray-600">
            {selectedDateRecords.length} punch record{selectedDateRecords.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Punch Records for Selected Date */}
        <View className="mx-4 mb-4">
          {selectedDateRecords.length === 0 ? (
            <View className="bg-white rounded-lg shadow-sm p-8 items-center">
              <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-lg mt-4 text-center">
                No punch records for this date
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center">
                Select another date or add a new punch record
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {selectedDateRecords.map((record) => (
                <View key={record.id} className="bg-white rounded-lg shadow-sm p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: getStatusColor(record) }}
                      />
                      <Text className="font-semibold text-gray-800">
                        {getStatusText(record)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleEditRecord(record)}
                      className="p-2"
                    >
                      <Ionicons name="pencil" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>

                  <View className="space-y-2">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Punch In:</Text>
                      <Text className="font-medium text-gray-800">
                        {formatTime(record.punchIn)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Punch Out:</Text>
                      <Text className="font-medium text-gray-800">
                        {formatTime(record.punchOut)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Total Hours:</Text>
                      <Text className="font-medium text-gray-800">
                        {formatDuration(record.totalHours)}
                      </Text>
                    </View>
                    {record.notes && (
                      <View className="mt-3 pt-3 border-t border-gray-100">
                        <Text className="text-gray-600 text-sm mb-1">Notes:</Text>
                        <Text className="text-gray-800">{record.notes}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Legend */}
        <View className="bg-white mx-4 rounded-lg shadow-sm p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Legend</Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full mr-3 bg-green-500" />
              <Text className="text-gray-700">Completed day</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full mr-3 bg-yellow-500" />
              <Text className="text-gray-700">In progress day</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full mr-3 bg-blue-500" />
              <Text className="text-gray-700">Selected date</Text>
            </View>
          </View>
        </View>

        {/* Sample Data Button (for testing) */}
        {punchRecords.length === 0 && (
          <View className="mx-4 mb-4">
            <TouchableOpacity
              onPress={handleLoadSampleData}
              className="bg-blue-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold text-lg">Load Sample Data</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <EditPunchModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingRecord(undefined);
        }}
        onSave={handleSaveRecord}
        onDelete={handleDeleteRecord}
        record={editingRecord}
      />
    </View>
  );
} 