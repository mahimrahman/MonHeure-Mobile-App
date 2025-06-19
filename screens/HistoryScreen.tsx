import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const historyData = [
    {
      id: 1,
      date: 'Today',
      activities: [
        { time: '09:00 - 11:15', task: 'Project Planning', category: 'Work', duration: '2h 15m' },
        { time: '11:30 - 12:00', task: 'Team Meeting', category: 'Work', duration: '30m' },
        { time: '14:00 - 15:45', task: 'Code Review', category: 'Work', duration: '1h 45m' },
        { time: '16:00 - 17:00', task: 'Gym Workout', category: 'Exercise', duration: '1h' },
      ]
    },
    {
      id: 2,
      date: 'Yesterday',
      activities: [
        { time: '08:30 - 10:00', task: 'Morning Study', category: 'Study', duration: '1h 30m' },
        { time: '10:30 - 12:00', task: 'Client Meeting', category: 'Work', duration: '1h 30m' },
        { time: '14:00 - 16:00', task: 'Development Work', category: 'Work', duration: '2h' },
        { time: '16:30 - 17:30', task: 'Reading', category: 'Personal', duration: '1h' },
      ]
    },
    {
      id: 3,
      date: 'June 19, 2024',
      activities: [
        { time: '09:00 - 11:00', task: 'Design Review', category: 'Work', duration: '2h' },
        { time: '11:30 - 12:30', task: 'Lunch Break', category: 'Personal', duration: '1h' },
        { time: '13:00 - 15:00', task: 'Bug Fixing', category: 'Work', duration: '2h' },
        { time: '15:30 - 16:30', task: 'Online Course', category: 'Study', duration: '1h' },
      ]
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Work': return '#3b82f6';
      case 'Study': return '#10b981';
      case 'Exercise': return '#f59e0b';
      case 'Personal': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">History</Text>
          <Text className="text-gray-600 mt-1">Your time tracking history</Text>
        </View>

        {/* Filter Options */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Filter</Text>
          <View className="flex-row flex-wrap gap-2">
            <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
              <Text className="text-white font-medium">All</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
              <Text className="text-gray-700 font-medium">Work</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
              <Text className="text-gray-700 font-medium">Study</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
              <Text className="text-gray-700 font-medium">Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
              <Text className="text-gray-700 font-medium">Personal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* History Timeline */}
        <View className="space-y-6">
          {historyData.map((day) => (
            <View key={day.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <View className="bg-gray-100 px-4 py-3">
                <Text className="font-semibold text-gray-800">{day.date}</Text>
              </View>
              <View className="p-4">
                {day.activities.map((activity, index) => (
                  <View key={index} className="mb-4 last:mb-0">
                    <View className="flex-row items-start">
                      <View 
                        className="w-3 h-3 rounded-full mt-2 mr-3"
                        style={{ backgroundColor: getCategoryColor(activity.category) }}
                      />
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="font-medium text-gray-800">{activity.task}</Text>
                          <Text className="text-sm text-gray-600">{activity.duration}</Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                          <Text className="text-sm text-gray-600">{activity.time}</Text>
                          <View className="flex-row items-center">
                            <View 
                              className="w-2 h-2 rounded-full mr-1"
                              style={{ backgroundColor: getCategoryColor(activity.category) }}
                            />
                            <Text className="text-sm text-gray-600">{activity.category}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    {index < day.activities.length - 1 && (
                      <View className="ml-6 mt-2 w-px h-4 bg-gray-200" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Load More Button */}
        <View className="mt-6">
          <TouchableOpacity className="bg-gray-200 p-4 rounded-lg items-center">
            <Text className="text-gray-700 font-medium">Load More History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
} 