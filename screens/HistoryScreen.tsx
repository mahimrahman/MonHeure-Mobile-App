import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing,
  withDelay
} from 'react-native-reanimated';
import Modal from 'react-native-modal';
import { PunchRecord } from '../types/punch';
import { 
  fetchAllEntries, 
  updatePunchEntry, 
  deletePunchEntry 
} from '../utils/database';
import { usePunchActions } from '../utils/punchStore';
import { useTheme } from '../utils/themeContext';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function HistoryScreen() {
  const { refreshTodayData } = usePunchActions();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [punchRecords, setPunchRecords] = useState<PunchRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PunchRecord | undefined>();
  const [editStartTime, setEditStartTime] = useState<Date>(new Date());
  const [editEndTime, setEditEndTime] = useState<Date>(new Date());
  const [editNotes, setEditNotes] = useState('');

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const listOpacity = useSharedValue(0);
  const listTranslateY = useSharedValue(30);

  // Load punch data on component mount
  useEffect(() => {
    loadPunchData();
  }, []);

  // Start animations on mount
  useEffect(() => {
    // Header animation
    headerOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    
    // List animation
    listOpacity.value = withDelay(200, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    listTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const loadPunchData = async () => {
    try {
      const records = await fetchAllEntries();
      setPunchRecords(records);
    } catch (error) {
      console.error('Error loading punch data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshTodayData();
      await loadPunchData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshTodayData]);

  const handleEditRecord = (record: PunchRecord) => {
    Haptics.selectionAsync();
    setEditingRecord(record);
    setEditStartTime(record.punchIn ? new Date(record.punchIn) : new Date());
    setEditEndTime(record.punchOut ? new Date(record.punchOut) : new Date());
    setEditNotes(record.notes || '');
    setIsEditModalVisible(true);
  };

  const handleSaveRecord = async () => {
    if (!editingRecord) return;

    try {
      const updatedRecord: PunchRecord = {
        ...editingRecord,
        punchIn: editStartTime.toISOString(),
        punchOut: editEndTime.toISOString(),
        notes: editNotes,
        totalHours: (editEndTime.getTime() - editStartTime.getTime()) / (1000 * 60 * 60)
      };

      await updatePunchEntry(editingRecord.id, updatedRecord);
      await loadPunchData();
      setIsEditModalVisible(false);
      Alert.alert('✅ Success', 'Time log updated successfully');
    } catch (error) {
      console.error('Error updating record:', error);
      Alert.alert('❌ Error', 'Failed to update time log');
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Time Log',
      'Are you sure you want to delete this time log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePunchEntry(recordId);
              await loadPunchData();
              Alert.alert('✅ Success', 'Time log deleted successfully');
            } catch (error) {
              console.error('Error deleting record:', error);
              Alert.alert('❌ Error', 'Failed to delete time log');
            }
          },
        },
      ]
    );
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return '0m';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const listAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: listOpacity.value,
      transform: [{ translateY: listTranslateY.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
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
          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Time Logs
          </Text>

          <Animated.View style={listAnimatedStyle} className="space-y-4">
            {punchRecords.length === 0 ? (
              <View className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <View className="items-center">
                  <Ionicons name="time-outline" size={64} color="#9CA3AF" />
                  <Text className="text-gray-600 dark:text-gray-300 text-lg font-medium mt-4 text-center">
                    No time logs yet
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
                    Start tracking your time to see your logs here
                  </Text>
                </View>
              </View>
            ) : (
              punchRecords.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  onPress={() => handleEditRecord(record)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-gray-900 dark:text-white font-bold text-lg mb-2">
                        {formatDate(record.date)}
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons name="time" size={16} color="#6B7280" />
                        <Text className="text-gray-600 dark:text-gray-300 ml-2">
                          {formatTime(record.punchIn)} - {formatTime(record.punchOut)}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-purple-600 dark:text-purple-400 font-bold text-lg mr-2">
                        {formatDuration(record.punchIn, record.punchOut)}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </Animated.View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal 
        isVisible={isEditModalVisible} 
        onBackdropPress={() => setIsEditModalVisible(false)}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4 shadow-2xl">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Edit Time Log
          </Text>
          
          <View className="space-y-4">
            <View>
              <Text className="text-gray-900 dark:text-white font-medium mb-2">Start Time</Text>
              <View className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex-row items-center justify-between">
                <Text className="text-gray-900 dark:text-white">
                  {editStartTime.toLocaleDateString()} {editStartTime.toLocaleTimeString()}
                </Text>
                <Ionicons name="calendar" size={20} color="#6B7280" />
              </View>
            </View>

            <View>
              <Text className="text-gray-900 dark:text-white font-medium mb-2">End Time (optional)</Text>
              <View className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex-row items-center justify-between">
                <Text className="text-gray-900 dark:text-white">
                  {editEndTime.toLocaleDateString()} {editEndTime.toLocaleTimeString()}
                </Text>
                <Ionicons name="calendar" size={20} color="#6B7280" />
              </View>
            </View>

            <View>
              <Text className="text-gray-900 dark:text-white font-medium mb-2">Notes</Text>
              <View className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <Text className="text-gray-500 dark:text-gray-400">
                  Add optional notes...
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row space-x-4 mt-6">
            <TouchableOpacity
              onPress={() => setIsEditModalVisible(false)}
              className="flex-1 bg-gray-300 dark:bg-gray-600 px-4 py-3 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-gray-900 dark:text-white font-semibold text-center">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveRecord}
              className="flex-1 bg-purple-500 px-4 py-3 rounded-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-center">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 