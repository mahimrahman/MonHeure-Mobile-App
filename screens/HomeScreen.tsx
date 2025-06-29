import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { usePunchStatus, useTodayData, usePunchActions } from '../utils/punchStore';

function formatTime(dateString?: string) {
  if (!dateString) return '--:--';
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function HomeScreen() {
  const { isPunchedIn, currentPunchInTime, isLoading } = usePunchStatus();
  const { todayEntries, totalHoursToday } = useTodayData();
  const { punchIn, punchOut, updateCurrentPunch } = usePunchActions();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState<'in' | 'out'>();
  const [editTime, setEditTime] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Get today's punch data from store
  const todayPunch = todayEntries.find(entry => 
    entry.punchIn && entry.date === new Date().toISOString().split('T')[0]
  );

  // Punch in/out logic
  const handlePunch = async () => {
    try {
      if (!isPunchedIn) {
        // Punch in
        await punchIn();
        Alert.alert('Success', 'Punched in successfully!');
      } else {
        // Punch out
        await punchOut();
        Alert.alert('Success', 'Punched out successfully!');
      }
    } catch (error) {
      console.error('Error handling punch:', error);
      Alert.alert('Error', 'Failed to save punch record');
    }
  };

  // Edit modal logic
  const openEditModal = (type: 'in' | 'out') => {
    setEditType(type);
    const currentTime = type === 'in' && todayPunch?.punchIn 
      ? new Date(todayPunch.punchIn) 
      : type === 'out' && todayPunch?.punchOut 
        ? new Date(todayPunch.punchOut) 
        : new Date();
    setEditTime(currentTime);
    setShowEditModal(true);
    setShowPicker(true);
  };

  const handleEditTime = async (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate && todayPunch) {
      try {
        const updates = editType === 'in' 
          ? { punchIn: selectedDate.toISOString() }
          : { punchOut: selectedDate.toISOString() };
        
        await updateCurrentPunch(updates);
        Alert.alert('Success', `${editType === 'in' ? 'Punch In' : 'Punch Out'} time updated!`);
      } catch (error) {
        console.error('Error updating punch time:', error);
        Alert.alert('Error', 'Failed to update punch time');
      }
    }
    setShowEditModal(false);
  };

  // Reset for demo/testing
  const resetToday = async () => {
    try {
      if (todayPunch) {
        await updateCurrentPunch({ 
          punchIn: undefined, 
          punchOut: undefined 
        });
        Alert.alert('Success', 'Today\'s data reset successfully!');
      }
    } catch (error) {
      console.error('Error resetting today:', error);
      Alert.alert('Error', 'Failed to reset today\'s data');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-600 text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 justify-center items-center p-6">
      <TouchableOpacity
        className={`w-48 h-48 rounded-full justify-center items-center mb-8 ${isPunchedIn ? 'bg-red-500' : 'bg-green-500'}`}
        onPress={handlePunch}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Ionicons name={isPunchedIn ? 'log-out' : 'log-in'} size={64} color="white" />
        <Text className="text-white text-2xl font-bold mt-4">
          {isPunchedIn ? 'Punch Out' : todayPunch?.punchOut ? 'Done' : 'Punch In'}
        </Text>
      </TouchableOpacity>

      <View className="w-full max-w-xs bg-white rounded-lg shadow p-6 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Today's Times</Text>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-600">Punch In:</Text>
          <TouchableOpacity onPress={() => openEditModal('in')}>
            <Text className="text-blue-500 text-lg font-mono">
              {formatTime(todayPunch?.punchIn)}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-600">Punch Out:</Text>
          <TouchableOpacity onPress={() => openEditModal('out')}>
            <Text className="text-blue-500 text-lg font-mono">
              {formatTime(todayPunch?.punchOut)}
            </Text>
          </TouchableOpacity>
        </View>
        {totalHoursToday > 0 && (
          <View className="flex-row justify-between items-center pt-2 border-t border-gray-200">
            <Text className="text-gray-600">Total Hours:</Text>
            <Text className="text-green-600 text-lg font-semibold">
              {totalHoursToday.toFixed(2)}h
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={resetToday} className="mt-2">
        <Text className="text-xs text-gray-400">Reset Today (for testing)</Text>
      </TouchableOpacity>

      <Modal isVisible={showEditModal} onBackdropPress={() => setShowEditModal(false)}>
        <View className="bg-white p-6 rounded-lg items-center">
          <Text className="text-lg font-semibold mb-4">
            Edit {editType === 'in' ? 'Punch In' : 'Punch Out'} Time
          </Text>
          {showPicker && (
            <DateTimePicker
              value={editTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleEditTime}
            />
          )}
        </View>
      </Modal>
    </View>
  );
} 