import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase, addPunchEntry, updatePunchEntry, fetchEntriesForDay } from './database';
import { PunchRecord } from '../types/punch';

interface PunchState {
  // Current punch state
  isPunchedIn: boolean;
  currentPunchInTime: string | null;
  currentPunchOutTime: string | null;
  currentPunchId: number | null;
  
  // Today's data
  todayDate: string;
  todayEntries: PunchRecord[];
  totalHoursToday: number;
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  initializeStore: () => Promise<void>;
  punchIn: (notes?: string) => Promise<void>;
  punchOut: (notes?: string) => Promise<void>;
  refreshTodayData: () => Promise<void>;
  updateCurrentPunch: (updates: Partial<PunchRecord>) => Promise<void>;
  resetState: () => void;
}

export const usePunchStore = create<PunchState>()(
  persist(
    (set, get) => ({
      // Initial state
      isPunchedIn: false,
      currentPunchInTime: null,
      currentPunchOutTime: null,
      currentPunchId: null,
      todayDate: new Date().toISOString().split('T')[0],
      todayEntries: [],
      totalHoursToday: 0,
      isLoading: false,
      isInitialized: false,

      // Initialize store and sync with database
      initializeStore: async () => {
        set({ isLoading: true });
        try {
          // Initialize database
          await initDatabase();
          
          // Get today's date
          const today = new Date().toISOString().split('T')[0];
          
          // Fetch today's entries from database
          const todayEntries = await fetchEntriesForDay(today);
          
          // Find current active punch (punch in without punch out)
          const activePunch = todayEntries.find(entry => 
            entry.punchIn && !entry.punchOut
          );
          
          // Calculate total hours for today
          const totalHoursToday = todayEntries.reduce((sum, entry) => {
            return sum + (entry.totalHours || 0);
          }, 0);
          
          set({
            todayDate: today,
            todayEntries,
            totalHoursToday,
            isPunchedIn: !!activePunch,
            currentPunchInTime: activePunch?.punchIn || null,
            currentPunchOutTime: activePunch?.punchOut || null,
            currentPunchId: activePunch ? parseInt(activePunch.id) : null,
            isInitialized: true,
            isLoading: false,
          });
          
          console.log('Punch store initialized successfully');
        } catch (error) {
          console.error('Error initializing punch store:', error);
          set({ isLoading: false, isInitialized: true });
        }
      },

      // Punch in action
      punchIn: async (notes?: string) => {
        const { todayDate } = get();
        set({ isLoading: true });
        
        try {
          const punchInTime = new Date().toISOString();
          
          // Add new punch entry to database
          const punchId = await addPunchEntry({
            date: todayDate,
            punchIn: punchInTime,
            punchOut: null,
            notes: notes || '',
          });
          
          // Update store state
          set({
            isPunchedIn: true,
            currentPunchInTime: punchInTime,
            currentPunchOutTime: null,
            currentPunchId: punchId,
            isLoading: false,
          });
          
          // Refresh today's data
          await get().refreshTodayData();
          
          console.log('Punched in successfully');
        } catch (error) {
          console.error('Error punching in:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Punch out action
      punchOut: async (notes?: string) => {
        const { currentPunchId, currentPunchInTime } = get();
        set({ isLoading: true });
        
        try {
          if (!currentPunchId || !currentPunchInTime) {
            throw new Error('No active punch found');
          }
          
          const punchOutTime = new Date().toISOString();
          
          // Update existing punch entry in database
          await updatePunchEntry(currentPunchId, {
            punchOut: punchOutTime,
            notes: notes || '',
          });
          
          // Update store state
          set({
            isPunchedIn: false,
            currentPunchInTime: null,
            currentPunchOutTime: null,
            currentPunchId: null,
            isLoading: false,
          });
          
          // Refresh today's data
          await get().refreshTodayData();
          
          console.log('Punched out successfully');
        } catch (error) {
          console.error('Error punching out:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Refresh today's data from database
      refreshTodayData: async () => {
        const { todayDate } = get();
        
        try {
          const todayEntries = await fetchEntriesForDay(todayDate);
          
          // Calculate total hours for today
          const totalHoursToday = todayEntries.reduce((sum, entry) => {
            return sum + (entry.totalHours || 0);
          }, 0);
          
          set({
            todayEntries,
            totalHoursToday,
          });
          
          console.log('Today\'s data refreshed');
        } catch (error) {
          console.error('Error refreshing today\'s data:', error);
        }
      },

      // Update current punch entry
      updateCurrentPunch: async (updates: Partial<PunchRecord>) => {
        const { currentPunchId } = get();
        
        if (!currentPunchId) {
          throw new Error('No active punch to update');
        }
        
        try {
          await updatePunchEntry(currentPunchId, updates);
          
          // Refresh today's data
          await get().refreshTodayData();
          
          console.log('Current punch updated successfully');
        } catch (error) {
          console.error('Error updating current punch:', error);
          throw error;
        }
      },

      // Reset state (useful for testing or logout)
      resetState: () => {
        set({
          isPunchedIn: false,
          currentPunchInTime: null,
          currentPunchOutTime: null,
          currentPunchId: null,
          todayEntries: [],
          totalHoursToday: 0,
          isLoading: false,
        });
      },
    }),
    {
      name: 'punch-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain fields, not the entire state
      partialize: (state) => ({
        isPunchedIn: state.isPunchedIn,
        currentPunchInTime: state.currentPunchInTime,
        currentPunchOutTime: state.currentPunchOutTime,
        currentPunchId: state.currentPunchId,
        todayDate: state.todayDate,
      }),
    }
  )
);

// Helper hooks for common state access
export const usePunchStatus = () => {
  const { isPunchedIn, currentPunchInTime, isLoading } = usePunchStore();
  return { isPunchedIn, currentPunchInTime, isLoading };
};

export const useTodayData = () => {
  const { todayEntries, totalHoursToday, todayDate } = usePunchStore();
  return { todayEntries, totalHoursToday, todayDate };
};

export const usePunchActions = () => {
  const { punchIn, punchOut, refreshTodayData, updateCurrentPunch } = usePunchStore();
  return { punchIn, punchOut, refreshTodayData, updateCurrentPunch };
}; 