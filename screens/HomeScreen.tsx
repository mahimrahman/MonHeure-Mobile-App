import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
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
import { useTheme } from '../utils/themeContext';

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
  const { isDarkMode } = useTheme();
  
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
  const punchInRowScale = useSharedValue(1);
  const punchOutRowScale = useSharedValue(1);
  const totalHoursScale = useSharedValue(1);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const backgroundGlow = useSharedValue(0);

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

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const punchInRowAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: punchInRowScale.value }],
    };
  });

  const punchOutRowAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: punchOutRowScale.value }],
    };
  });

  const totalHoursAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: totalHoursScale.value }],
    };
  });

  const backgroundGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundGlow.value,
    };
  });

  // Start animations on mount
  useEffect(() => {
    // Background glow animation
    backgroundGlow.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) });
    
    // Header animation
    headerOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    
    // Card animation
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

  // Animate total hours when they appear
  useEffect(() => {
    if (totalHoursToday > 0) {
      totalHoursScale.value = withSequence(
        withSpring(0.8, { damping: 8, stiffness: 200 }),
        withSpring(1.05, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 100 })
      );
    }
  }, [totalHoursToday]);

  // Enhanced punch in/out logic with haptics
  const handlePunch = async () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Enhanced button animation with bounce effect
    buttonScale.value = withSequence(
      withSpring(0.9, { damping: 8, stiffness: 200 }),
      withSpring(1.1, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 15, stiffness: 100 })
    );
    
    buttonRotation.value = withSequence(
      withTiming(-8, { duration: 150 }),
      withTiming(8, { duration: 150 }),
      withTiming(0, { duration: 300 })
    );

    // Enhanced glow animation
    glowOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 500 })
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

  // Enhanced edit modal logic with haptics
  const openEditModal = (type: 'in' | 'out') => {
    Haptics.selectionAsync();
    // Animate the row press
    if (type === 'in') {
      punchInRowScale.value = withSequence(
        withSpring(0.95, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 100 })
      );
    } else {
      punchOutRowScale.value = withSequence(
        withSpring(0.95, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 100 })
      );
    }

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
      <SafeAreaView className="flex-1 bg-background-light dark:bg-dark-bg justify-center items-center">
        <View className="bg-white dark:bg-dark-bg-card rounded-2xl p-8 shadow-md">
          <Text className="text-text-secondary dark:text-dark-text-secondary text-lg font-medium">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-dark-bg">
      {/* Background Gradient */}
      <Animated.View style={backgroundGlowStyle} className="absolute inset-0">
        <LinearGradient
          colors={isDarkMode 
            ? ['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.08)', 'rgba(20, 184, 166, 0.05)']
            : ['rgba(99, 102, 241, 0.05)', 'rgba(139, 92, 246, 0.03)', 'rgba(20, 184, 166, 0.02)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <Animated.View style={headerAnimatedStyle} className="pt-12 pb-6 px-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-text-primary dark:text-dark-text mb-2">MonHeure</Text>
              <Text className="text-text-secondary dark:text-dark-text-secondary text-lg">Time Tracking Made Simple</Text>
            </View>
            <View className="w-12 h-12 bg-gradient-to-r from-primary-indigo to-primary-violet rounded-2xl justify-center items-center shadow-md">
              <Ionicons name="time" size={24} color="white" />
            </View>
          </View>
        </Animated.View>

        <View className="flex-1 justify-center items-center px-6 pb-8">
          {/* Main Punch Button with Enhanced Glow Effect */}
          <View className="items-center mb-8">
            {/* Multiple glow layers for enhanced effect */}
            <Animated.View style={glowAnimatedStyle} className="absolute">
              <View className="w-96 h-96 rounded-full bg-gradient-to-r from-primary-indigo to-primary-violet opacity-20 blur-2xl" />
            </Animated.View>
            <Animated.View style={glowAnimatedStyle} className="absolute">
              <View className="w-80 h-80 rounded-full bg-gradient-to-r from-primary-violet to-primary-teal opacity-15 blur-xl" />
            </Animated.View>
            
            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                className="w-72 h-72 rounded-full justify-center items-center shadow-2xl"
                onPress={handlePunch}
                activeOpacity={0.9}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel={isPunchedIn ? 'Punch Out' : 'Punch In'}
                accessibilityHint={isPunchedIn ? 'Tap to end your day' : 'Tap to start your day'}
                style={{ minWidth: 72, minHeight: 72 }}
                {...(Platform.OS === 'android' ? { android_ripple: { color: '#8B5CF6', borderless: false, radius: 180 } } : {})}
              >
                <LinearGradient
                  colors={isPunchedIn 
                    ? ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'] 
                    : ['#6366F1', '#8B5CF6', '#14B8A6', '#0D9488']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-full h-full rounded-full justify-center items-center"
                >
                  <View className="items-center">
                    <View className="w-20 h-20 bg-white bg-opacity-20 rounded-full justify-center items-center mb-4">
                      <Ionicons 
                        name={isPunchedIn ? 'log-out' : 'log-in'} 
                        size={40} 
                        color="white" 
                        accessibilityIgnoresInvertColors
                      />
                    </View>
                    <Text className="text-white text-3xl font-bold mb-2 text-center">
                      {isPunchedIn ? 'Punch Out' : 'Punch In'}
                    </Text>
                    <Text className="text-white text-base opacity-90 text-center px-4">
                      {isPunchedIn ? 'Tap to end your day' : 'Tap to start your day'}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Enhanced Status Text */}
          <Animated.View style={statusTextAnimatedStyle} className="mb-8">
            <View className="bg-white dark:bg-dark-bg-card bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-sm border border-gray-100 dark:border-dark-border">
              <Text className="text-text-primary dark:text-dark-text text-lg font-medium text-center leading-6">
                {getStatusText()}
              </Text>
            </View>
          </Animated.View>

          {/* Today's Times Card - Enhanced Calendar Style */}
          <Animated.View style={cardAnimatedStyle} className="w-full max-w-sm">
            <View className="bg-white dark:bg-dark-bg-card rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 dark:border-dark-border">
              <View className="flex-row items-center mb-6">
                <View className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-indigo to-primary-violet mr-3" />
                <Text className="text-2xl font-bold text-text-primary dark:text-dark-text">Today's Schedule</Text>
              </View>
              
              <View className="space-y-5">
                {/* Enhanced Punch In Row */}
                <Animated.View style={punchInRowAnimatedStyle} className="flex-row items-center p-5 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
                  <View className="w-12 h-12 bg-gradient-to-r from-primary-indigo to-primary-violet rounded-full justify-center items-center mr-4 shadow-sm">
                    <Ionicons name="log-in" size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary dark:text-dark-text font-semibold text-lg">Punch In</Text>
                    <Text className="text-text-secondary dark:text-dark-text-secondary text-sm">Start time</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => openEditModal('in')}
                    className="bg-white dark:bg-dark-bg-secondary px-5 py-3 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-700"
                    activeOpacity={0.7}
                  >
                    <Text className="text-primary-indigo text-xl font-mono font-bold">
                      {formatTime(todayPunch?.punchIn)}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
                
                {/* Enhanced Punch Out Row */}
                <Animated.View style={punchOutRowAnimatedStyle} className="flex-row items-center p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-100 dark:border-amber-800 shadow-sm">
                  <View className="w-12 h-12 bg-gradient-to-r from-primary-amber to-orange-500 rounded-full justify-center items-center mr-4 shadow-sm">
                    <Ionicons name="log-out" size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary dark:text-dark-text font-semibold text-lg">Punch Out</Text>
                    <Text className="text-text-secondary dark:text-dark-text-secondary text-sm">End time</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => openEditModal('out')}
                    className="bg-white dark:bg-dark-bg-secondary px-5 py-3 rounded-xl shadow-sm border border-amber-200 dark:border-amber-700"
                    activeOpacity={0.7}
                  >
                    <Text className="text-primary-amber text-xl font-mono font-bold">
                      {formatTime(todayPunch?.punchOut)}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
              
              {/* Enhanced Total Hours */}
              {totalHoursToday > 0 && (
                <Animated.View style={totalHoursAnimatedStyle} className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
                  <View className="flex-row justify-between items-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl border border-teal-100 dark:border-teal-800 shadow-sm">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-gradient-to-r from-primary-teal to-cyan-500 rounded-full justify-center items-center mr-3 shadow-sm">
                        <Ionicons name="time" size={20} color="white" />
                      </View>
                      <View>
                        <Text className="text-text-primary dark:text-dark-text font-semibold text-lg">Total Hours</Text>
                        <Text className="text-text-secondary dark:text-dark-text-secondary text-sm">Today's work</Text>
                      </View>
                    </View>
                    <View className="bg-white dark:bg-dark-bg-secondary px-5 py-3 rounded-xl shadow-sm border border-teal-200 dark:border-teal-700">
                      <Text className="text-primary-teal text-2xl font-bold">
                        {totalHoursToday.toFixed(2)}h
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              )}

              {/* Enhanced Date Display */}
              <View className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                <View className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3">
                  <Text className="text-text-secondary dark:text-dark-text-secondary text-center font-medium">
                    {formatDate(new Date().toISOString())}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Enhanced Reset Button */}
          <TouchableOpacity 
            onPress={resetToday} 
            className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-8 py-4 rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm"
            activeOpacity={0.7}
          >
            <Text className="text-text-secondary dark:text-dark-text-secondary text-sm font-medium">Reset Today (for testing)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Enhanced Edit Time Modal */}
      <Modal 
        isVisible={showEditModal} 
        onBackdropPress={() => setShowEditModal(false)}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View className="bg-white dark:bg-dark-bg-card rounded-2xl p-6 items-center mx-4 shadow-2xl">
          <View className="w-16 h-16 bg-gradient-to-r from-primary-indigo to-primary-violet rounded-full justify-center items-center mb-4">
            <Ionicons name="time" size={32} color="white" />
          </View>
          <Text className="text-xl font-bold text-text-primary dark:text-dark-text mb-6 text-center">
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
    </SafeAreaView>
  );
} 