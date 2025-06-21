import AsyncStorage from '@react-native-async-storage/async-storage';
import { PunchRecord } from '../types/punch';

const PUNCH_DATA_KEY = 'punch_data';

export const storage = {
  // Save punch data
  async savePunchData(punchData: PunchRecord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PUNCH_DATA_KEY, JSON.stringify(punchData));
    } catch (error) {
      console.error('Error saving punch data:', error);
    }
  },

  // Load punch data
  async loadPunchData(): Promise<PunchRecord[]> {
    try {
      const data = await AsyncStorage.getItem(PUNCH_DATA_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading punch data:', error);
      return [];
    }
  },

  // Add a new punch record
  async addPunchRecord(record: PunchRecord): Promise<void> {
    try {
      const existingData = await this.loadPunchData();
      const updatedData = [...existingData, record];
      await this.savePunchData(updatedData);
    } catch (error) {
      console.error('Error adding punch record:', error);
    }
  },

  // Update a punch record
  async updatePunchRecord(recordId: string, updatedRecord: Partial<PunchRecord>): Promise<void> {
    try {
      const existingData = await this.loadPunchData();
      const updatedData = existingData.map(record => 
        record.id === recordId ? { ...record, ...updatedRecord } : record
      );
      await this.savePunchData(updatedData);
    } catch (error) {
      console.error('Error updating punch record:', error);
    }
  },

  // Delete a punch record
  async deletePunchRecord(recordId: string): Promise<void> {
    try {
      const existingData = await this.loadPunchData();
      const updatedData = existingData.filter(record => record.id !== recordId);
      await this.savePunchData(updatedData);
    } catch (error) {
      console.error('Error deleting punch record:', error);
    }
  },

  // Get punch records for a specific date
  async getPunchRecordsForDate(date: string): Promise<PunchRecord[]> {
    try {
      const allData = await this.loadPunchData();
      return allData.filter(record => record.date === date);
    } catch (error) {
      console.error('Error getting punch records for date:', error);
      return [];
    }
  },

  // Get all punch records
  async getAllPunchRecords(): Promise<PunchRecord[]> {
    return await this.loadPunchData();
  }
}; 