import AsyncStorage from '@react-native-async-storage/async-storage';
import { PunchRecord } from '../types/punch';

// Storage key
const STORAGE_KEY = 'monheure_punch_records';

// Database instance (simulated)
let db: any = null;

/**
 * Initialize the database and create tables if they don't exist
 */
export const initDatabase = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Initialize AsyncStorage-based database
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      if (!existingData) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }
      db = true; // Mark as initialized
      console.log('Database initialized successfully');
      resolve();
    } catch (error) {
      console.error('Database initialization error:', error);
      reject(error);
    }
  });
};

/**
 * Get database instance
 */
export const getDatabase = (): any => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

/**
 * Add a new punch entry
 */
export const addPunchEntry = async (entry: Omit<PunchRecord, 'id'>): Promise<number> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const records: PunchRecord[] = existingData ? JSON.parse(existingData) : [];
    
    const newId = Date.now().toString();
    const newRecord: PunchRecord = {
      id: newId,
      ...entry,
      totalHours: entry.punchIn && entry.punchOut 
        ? calculateHours(entry.punchIn, entry.punchOut)
        : undefined
    };
    
    records.push(newRecord);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    
    console.log('Punch entry added successfully, ID:', newId);
    return parseInt(newId);
  } catch (error) {
    console.error('Error adding punch entry:', error);
    throw error;
  }
};

/**
 * Update an existing punch entry
 */
export const updatePunchEntry = async (id: number, updates: Partial<PunchRecord>): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const records: PunchRecord[] = existingData ? JSON.parse(existingData) : [];
    
    const index = records.findIndex(record => record.id === id.toString());
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      if (updates.punchIn && updates.punchOut) {
        records[index].totalHours = calculateHours(updates.punchIn, updates.punchOut);
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      console.log('Punch entry updated successfully');
    }
  } catch (error) {
    console.error('Error updating punch entry:', error);
    throw error;
  }
};

/**
 * Fetch punch entries for a specific day
 */
export const fetchEntriesForDay = async (date: string): Promise<PunchRecord[]> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const records: PunchRecord[] = existingData ? JSON.parse(existingData) : [];
    
    const dayRecords = records.filter(record => record.date === date);
    console.log(`Fetched ${dayRecords.length} entries for ${date}`);
    return dayRecords;
  } catch (error) {
    console.error('Error fetching entries for day:', error);
    throw error;
  }
};

/**
 * Fetch punch entries for a date range
 */
export const fetchEntriesForRange = async (startDate: string, endDate: string): Promise<PunchRecord[]> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const records: PunchRecord[] = existingData ? JSON.parse(existingData) : [];
    
    const rangeRecords = records.filter(record => 
      record.date >= startDate && record.date <= endDate
    );
    console.log(`Fetched ${rangeRecords.length} entries for range ${startDate} to ${endDate}`);
    return rangeRecords;
  } catch (error) {
    console.error('Error fetching entries for range:', error);
    throw error;
  }
};

/**
 * Fetch all punch entries
 */
export const fetchAllEntries = async (): Promise<PunchRecord[]> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const records: PunchRecord[] = existingData ? JSON.parse(existingData) : [];
    
    console.log(`Fetched ${records.length} total entries`);
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching all entries:', error);
    throw error;
  }
};

/**
 * Delete a punch entry
 */
export const deletePunchEntry = async (id: number): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const records: PunchRecord[] = existingData ? JSON.parse(existingData) : [];
    
    const filteredRecords = records.filter(record => record.id !== id.toString());
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
    console.log('Punch entry deleted successfully');
  } catch (error) {
    console.error('Error deleting punch entry:', error);
    throw error;
  }
};

/**
 * Get a single punch entry by ID
 */
export const getPunchEntry = async (id: number): Promise<PunchRecord | null> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const records: PunchRecord[] = existingData ? JSON.parse(existingData) : [];
    
    const record = records.find(record => record.id === id.toString());
    return record || null;
  } catch (error) {
    console.error('Error getting punch entry:', error);
    throw error;
  }
};

/**
 * Calculate hours between two timestamps
 */
const calculateHours = (punchIn: string, punchOut: string): number => {
  const start = new Date(punchIn);
  const end = new Date(punchOut);
  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
};

/**
 * Clear all data from the database
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async (): Promise<{ totalEntries: number; totalHours: number }> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const records: PunchRecord[] = existingData ? JSON.parse(existingData) : [];
    
    const totalEntries = records.length;
    const totalHours = records.reduce((sum, record) => {
      return sum + (record.totalHours || 0);
    }, 0);
    
    return { totalEntries, totalHours };
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
}; 