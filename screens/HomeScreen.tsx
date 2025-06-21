import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = 'monheure_today_punch';

function formatTime(dateString?: string) {
  if (!dateString) return '--:--';
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function HomeScreen() {
  const [punchIn, setPunchIn] = useState<string | undefined>();
  const [punchOut, setPunchOut] = useState<string | undefined>();
  const [isWorking, setIsWorking] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState<'in' | 'out'>();
  const [editTime, setEditTime] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Load today's punch from storage
  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const data = await AsyncStorage.getItem(`${STORAGE_KEY}_${today}`);
      if (data) {
        const { punchIn, punchOut } = JSON.parse(data);
        setPunchIn(punchIn);
        setPunchOut(punchOut);
        setIsWorking(!!punchIn && !punchOut);
      }
    })();
  }, []);

  // Save to storage
  const savePunch = async (newPunchIn?: string, newPunchOut?: string) => {
    const today = new Date().toISOString().slice(0, 10);
    await AsyncStorage.setItem(
      `${STORAGE_KEY}_${today}`,
      JSON.stringify({ punchIn: newPunchIn, punchOut: newPunchOut })
    );
  };

  // Punch in/out logic
  const handlePunch = async () => {
    if (!punchIn) {
      // Punch in
      const now = new Date().toISOString();
      setPunchIn(now);
      setIsWorking(true);
      await savePunch(now, undefined);
    } else if (!punchOut) {
      // Punch out
      const now = new Date().toISOString();
      setPunchOut(now);
      setIsWorking(false);
      await savePunch(punchIn, now);
    } else {
      // Already punched in and out
      Alert.alert('Already punched in and out for today. Edit times if needed.');
    }
  };

  // Edge case: multiple punch-ins
  const handleMultiplePunchIn = () => {
    Alert.alert(
      'Already punched in',
      'You have already punched in today. If you missed a punch out, please punch out or edit the times.'
    );
  };

  // Edit modal logic
  const openEditModal = (type: 'in' | 'out') => {
    setEditType(type);
    setEditTime(type === 'in' && punchIn ? new Date(punchIn) : type === 'out' && punchOut ? new Date(punchOut) : new Date());
    setShowEditModal(true);
    setShowPicker(true);
  };

  const handleEditTime = async (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      if (editType === 'in') {
        setPunchIn(selectedDate.toISOString());
        await savePunch(selectedDate.toISOString(), punchOut);
      } else if (editType === 'out') {
        setPunchOut(selectedDate.toISOString());
        await savePunch(punchIn, selectedDate.toISOString());
      }
    }
    setShowEditModal(false);
  };

  // Reset for demo/testing
  const resetToday = async () => {
    const today = new Date().toISOString().slice(0, 10);
    await AsyncStorage.removeItem(`${STORAGE_KEY}_${today}`);
    setPunchIn(undefined);
    setPunchOut(undefined);
    setIsWorking(false);
  };

  return (
  <View className="flex-1 bg-gray-50 justify-center items-center p-6">
      <TouchableOpacity
        className={`w-48 h-48 rounded-full justify-center items-center mb-8 ${isWorking ? 'bg-red-500' : 'bg-green-500'}`}
        onPress={handlePunch}
        activeOpacity={0.8}
      >
        <Ionicons name={isWorking ? 'log-out' : 'log-in'} size={64} color="white" />
        <Text className="text-white text-2xl font-bold mt-4">
          {isWorking ? 'Punch Out' : punchIn && punchOut ? 'Done' : 'Punch In'}
        </Text>
      </TouchableOpacity>

      <View className="w-full max-w-xs bg-white rounded-lg shadow p-6 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Today's Times</Text>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-600">Punch In:</Text>
          <TouchableOpacity onPress={() => openEditModal('in')}>
            <Text className="text-blue-500 text-lg font-mono">{formatTime(punchIn)}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">Punch Out:</Text>
          <TouchableOpacity onPress={() => openEditModal('out')}>
            <Text className="text-blue-500 text-lg font-mono">{formatTime(punchOut)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={resetToday} className="mt-2">
        <Text className="text-xs text-gray-400">Reset Today (for testing)</Text>
      </TouchableOpacity>

      <Modal isVisible={showEditModal} onBackdropPress={() => setShowEditModal(false)}>
        <View className="bg-white p-6 rounded-lg items-center">
          <Text className="text-lg font-semibold mb-4">Edit {editType === 'in' ? 'Punch In' : 'Punch Out'} Time</Text>
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