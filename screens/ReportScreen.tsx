import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PunchRecord } from '../types/punch';
import { fetchEntriesForRange } from '../utils/database';
import DateRangePicker from '../components/DateRangePicker';
import { generatePDFReport } from '../utils/pdfGenerator';
import { shareReport, shareReportAsEmail } from '../utils/shareUtils';

interface ReportSummary {
  totalHours: number;
  totalDays: number;
  averageHoursPerDay: number;
  totalRecords: number;
}

export default function ReportScreen() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 13); // 2 weeks ago
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [punchRecords, setPunchRecords] = useState<PunchRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PunchRecord[]>([]);
  const [summary, setSummary] = useState<ReportSummary>({
    totalHours: 0,
    totalDays: 0,
    averageHoursPerDay: 0,
    totalRecords: 0,
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load punch data on component mount
  useEffect(() => {
    loadPunchData();
  }, []);

  // Filter records when date range or punch records change
  useEffect(() => {
    filterRecords();
  }, [startDate, endDate, punchRecords]);

  // Calculate summary when filtered records change
  useEffect(() => {
    calculateSummary();
  }, [filteredRecords]);

  const loadPunchData = async () => {
    try {
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      const data = await fetchEntriesForRange(startDateStr, endDateStr);
      setPunchRecords(data);
    } catch (error) {
      console.error('Error loading punch data:', error);
      Alert.alert('Error', 'Failed to load punch data');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPunchData();
    setRefreshing(false);
  }, []);

  const filterRecords = () => {
    // Since we're now fetching directly from database for the range,
    // we can just use the punchRecords directly
    const filtered = [...punchRecords];
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredRecords(filtered);
  };

  const calculateSummary = () => {
    const totalHours = filteredRecords.reduce((sum, record) => sum + (record.totalHours || 0), 0);
    const uniqueDates = new Set(filteredRecords.map(record => record.date));
    const totalDays = uniqueDates.size;
    const averageHoursPerDay = totalDays > 0 ? totalHours / totalDays : 0;

    setSummary({
      totalHours,
      totalDays,
      averageHoursPerDay,
      totalRecords: filteredRecords.length,
    });
  };

  const handleGeneratePDF = async () => {
    if (filteredRecords.length === 0) {
      Alert.alert('No Data', 'No punch records found for the selected date range');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const reportData = {
        startDate,
        endDate,
        records: filteredRecords,
        totalHours: summary.totalHours,
        totalDays: summary.totalDays,
      };

      const filePath = await generatePDFReport(reportData);
      
      Alert.alert(
        'PDF Generated',
        'Report has been generated successfully!',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Share', 
            onPress: () => handleShareReport(filePath)
          },
        ]
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF report');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareReport = async (filePath: string) => {
    const reportTitle = `Time Report ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    
    Alert.alert(
      'Share Report',
      'Choose how you would like to share the report',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: () => shareReport(filePath, reportTitle)
        },
        { 
          text: 'Email', 
          onPress: () => shareReportAsEmail(filePath, reportTitle)
        },
      ]
    );
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (hours?: number) => {
    if (!hours) return '--';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const groupRecordsByDate = () => {
    const grouped: { [key: string]: PunchRecord[] } = {};
    
    filteredRecords.forEach(record => {
      if (!grouped[record.date]) {
        grouped[record.date] = [];
      }
      grouped[record.date].push(record);
    });

    return Object.entries(grouped).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Reports</Text>
        <Text className="text-gray-600 mt-1">Generate and export your time tracking data</Text>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 space-y-4">
          {/* Date Range Picker */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          {/* Summary Cards */}
          <View className="bg-white rounded-lg shadow-sm p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Summary</Text>
            <View className="grid grid-cols-2 gap-4">
              <View className="bg-blue-50 p-4 rounded-lg">
                <Text className="text-2xl font-bold text-blue-600">{summary.totalDays}</Text>
                <Text className="text-sm text-blue-800">Days</Text>
              </View>
              <View className="bg-green-50 p-4 rounded-lg">
                <Text className="text-2xl font-bold text-green-600">{summary.totalRecords}</Text>
                <Text className="text-sm text-green-800">Records</Text>
              </View>
              <View className="bg-purple-50 p-4 rounded-lg">
                <Text className="text-2xl font-bold text-purple-600">{formatDuration(summary.totalHours)}</Text>
                <Text className="text-sm text-purple-800">Total Hours</Text>
              </View>
              <View className="bg-orange-50 p-4 rounded-lg">
                <Text className="text-2xl font-bold text-orange-600">{formatDuration(summary.averageHoursPerDay)}</Text>
                <Text className="text-sm text-orange-800">Avg/Day</Text>
              </View>
            </View>
          </View>

          {/* Export Button */}
          <TouchableOpacity
            onPress={handleGeneratePDF}
            disabled={isGeneratingPDF || filteredRecords.length === 0}
            className={`flex-row items-center justify-center p-4 rounded-lg ${
              isGeneratingPDF || filteredRecords.length === 0 
                ? 'bg-gray-300' 
                : 'bg-blue-500'
            }`}
          >
            {isGeneratingPDF ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons name="document-text" size={24} color="white" />
            )}
            <Text className="text-white font-semibold text-lg ml-2">
              {isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF Report'}
            </Text>
          </TouchableOpacity>

          {/* Punch Records List */}
          <View className="bg-white rounded-lg shadow-sm overflow-hidden">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-800">Punch Records</Text>
              <Text className="text-sm text-gray-600 mt-1">
                {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} found
              </Text>
            </View>

            {filteredRecords.length === 0 ? (
              <View className="p-8 items-center">
                <Ionicons name="document-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-500 text-lg mt-4 text-center">
                  No punch records found
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  Try adjusting the date range or add some punch records
                </Text>
              </View>
            ) : (
              <ScrollView className="max-h-96">
                {groupRecordsByDate().map(([date, records]) => (
                  <View key={date} className="border-b border-gray-100 last:border-b-0">
                    <View className="bg-gray-50 px-4 py-2">
                      <Text className="font-semibold text-gray-800">{formatDate(date)}</Text>
                    </View>
                    {records.map((record, index) => (
                      <View key={record.id} className="px-4 py-3">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1">
                            <View className="flex-row items-center space-x-4">
                              <Text className="text-gray-600 min-w-[60px]">
                                {formatTime(record.punchIn)}
                              </Text>
                              <Ionicons name="arrow-forward" size={16} color="#9ca3af" />
                              <Text className="text-gray-600 min-w-[60px]">
                                {formatTime(record.punchOut)}
                              </Text>
                            </View>
                            {record.notes && (
                              <Text className="text-sm text-gray-500 mt-1">{record.notes}</Text>
                            )}
                          </View>
                          <Text className="font-semibold text-green-600">
                            {formatDuration(record.totalHours)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Quick Actions */}
          <View className="bg-white rounded-lg shadow-sm p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</Text>
            <View className="space-y-3">
              <TouchableOpacity 
                onPress={() => {
                  const today = new Date();
                  const twoWeeksAgo = new Date();
                  twoWeeksAgo.setDate(today.getDate() - 14);
                  setStartDate(twoWeeksAgo);
                  setEndDate(today);
                }}
                className="flex-row items-center p-3 bg-blue-50 rounded-lg"
              >
                <Ionicons name="calendar" size={20} color="#3b82f6" />
                <Text className="text-blue-700 font-medium ml-3">Last 2 Weeks</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => {
                  const today = new Date();
                  const lastMonth = new Date();
                  lastMonth.setMonth(today.getMonth() - 1);
                  setStartDate(lastMonth);
                  setEndDate(today);
                }}
                className="flex-row items-center p-3 bg-green-50 rounded-lg"
              >
                <Ionicons name="calendar-outline" size={20} color="#10b981" />
                <Text className="text-green-700 font-medium ml-3">Last Month</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => {
                  const today = new Date();
                  setStartDate(today);
                  setEndDate(today);
                }}
                className="flex-row items-center p-3 bg-purple-50 rounded-lg"
              >
                <Ionicons name="today" size={20} color="#8b5cf6" />
                <Text className="text-purple-700 font-medium ml-3">Today Only</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 