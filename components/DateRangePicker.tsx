import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

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

  return (
    <View className="bg-white rounded-lg shadow-sm p-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4">Date Range</Text>
      
      <View className="space-y-3">
        {/* Start Date */}
        <View>
          <Text className="text-sm font-medium text-gray-600 mb-2">Start Date</Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg"
          >
            <Text className="text-gray-800">{formatDate(startDate)}</Text>
            <Ionicons name="calendar" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* End Date */}
        <View>
          <Text className="text-sm font-medium text-gray-600 mb-2">End Date</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg"
          >
            <Text className="text-gray-800">{formatDate(endDate)}</Text>
            <Ionicons name="calendar" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Date Range Summary */}
        <View className="mt-4 p-3 bg-blue-50 rounded-lg">
          <Text className="text-sm font-medium text-blue-800 mb-1">Selected Range</Text>
          <Text className="text-blue-600">{getDateRangeText()}</Text>
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
            <View className="bg-white rounded-t-lg p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-gray-800">
                  {showStartPicker ? 'Select Start Date' : 'Select End Date'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowStartPicker(false);
                    setShowEndPicker(false);
                  }}
                >
                  <Text className="text-blue-500 font-semibold">Done</Text>
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
  );
} 