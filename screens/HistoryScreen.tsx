import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
  Platform,
  TextInput,
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
  Easing
} from 'react-native-reanimated';
import { PunchRecord } from '../types/punch';
import { fetchAllEntries, updatePunchRecord, deletePunchRecord } from '../utils/database';
import { usePunchActions } from '../utils/punchStore';
import { useTheme } from '../utils/themeContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HistoryScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const { refreshTodayData } = usePunchActions();

  const [punchRecords, setPunchRecords] = useState<PunchRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PunchRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PunchRecord | null>(null);
  const [editStartTime, setEditStartTime] = useState<Date>(new Date());
  const [editEndTime, setEditEndTime] = useState<Date>(new Date());
  const [editNotes, setEditNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Optimized animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const listOpacity = useSharedValue(0);
  const listTranslateY = useSharedValue(30);
  const searchOpacity = useSharedValue(0);
  const searchScale = useSharedValue(0.95);

  const loadPunchData = useCallback(async () => {
    try {
      setLoading(true);
      const entries = await fetchAllEntries();
      setPunchRecords(entries);
    } catch (error) {
      console.error('Error loading punch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPunchData();
  }, [loadPunchData]);

  // Filter records based on search and filter type
  useEffect(() => {
    let filtered = [...punchRecords];
    
    // Apply filter type
    if (filterType !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        switch (filterType) {
          case 'today':
            return recordDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return recordDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return recordDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(record => 
        record.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatDate(record.date).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredRecords(filtered);
  }, [punchRecords, searchQuery, filterType]);

  // Optimized animations
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    listOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    listTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    searchOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    searchScale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPunchData();
      await refreshTodayData();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error refreshing data:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setRefreshing(false);
    }
  }, [loadPunchData, refreshTodayData]);

  const handleEditRecord = useCallback((record: PunchRecord) => {
    Haptics.selectionAsync();
    setSelectedRecord(record);
    setEditStartTime(record.punchIn ? new Date(record.punchIn) : new Date());
    setEditEndTime(record.punchOut ? new Date(record.punchOut) : new Date());
    setEditNotes(record.notes || '');
    setShowEditModal(true);
  }, []);

  const handleSaveRecord = useCallback(async () => {
    if (!selectedRecord) return;

    // Validate times
    if (editStartTime >= editEndTime) {
      Alert.alert('❌ Invalid Times', 'End time must be after start time');
      return;
    }

    try {
      const updatedRecord = {
        ...selectedRecord,
        punchIn: editStartTime.toISOString(),
        punchOut: editEndTime.toISOString(),
        notes: editNotes,
        updatedAt: new Date().toISOString(),
      };

      await updatePunchRecord(updatedRecord);
      await loadPunchData();
      setShowEditModal(false);
      setSelectedRecord(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('✅ Success', 'Record updated successfully');
    } catch (error) {
      console.error('Error updating record:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('❌ Error', 'Failed to update record');
    }
  }, [selectedRecord, editStartTime, editEndTime, editNotes, loadPunchData]);

  const handleDeleteRecord = useCallback(async (record: PunchRecord) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePunchRecord(record.id);
              await loadPunchData();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('✅ Success', 'Record deleted successfully');
            } catch (error) {
              console.error('Error deleting record:', error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert('❌ Error', 'Failed to delete record');
            }
          },
        },
      ]
    );
  }, [loadPunchData]);

  const formatTime = useCallback((isoString?: string) => {
    if (!isoString) return '--:--';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }, []);

  const formatDuration = useCallback((startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return '0m';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  const formatDate = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }, []);

  const formatShortDate = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }, []);

  // Memoized statistics
  const statistics = useMemo(() => {
    const totalRecords = filteredRecords.length;
    const totalHours = filteredRecords.reduce((acc, record) => {
      if (record.punchIn && record.punchOut) {
        const start = new Date(record.punchIn);
        const end = new Date(record.punchOut);
        return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }
      return acc;
    }, 0);
    
    return { totalRecords, totalHours: Math.round(totalHours * 100) / 100 };
  }, [filteredRecords]);

  // Optimized animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const listAnimatedStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
    transform: [{ translateY: listTranslateY.value }],
  }));

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
    transform: [{ scale: searchScale.value }],
  }));

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center">
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <View className="items-center">
            <Ionicons name="time" size={48} color={isDarkMode ? '#8B5CF6' : '#6366F1'} />
            <Text className="text-gray-600 dark:text-gray-300 text-lg font-medium mt-4">Loading History...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
              <Text className="text-2xl font-extrabold text-gray-900 dark:text-white ml-2">MonHeure</Text>
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
        <View className="flex-row justify-center mb-6">
          <TouchableOpacity 
            className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg justify-center items-center mx-2"
            onPress={() => router.push('/')}
          >
            <Ionicons name="time" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg justify-center items-center mx-2"
            onPress={() => router.push('/dashboard')}
          >
            <Ionicons name="analytics" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-12 h-12 bg-purple-500 rounded-lg justify-center items-center mx-2"
            onPress={() => router.push('/history')}
          >
            <Ionicons name="list" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg justify-center items-center mx-2"
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings" size={24} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        <View className="px-6 pb-8">
          {/* History Title and Statistics */}
          <View className="mb-6">
            <Text className="text-4xl font-black text-gray-900 dark:text-white text-center mb-4">
              Time History
            </Text>
            
            {/* Statistics Cards */}
            <View className="flex-row space-x-3 mb-6">
              <View className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <View className="items-center">
                  <Ionicons name="list" size={24} color={isDarkMode ? '#8B5CF6' : '#6366F1'} />
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {statistics.totalRecords}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">Records</Text>
                </View>
              </View>
              
              <View className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <View className="items-center">
                  <Ionicons name="time" size={24} color={isDarkMode ? '#10B981' : '#059669'} />
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {statistics.totalHours}h
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">Total Hours</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Search and Filter Section */}
          <Animated.View style={searchAnimatedStyle} className="mb-6">
            {/* Search Bar */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 mb-4">
              <View className="flex-row items-center">
                <Ionicons name="search" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <TextInput
                  className="flex-1 ml-3 text-gray-900 dark:text-white text-base font-medium"
                  placeholder="Search records..."
                  placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Filter Tabs */}
            <View className="flex-row bg-gray-200 dark:bg-gray-700 rounded-xl p-1">
              {[
                { key: 'all', label: 'All', icon: 'apps' },
                { key: 'today', label: 'Today', icon: 'today' },
                { key: 'week', label: 'Week', icon: 'calendar' },
                { key: 'month', label: 'Month', icon: 'calendar-outline' }
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  onPress={() => setFilterType(filter.key as any)}
                  className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-lg ${
                    filterType === filter.key
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'bg-transparent'
                  }`}
                >
                  <Ionicons 
                    name={filter.icon as any} 
                    size={16} 
                    color={filterType === filter.key 
                      ? (isDarkMode ? '#8B5CF6' : '#6366F1')
                      : (isDarkMode ? '#9CA3AF' : '#6B7280')
                    } 
                  />
                  <Text className={`ml-1 text-sm font-medium ${
                    filterType === filter.key
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          <Animated.View style={listAnimatedStyle}>
            {filteredRecords.length === 0 ? (
              <View className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <View className="items-center">
                  <Ionicons name="time-outline" size={64} color={isDarkMode ? '#6B7280' : '#9CA3AF'} />
                  <Text className="text-gray-600 dark:text-gray-300 text-lg font-semibold mt-4 text-center">
                    {searchQuery || filterType !== 'all' ? 'No matching records' : 'No time records yet'}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
                    {searchQuery || filterType !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Start tracking your time to see your history here'
                    }
                  </Text>
                </View>
              </View>
            ) : (
              <View className="space-y-4">
                {filteredRecords.map((record, index) => (
                  <TouchableOpacity
                    key={record.id}
                    onPress={() => handleEditRecord(record)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center">
                        <View className="bg-purple-100 dark:bg-purple-900 rounded-lg p-2 mr-3">
                          <Ionicons name="time" size={16} color="#8B5CF6" />
                        </View>
                        <View>
                          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatShortDate(record.date)}
                          </Text>
                          <Text className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(record.date)}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteRecord(record)}
                        className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    <View className="space-y-3">
                      <View className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <View className="flex-row items-center">
                          <Ionicons name="play-circle" size={20} color="#10B981" />
                          <Text className="text-gray-600 dark:text-gray-300 ml-2 font-medium">Start</Text>
                        </View>
                        <Text className="text-gray-900 dark:text-white font-semibold text-lg">
                          {formatTime(record.punchIn)}
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <View className="flex-row items-center">
                          <Ionicons name="stop-circle" size={20} color="#EF4444" />
                          <Text className="text-gray-600 dark:text-gray-300 ml-2 font-medium">End</Text>
                        </View>
                        <Text className="text-gray-900 dark:text-white font-semibold text-lg">
                          {formatTime(record.punchOut)}
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <View className="flex-row items-center">
                          <Ionicons name="timer" size={20} color="#3B82F6" />
                          <Text className="text-gray-600 dark:text-gray-300 ml-2 font-medium">Duration</Text>
                        </View>
                        <Text className="text-gray-900 dark:text-white font-semibold text-lg">
                          {formatDuration(record.punchIn, record.punchOut)}
                        </Text>
                      </View>

                      {record.notes && (
                        <View className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <View className="flex-row items-start">
                            <Ionicons name="chatbubble-outline" size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} className="mt-1 mr-2" />
                            <Text className="text-gray-600 dark:text-gray-300 text-sm flex-1">
                              {record.notes}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white dark:bg-gray-800 rounded-xl p-6 m-4 w-80 max-h-96">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Edit Time Record
            </Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-semibold">Start Time</Text>
                  <TouchableOpacity 
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                    onPress={() => setShowStartTimePicker(true)}
                  >
                    <Text className="text-gray-900 dark:text-white text-center font-medium">
                      {formatTime(editStartTime.toISOString())}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-semibold">End Time</Text>
                  <TouchableOpacity 
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                    onPress={() => setShowEndTimePicker(true)}
                  >
                    <Text className="text-gray-900 dark:text-white text-center font-medium">
                      {formatTime(editEndTime.toISOString())}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-semibold">Notes</Text>
                                      <TextInput
                      className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-medium"
                      value={editNotes}
                      onChangeText={setEditNotes}
                      placeholder="Add notes..."
                      placeholderTextColor={isDarkMode ? '#6B7280' : '#9CA3AF'}
                      multiline
                      numberOfLines={3}
                    />
                </View>
              </View>
            </ScrollView>
            
            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                className="bg-gray-300 dark:bg-gray-600 py-3 px-6 rounded-lg flex-1 mr-2"
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 dark:text-gray-300 font-semibold text-center">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSaveRecord}
                className="bg-blue-500 py-3 px-6 rounded-lg flex-1 ml-2"
                activeOpacity={0.7}
              >
                <Text className="text-white font-bold text-center">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Pickers */}
      {showStartTimePicker && (
        <DateTimePicker
          value={editStartTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartTimePicker(false);
            if (selectedDate) {
              setEditStartTime(selectedDate);
            }
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={editEndTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndTimePicker(false);
            if (selectedDate) {
              setEditEndTime(selectedDate);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
} 