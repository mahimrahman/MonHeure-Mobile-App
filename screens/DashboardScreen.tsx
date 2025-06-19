import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>
          <Text className="text-gray-600 mt-1">Analytics & Insights</Text>
        </View>

        {/* Key Metrics */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Key Metrics</Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="bg-white p-4 rounded-lg shadow-sm flex-1 min-w-[150px]">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-blue-500">32.5h</Text>
                  <Text className="text-gray-600 text-sm">This Week</Text>
                </View>
                <Ionicons name="time" size={24} color="#3b82f6" />
              </View>
            </View>
            <View className="bg-white p-4 rounded-lg shadow-sm flex-1 min-w-[150px]">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-green-500">24</Text>
                  <Text className="text-gray-600 text-sm">Tasks Done</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
            </View>
          </View>
        </View>

        {/* Productivity Chart */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Productivity Trend</Text>
          <View className="h-32 flex-row items-end justify-between px-2">
            {[65, 78, 82, 75, 90, 85, 88].map((value, index) => (
              <View key={index} className="items-center">
                <View 
                  className="bg-blue-500 rounded-t w-6"
                  style={{ height: `${value}%` }}
                />
                <Text className="text-xs text-gray-600 mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category Breakdown */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Time by Category</Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-blue-500 rounded-full mr-3"></View>
                <Text className="text-gray-800">Work</Text>
              </View>
              <Text className="font-semibold text-gray-800">45%</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-3"></View>
                <Text className="text-gray-800">Study</Text>
              </View>
              <Text className="font-semibold text-gray-800">30%</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-orange-500 rounded-full mr-3"></View>
                <Text className="text-gray-800">Exercise</Text>
              </View>
              <Text className="font-semibold text-gray-800">15%</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-purple-500 rounded-full mr-3"></View>
                <Text className="text-gray-800">Personal</Text>
              </View>
              <Text className="font-semibold text-gray-800">10%</Text>
            </View>
          </View>
        </View>

        {/* Goals Progress */}
        <View className="bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Weekly Goals</Text>
          <View className="space-y-4">
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-800">Complete 25 tasks</Text>
                <Text className="text-gray-600">24/25</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }} />
              </View>
            </View>
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-800">Work 35 hours</Text>
                <Text className="text-gray-600">32.5/35</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View className="bg-blue-500 h-2 rounded-full" style={{ width: '93%' }} />
              </View>
            </View>
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-800">Exercise 5 times</Text>
                <Text className="text-gray-600">3/5</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 