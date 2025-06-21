import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PunchRecord } from '../types/punch';

interface EditPunchModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (record: PunchRecord) => void;
  onDelete: (recordId: string) => void;
  record?: PunchRecord;
}

export default function EditPunchModal({
  visible,
  onClose,
  onSave,
  onDelete,
  record,
}: EditPunchModalProps) {
  const [punchIn, setPunchIn] = useState('');
  const [punchOut, setPunchOut] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (record) {
      setPunchIn(record.punchIn ? new Date(record.punchIn).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : '');
      setPunchOut(record.punchOut ? new Date(record.punchOut).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : '');
      setNotes(record.notes || '');
    }
  }, [record]);

  const handleSave = () => {
    if (!record) return;

    const today = new Date();
    const dateStr = record.date;

    let punchInDate: Date | undefined;
    let punchOutDate: Date | undefined;

    if (punchIn) {
      const [hours, minutes] = punchIn.split(':').map(Number);
      punchInDate = new Date(dateStr);
      punchInDate.setHours(hours, minutes, 0, 0);
    }

    if (punchOut) {
      const [hours, minutes] = punchOut.split(':').map(Number);
      punchOutDate = new Date(dateStr);
      punchOutDate.setHours(hours, minutes, 0, 0);
    }

    if (punchInDate && punchOutDate && punchInDate >= punchOutDate) {
      Alert.alert('Invalid Time', 'Punch out time must be after punch in time');
      return;
    }

    const updatedRecord: PunchRecord = {
      ...record,
      punchIn: punchInDate?.toISOString(),
      punchOut: punchOutDate?.toISOString(),
      notes: notes.trim() || undefined,
      totalHours: punchInDate && punchOutDate 
        ? (punchOutDate.getTime() - punchInDate.getTime()) / (1000 * 60 * 60)
        : undefined,
    };

    onSave(updatedRecord);
    onClose();
  };

  const handleDelete = () => {
    if (!record) return;

    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this punch entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            onDelete(record.id);
            onClose();
          }
        },
      ]
    );
  };

  const formatTimeInput = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    
    // Format as HH:MM
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
    }
  };

  const validateTime = (time: string) => {
    if (!time) return true;
    const [hours, minutes] = time.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-xl font-semibold text-gray-800">Edit Punch Entry</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Date Display */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-600 mb-2">Date</Text>
            <Text className="text-lg text-gray-800">
              {record ? new Date(record.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
            </Text>
          </View>

          {/* Punch In Time */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-600 mb-2">Punch In Time</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              placeholder="HH:MM (24-hour format)"
              value={punchIn}
              onChangeText={(text) => setPunchIn(formatTimeInput(text))}
              keyboardType="numeric"
              maxLength={5}
            />
            {punchIn && !validateTime(punchIn) && (
              <Text className="text-red-500 text-sm mt-1">Invalid time format</Text>
            )}
          </View>

          {/* Punch Out Time */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-600 mb-2">Punch Out Time</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              placeholder="HH:MM (24-hour format)"
              value={punchOut}
              onChangeText={(text) => setPunchOut(formatTimeInput(text))}
              keyboardType="numeric"
              maxLength={5}
            />
            {punchOut && !validateTime(punchOut) && (
              <Text className="text-red-500 text-sm mt-1">Invalid time format</Text>
            )}
          </View>

          {/* Notes */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-600 mb-2">Notes (Optional)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
              placeholder="Add notes about this entry..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Total Hours Display */}
          {punchIn && punchOut && validateTime(punchIn) && validateTime(punchOut) && (
            <View className="mb-6 p-4 bg-blue-50 rounded-lg">
              <Text className="text-sm font-medium text-gray-600 mb-1">Total Hours</Text>
              <Text className="text-lg font-semibold text-blue-600">
                {(() => {
                  const [inHours, inMinutes] = punchIn.split(':').map(Number);
                  const [outHours, outMinutes] = punchOut.split(':').map(Number);
                  const totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;
                  return `${hours}h ${minutes}m`;
                })()}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View className="p-4 border-t border-gray-200 space-y-3">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-blue-500 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold text-lg">Save Changes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-500 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold text-lg">Delete Entry</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-200 py-3 rounded-lg items-center"
          >
            <Text className="text-gray-700 font-semibold text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 