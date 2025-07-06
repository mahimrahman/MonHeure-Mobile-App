import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Animation values
  const cardScale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      if (selectedDate > endDate) {
        Alert.alert('Invalid Date', 'Start date cannot be after end date');
        return;
      }
      onStartDateChange(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      if (selectedDate < startDate) {
        Alert.alert('Invalid Date', 'End date cannot be before start date');
        return;
      }
      onEndDateChange(selectedDate);
    }
  };

  const getDateRangeText = () => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (startDate.toDateString() === endDate.toDateString()) {
      return `${start} (1 day)`;
    }
    return `${start} - ${end} (${daysDiff} days)`;
  };

  const handleDatePress = (isStart: boolean) => {
    // Button animation
    cardScale.value = withSequence(
      withSpring(0.98, { duration: 100 }),
      withSpring(1.02, { duration: 100 }),
      withSpring(1, { duration: 200 })
    );

    if (isStart) {
      setShowStartPicker(true);
    } else {
      setShowEndPicker(true);
    }
  };

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
      opacity: cardOpacity.value,
    };
  });

  return (
    <Animated.View style={cardAnimatedStyle}>
      <View className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <View className="flex-row items-center mb-6">
          <View className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3" />
          <Text className="text-2xl font-bold text-gray-800">Date Range</Text>
        </View>
        
        <View className="space-y-4">
          {/* Dual Date Picker */}
          <View className="flex-row space-x-4">
            {/* Start Date */}
            <TouchableOpacity
              onPress={() => handleDatePress(true)}
              className="flex-1 overflow-hidden rounded-2xl"
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#dbeafe', '#bfdbfe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4 border border-blue-200"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="w-8 h-8 bg-blue-500 rounded-full justify-center items-center">
                    <Ionicons name="play" size={16} color="white" />
                  </View>
                  <Ionicons name="calendar" size={20} color="#3b82f6" />
                </View>
                <Text className="text-sm font-medium text-blue-800 mb-1">Start Date</Text>
                <Text className="text-blue-900 font-bold text-lg">{formatDate(startDate)}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* End Date */}
            <TouchableOpacity
              onPress={() => handleDatePress(false)}
              className="flex-1 overflow-hidden rounded-2xl"
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#fce7f3', '#fbcfe8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4 border border-pink-200"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="w-8 h-8 bg-pink-500 rounded-full justify-center items-center">
                    <Ionicons name="stop" size={16} color="white" />
                  </View>
                  <Ionicons name="calendar" size={20} color="#ec4899" />
                </View>
                <Text className="text-sm font-medium text-pink-800 mb-1">End Date</Text>
                <Text className="text-pink-900 font-bold text-lg">{formatDate(endDate)}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Date Range Summary */}
          <View className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <View className="flex-row items-center mb-2">
              <View className="w-6 h-6 bg-indigo-500 rounded-full justify-center items-center mr-3">
                <Ionicons name="time" size={12} color="white" />
              </View>
              <Text className="text-sm font-semibold text-indigo-800">Selected Range</Text>
            </View>
            <Text className="text-indigo-700 font-bold text-lg">{getDateRangeText()}</Text>
          </View>

          {/* Quick Range Buttons */}
          <View className="mt-4">
            <Text className="text-sm font-medium text-gray-600 mb-3">Quick Ranges</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => {
                  const today = new Date();
                  const twoWeeksAgo = new Date();
                  twoWeeksAgo.setDate(today.getDate() - 14);
                  onStartDateChange(twoWeeksAgo);
                  onEndDateChange(today);
                }}
                className="flex-1 bg-blue-100 px-3 py-2 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-blue-700 font-medium text-sm text-center">2 Weeks</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  const today = new Date();
                  const lastMonth = new Date();
                  lastMonth.setMonth(today.getMonth() - 1);
                  onStartDateChange(lastMonth);
                  onEndDateChange(today);
                }}
                className="flex-1 bg-green-100 px-3 py-2 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-green-700 font-medium text-sm text-center">1 Month</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  const today = new Date();
                  onStartDateChange(today);
                  onEndDateChange(today);
                }}
                className="flex-1 bg-purple-100 px-3 py-2 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-purple-700 font-medium text-sm text-center">Today</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Date Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartDateChange}
            maximumDate={endDate}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndDateChange}
            minimumDate={startDate}
          />
        )}

        {/* iOS Modal for Date Picker */}
        {Platform.OS === 'ios' && (showStartPicker || showEndPicker) && (
          <Modal
            visible={showStartPicker || showEndPicker}
            transparent={true}
            animationType="slide"
          >
            <View className="flex-1 justify-end bg-black bg-opacity-50">
              <View className="bg-white rounded-t-3xl p-6">
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-xl font-bold text-gray-800">
                    {showStartPicker ? 'Select Start Date' : 'Select End Date'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowStartPicker(false);
                      setShowEndPicker(false);
                    }}
                    className="w-8 h-8 bg-gray-100 rounded-full justify-center items-center"
                  >
                    <Ionicons name="close" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                
                <DateTimePicker
                  value={showStartPicker ? startDate : endDate}
                  mode="date"
                  display="spinner"
                  onChange={showStartPicker ? handleStartDateChange : handleEndDateChange}
                  maximumDate={showStartPicker ? endDate : undefined}
                  minimumDate={showEndPicker ? startDate : undefined}
                />
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Animated.View>
  );
} 