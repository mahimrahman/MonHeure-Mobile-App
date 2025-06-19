import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Welcome to MonHeure</Text>
          <Text className="text-gray-600 mt-1">Your time management companion</Text>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-1 min-w-[150px] items-center">
              <Ionicons name="play" size={24} color="white" />
              <Text className="text-white font-medium mt-2">Start Timer</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-500 p-4 rounded-lg flex-1 min-w-[150px] items-center">
              <Ionicons name="add" size={24} color="white" />
              <Text className="text-white font-medium mt-2">New Task</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Summary */}
        <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Today's Summary</Text>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-bold text-blue-500">6h 23m</Text>
              <Text className="text-gray-600">Total Time</Text>
            </View>
            <View>
              <Text className="text-3xl font-bold text-green-500">8</Text>
              <Text className="text-gray-600">Tasks Done</Text>
            </View>
            <View>
              <Text className="text-3xl font-bold text-orange-500">85%</Text>
              <Text className="text-gray-600">Efficiency</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-blue-500 rounded-full mr-3"></View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Project Planning</Text>
                <Text className="text-sm text-gray-600">2h 15m • 2 hours ago</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-3"></View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Code Review</Text>
                <Text className="text-sm text-gray-600">1h 45m • 4 hours ago</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-orange-500 rounded-full mr-3"></View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Team Meeting</Text>
                <Text className="text-sm text-gray-600">45m • 6 hours ago</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 