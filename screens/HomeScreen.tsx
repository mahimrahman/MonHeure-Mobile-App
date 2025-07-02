import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { usePunchStatus, useTodayData, usePunchActions } from '../utils/punchStore';

const { width, height } = Dimensions.get('window');

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

  // Animation values
  const buttonScale = useSharedValue(1);
  const buttonRotation = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  // Get today's punch data from store
  const todayPunch = todayEntries.find(entry => 
    entry.punchIn && entry.date === new Date().toISOString().split('T')[0]
  );

  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: buttonScale.value },
        { rotate: `${buttonRotation.value}deg` }
      ],
    };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ translateY: cardTranslateY.value }],
    };
  });

  // Start animations on mount
  React.useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  // Punch in/out logic
  const handlePunch = async () => {
    // Button animation
    buttonScale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1.05, { duration: 100 }),
      withSpring(1, { duration: 200 })
    );
    
    buttonRotation.value = withSequence(
      withTiming(-5, { duration: 100 }),
      withTiming(5, { duration: 100 }),
      withTiming(0, { duration: 200 })
    );

    try {
      if (!isPunchedIn) {
        await punchIn();
        Alert.alert('✅ Success', 'Punched in successfully!');
      } else {
        await punchOut();
        Alert.alert('✅ Success', 'Punched out successfully!');
      }
    } catch (error) {
      console.error('Error handling punch:', error);
      Alert.alert('❌ Error', 'Failed to save punch record');
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
        Alert.alert('✅ Success', `${editType === 'in' ? 'Punch In' : 'Punch Out'} time updated!`);
      } catch (error) {
        console.error('Error updating punch time:', error);
        Alert.alert('❌ Error', 'Failed to update punch time');
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
        Alert.alert('✅ Success', 'Today\'s data reset successfully!');
      }
    } catch (error) {
      console.error('Error resetting today:', error);
      Alert.alert('❌ Error', 'Failed to reset today\'s data');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-100 justify-center items-center">
        <View className="bg-white rounded-3xl p-8 shadow-2xl">
          <Text className="text-gray-600 text-lg font-medium">Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <View className="pt-12 pb-6 px-6">
        <Text className="text-3xl font-bold text-gray-800 mb-2">MonHeure</Text>
        <Text className="text-gray-600 text-lg">Time Tracking Made Simple</Text>
      </View>

      <View className="flex-1 justify-center items-center px-6">
        {/* Main Punch Button */}
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity
            className={`w-64 h-64 rounded-full justify-center items-center mb-8 shadow-2xl ${
              isPunchedIn 
                ? 'bg-gradient-to-br from-red-400 to-red-600' 
                : 'bg-gradient-to-br from-green-400 to-green-600'
            }`}
            onPress={handlePunch}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <View className="items-center">
              <Ionicons 
                name={isPunchedIn ? 'log-out' : 'log-in'} 
                size={80} 
                color="white" 
              />
              <Text className="text-white text-2xl font-bold mt-4 text-center">
                {isPunchedIn ? 'Punch Out' : todayPunch?.punchOut ? 'Done' : 'Punch In'}
              </Text>
              <Text className="text-white text-sm mt-2 opacity-90">
                {isPunchedIn ? 'Tap to end your day' : 'Tap to start your day'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Today's Times Card */}
        <Animated.View style={cardAnimatedStyle} className="w-full max-w-sm">
          <View className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-3 h-3 rounded-full bg-blue-500 mr-3" />
              <Text className="text-xl font-bold text-gray-800">Today's Times</Text>
            </View>
            
            <View className="space-y-4">
              <View className="flex-row justify-between items-center p-4 bg-blue-50 rounded-2xl">
                <View className="flex-row items-center">
                  <Ionicons name="log-in" size={20} color="#3b82f6" />
                  <Text className="text-gray-700 font-medium ml-2">Punch In:</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => openEditModal('in')}
                  className="bg-white px-4 py-2 rounded-xl shadow-sm"
                >
                  <Text className="text-blue-600 text-lg font-mono font-semibold">
                    {formatTime(todayPunch?.punchIn)}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View className="flex-row justify-between items-center p-4 bg-red-50 rounded-2xl">
                <View className="flex-row items-center">
                  <Ionicons name="log-out" size={20} color="#ef4444" />
                  <Text className="text-gray-700 font-medium ml-2">Punch Out:</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => openEditModal('out')}
                  className="bg-white px-4 py-2 rounded-xl shadow-sm"
                >
                  <Text className="text-red-600 text-lg font-mono font-semibold">
                    {formatTime(todayPunch?.punchOut)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {totalHoursToday > 0 && (
              <View className="mt-4 pt-4 border-t border-gray-200">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600 font-medium">Total Hours:</Text>
                  <View className="bg-green-100 px-4 py-2 rounded-xl">
                    <Text className="text-green-700 text-lg font-bold">
                      {totalHoursToday.toFixed(2)}h
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Reset Button */}
        <TouchableOpacity 
          onPress={resetToday} 
          className="bg-gray-100 px-6 py-3 rounded-2xl"
        >
          <Text className="text-gray-500 text-sm font-medium">Reset Today (for testing)</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Time Modal */}
      <Modal 
        isVisible={showEditModal} 
        onBackdropPress={() => setShowEditModal(false)}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View className="bg-white rounded-3xl p-6 items-center mx-4">
          <Text className="text-xl font-bold text-gray-800 mb-6">
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