import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Settings</Text>
          <Text className="text-gray-600 mt-1">Customize your experience</Text>
        </View>

        {/* Profile Section */}
        <View className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800">Profile</Text>
          </View>
          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold text-lg">JD</Text>
              </View>
              <View>
                <Text className="font-medium text-gray-800">John Doe</Text>
                <Text className="text-sm text-gray-600">john.doe@example.com</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800">App Settings</Text>
          </View>
          
          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="notifications" size={20} color="#3b82f6" />
              <Text className="ml-3 text-gray-800">Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="color-palette" size={20} color="#10b981" />
              <Text className="ml-3 text-gray-800">Theme</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-2">Light</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          <View className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="language" size={20} color="#f59e0b" />
              <Text className="ml-3 text-gray-800">Language</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-2">English</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </View>

          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="time" size={20} color="#8b5cf6" />
              <Text className="ml-3 text-gray-800">Auto-start Timer</Text>
            </View>
            <Switch value={true} />
          </View>
        </View>

        {/* Time Tracking Settings */}
        <View className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800">Time Tracking</Text>
          </View>
          
          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="timer" size={20} color="#3b82f6" />
              <Text className="ml-3 text-gray-800">Default Timer Duration</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-2">25 minutes</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="pause" size={20} color="#10b981" />
              <Text className="ml-3 text-gray-800">Break Duration</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-2">5 minutes</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="volume-high" size={20} color="#f59e0b" />
              <Text className="ml-3 text-gray-800">Sound Alerts</Text>
            </View>
            <Switch value={true} />
          </View>
        </View>

        {/* Data & Privacy */}
        <View className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800">Data & Privacy</Text>
          </View>
          
          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="cloud-upload" size={20} color="#3b82f6" />
              <Text className="ml-3 text-gray-800">Backup Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="download" size={20} color="#10b981" />
              <Text className="ml-3 text-gray-800">Export Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="trash" size={20} color="#ef4444" />
              <Text className="ml-3 text-gray-800">Clear All Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Support & About */}
        <View className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800">Support & About</Text>
          </View>
          
          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="help-circle" size={20} color="#3b82f6" />
              <Text className="ml-3 text-gray-800">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="star" size={20} color="#f59e0b" />
              <Text className="ml-3 text-gray-800">Rate App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="information-circle" size={20} color="#10b981" />
              <Text className="ml-3 text-gray-800">About MonHeure</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-2">v1.0.0</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity className="bg-red-500 p-4 rounded-lg items-center">
          <Text className="text-white font-medium">Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 