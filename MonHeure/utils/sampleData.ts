import { addPunchEntry } from './database';
import { PunchRecord } from '../types/punch';

/**
 * Generate sample punch data for the last 30 days
 */
export const generateSampleData = async (): Promise<void> => {
  try {
    const today = new Date();
    const sampleEntries: Omit<PunchRecord, 'id'>[] = [];

    // Generate data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        // Generate 1-2 punch entries per day
        const numEntries = Math.random() > 0.7 ? 2 : 1;
        
        for (let j = 0; j < numEntries; j++) {
          // Random work hours between 6-10 hours
          const workHours = 6 + Math.random() * 4;
          
          // Random start time between 7 AM and 10 AM
          const startHour = 7 + Math.floor(Math.random() * 3);
          const startMinute = Math.floor(Math.random() * 60);
          
          const punchIn = new Date(date);
          punchIn.setHours(startHour, startMinute, 0, 0);
          
          const punchOut = new Date(punchIn);
          punchOut.setHours(punchIn.getHours() + Math.floor(workHours), 
                           punchIn.getMinutes() + Math.floor((workHours % 1) * 60), 
                           0, 0);
          
          sampleEntries.push({
            date: dateString,
            punchIn: punchIn.toISOString(),
            punchOut: punchOut.toISOString(),
            notes: j === 0 ? 'Morning shift' : 'Afternoon shift'
          });
        }
      }
    }

    // Add entries to database
    for (const entry of sampleEntries) {
      await addPunchEntry(entry);
    }

    console.log(`Generated ${sampleEntries.length} sample punch entries`);
  } catch (error) {
    console.error('Error generating sample data:', error);
    throw error;
  }
};

/**
 * Generate sample data for a specific date range
 */
export const generateSampleDataForRange = async (
  startDate: string, 
  endDate: string
): Promise<void> => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const sampleEntries: Omit<PunchRecord, 'id'>[] = [];

    // Generate data for each day in the range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      
      // Skip weekends
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        // Random work hours between 6-10 hours
        const workHours = 6 + Math.random() * 4;
        
        // Random start time between 7 AM and 10 AM
        const startHour = 7 + Math.floor(Math.random() * 3);
        const startMinute = Math.floor(Math.random() * 60);
        
        const punchIn = new Date(d);
        punchIn.setHours(startHour, startMinute, 0, 0);
        
        const punchOut = new Date(punchIn);
        punchOut.setHours(punchIn.getHours() + Math.floor(workHours), 
                         punchIn.getMinutes() + Math.floor((workHours % 1) * 60), 
                         0, 0);
        
        sampleEntries.push({
          date: dateString,
          punchIn: punchIn.toISOString(),
          punchOut: punchOut.toISOString(),
          notes: 'Sample entry'
        });
      }
    }

    // Add entries to database
    for (const entry of sampleEntries) {
      await addPunchEntry(entry);
    }

    console.log(`Generated ${sampleEntries.length} sample punch entries for range ${startDate} to ${endDate}`);
  } catch (error) {
    console.error('Error generating sample data for range:', error);
    throw error;
  }
};

/**
 * Generate sample data for today
 */
export const generateSampleDataForToday = async (): Promise<void> => {
  try {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Random work hours between 6-10 hours
    const workHours = 6 + Math.random() * 4;
    
    // Random start time between 7 AM and 10 AM
    const startHour = 7 + Math.floor(Math.random() * 3);
    const startMinute = Math.floor(Math.random() * 60);
    
    const punchIn = new Date(today);
    punchIn.setHours(startHour, startMinute, 0, 0);
    
    const punchOut = new Date(punchIn);
    punchOut.setHours(punchIn.getHours() + Math.floor(workHours), 
                     punchIn.getMinutes() + Math.floor((workHours % 1) * 60), 
                     0, 0);
    
    await addPunchEntry({
      date: dateString,
      punchIn: punchIn.toISOString(),
      punchOut: punchOut.toISOString(),
      notes: 'Today\'s sample entry'
    });

    console.log('Generated sample data for today');
  } catch (error) {
    console.error('Error generating sample data for today:', error);
    throw error;
  }
}; 