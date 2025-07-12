import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { usePunchStatus, useTodayData, usePunchActions } from '../utils/punchStore';

const { width, height } = Dimensions.get('window');

function formatTime(dateString?: string) {
  if (!dateString) return '--:--';
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString([], { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
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
  const statusTextOpacity = useSharedValue(0);
  const statusTextTranslateY = useSharedValue(20);
  const glowOpacity = useSharedValue(0);

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

  const statusTextAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: statusTextOpacity.value,
      transform: [{ translateY: statusTextTranslateY.value }],
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  // Start animations on mount
  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    
    // Delay status text animation
    setTimeout(() => {
      statusTextOpacity.value = withTiming(1, { duration: 600 });
      statusTextTranslateY.value = withSpring(0, { damping: 12, stiffness: 80 });
    }, 200);
  }, []);

  // Animate status change
  useEffect(() => {
    statusTextOpacity.value = withTiming(0, { duration: 200 }, () => {
      statusTextOpacity.value = withTiming(1, { duration: 400 });
    });
    statusTextTranslateY.value = withSpring(0, { damping: 12, stiffness: 80 });
  }, [isPunchedIn, currentPunchInTime]);

  // Punch in/out logic
  const handlePunch = async () => {
    // Button animation with glow effect
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

    // Glow animation
    glowOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 300 })
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

  // Get status text
  const getStatusText = () => {
    if (isPunchedIn && currentPunchInTime) {
      const punchInTime = formatTime(currentPunchInTime);
      return `You're currently punched in at ${punchInTime}`;
    } else if (todayPunch?.punchOut) {
      return "You've completed your work for today";
    } else {
      return "Ready to start your work day";
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-light justify-center items-center">
        <View className="bg-white rounded-2xl p-8 shadow-md">
          <Text className="text-text-secondary text-lg font-medium">Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background-light" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="pt-12 pb-6 px-6">
        <Text className="text-3xl font-bold text-text-primary mb-2">MonHeure</Text>
        <Text className="text-text-secondary text-lg">Time Tracking Made Simple</Text>
      </View>

      <View className="flex-1 justify-center items-center px-6 pb-8">
        {/* Main Punch Button with Glow Effect */}
        <View className="items-center mb-6">
          <Animated.View style={glowAnimatedStyle} className="absolute">
            <View className="w-80 h-80 rounded-full bg-gradient-to-r from-primary-indigo to-primary-violet opacity-30 blur-xl" />
          </Animated.View>
          
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              className="w-72 h-72 rounded-full justify-center items-center shadow-md"
              onPress={handlePunch}
              activeOpacity={0.9}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isPunchedIn 
                  ? ['#EF4444', '#DC2626', '#B91C1C'] 
                  : ['#6366F1', '#8B5CF6', '#14B8A6']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full h-full rounded-full justify-center items-center"
              >
                <View className="items-center">
                  <Ionicons 
                    name={isPunchedIn ? 'log-out' : 'log-in'} 
                    size={90} 
                    color="white" 
                  />
                  <Text className="text-white text-3xl font-bold mt-6 text-center">
                    {isPunchedIn ? 'Punch Out' : 'Punch In'}
                  </Text>
                  <Text className="text-white text-base mt-3 opacity-90 text-center px-4">
                    {isPunchedIn ? 'Tap to end your day' : 'Tap to start your day'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Status Text */}
        <Animated.View style={statusTextAnimatedStyle} className="mb-8">
          <Text className="text-text-primary text-lg font-medium text-center px-6 leading-6">
            {getStatusText()}
          </Text>
        </Animated.View>

        {/* Today's Times Card - Calendar Style */}
        <Animated.View style={cardAnimatedStyle} className="w-full max-w-sm">
          <View className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
            <View className="flex-row items-center mb-6">
              <View className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-indigo to-primary-violet mr-3" />
              <Text className="text-2xl font-bold text-text-primary">Today's Schedule</Text>
            </View>
            
            <View className="space-y-5">
              {/* Punch In Row */}
              <View className="flex-row items-center p-5 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100">
                <View className="w-12 h-12 bg-primary-indigo rounded-full justify-center items-center mr-4">
                  <Ionicons name="log-in" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold text-lg">Punch In</Text>
                  <Text className="text-text-secondary text-sm">Start time</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => openEditModal('in')}
                  className="bg-white px-5 py-3 rounded-xl shadow-sm border border-indigo-200"
                >
                  <Text className="text-primary-indigo text-xl font-mono font-bold">
                    {formatTime(todayPunch?.punchIn)}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Punch Out Row */}
              <View className="flex-row items-center p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                <View className="w-12 h-12 bg-primary-amber rounded-full justify-center items-center mr-4">
                  <Ionicons name="log-out" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold text-lg">Punch Out</Text>
                  <Text className="text-text-secondary text-sm">End time</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => openEditModal('out')}
                  className="bg-white px-5 py-3 rounded-xl shadow-sm border border-amber-200"
                >
                  <Text className="text-primary-amber text-xl font-mono font-bold">
                    {formatTime(todayPunch?.punchOut)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Total Hours */}
            {totalHoursToday > 0 && (
              <View className="mt-6 pt-6 border-t border-gray-200">
                <View className="flex-row justify-between items-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-primary-teal rounded-full justify-center items-center mr-3">
                      <Ionicons name="time" size={20} color="white" />
                    </View>
                    <View>
                      <Text className="text-text-primary font-semibold text-lg">Total Hours</Text>
                      <Text className="text-text-secondary text-sm">Today's work</Text>
                    </View>
                  </View>
                  <View className="bg-white px-5 py-3 rounded-xl shadow-sm border border-teal-200">
                    <Text className="text-primary-teal text-2xl font-bold">
                      {totalHoursToday.toFixed(2)}h
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Date Display */}
            <View className="mt-4 pt-4 border-t border-gray-200">
              <Text className="text-text-secondary text-center font-medium">
                {formatDate(new Date().toISOString())}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Reset Button */}
        <TouchableOpacity 
          onPress={resetToday} 
          className="bg-gray-100 px-8 py-4 rounded-2xl border border-gray-200"
        >
          <Text className="text-text-secondary text-sm font-medium">Reset Today (for testing)</Text>
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
        <View className="bg-white rounded-2xl p-6 items-center mx-4">
          <Text className="text-xl font-bold text-text-primary mb-6">
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
    </ScrollView>
  );
} 