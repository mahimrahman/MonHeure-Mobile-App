import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReportScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Reports</Text>
          <Text className="text-gray-600 mt-1">Generate and export your data</Text>
        </View>

        {/* Report Types */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Report Types</Text>
          <View className="space-y-3">
            <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="calendar" size={24} color="#3b82f6" />
                  <View className="ml-3">
                    <Text className="font-semibold text-gray-800">Daily Report</Text>
                    <Text className="text-sm text-gray-600">Today's activities and time tracking</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={24} color="#10b981" />
                  <View className="ml-3">
                    <Text className="font-semibold text-gray-800">Weekly Report</Text>
                    <Text className="text-sm text-gray-600">This week's summary and trends</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="bar-chart" size={24} color="#f59e0b" />
                  <View className="ml-3">
                    <Text className="font-semibold text-gray-800">Monthly Report</Text>
                    <Text className="text-sm text-gray-600">Comprehensive monthly analysis</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="pie-chart" size={24} color="#8b5cf6" />
                  <View className="ml-3">
                    <Text className="font-semibold text-gray-800">Category Report</Text>
                    <Text className="text-sm text-gray-600">Time breakdown by categories</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Export Options */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Export Options</Text>
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-1 min-w-[150px] items-center">
              <Ionicons name="document-text" size={24} color="white" />
              <Text className="text-white font-medium mt-2">PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-500 p-4 rounded-lg flex-1 min-w-[150px] items-center">
              <Ionicons name="tablet-portrait" size={24} color="white" />
              <Text className="text-white font-medium mt-2">Excel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-orange-500 p-4 rounded-lg flex-1 min-w-[150px] items-center">
              <Ionicons name="share" size={24} color="white" />
              <Text className="text-white font-medium mt-2">Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Reports */}
        <View className="bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Recent Reports</Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
              <View className="flex-row items-center">
                <Ionicons name="document-text" size={20} color="#3b82f6" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800">Weekly Report - June 15-21</Text>
                  <Text className="text-sm text-gray-600">Generated 2 hours ago</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="download" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
              <View className="flex-row items-center">
                <Ionicons name="document-text" size={20} color="#10b981" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800">Daily Report - June 21</Text>
                  <Text className="text-sm text-gray-600">Generated 1 day ago</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="download" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
              <View className="flex-row items-center">
                <Ionicons name="document-text" size={20} color="#f59e0b" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800">Monthly Report - May 2024</Text>
                  <Text className="text-sm text-gray-600">Generated 1 week ago</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="download" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 