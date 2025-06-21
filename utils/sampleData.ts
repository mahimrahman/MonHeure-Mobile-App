import { PunchRecord } from '../types/punch';

export const generateSampleData = (): PunchRecord[] => {
  const today = new Date();
  const sampleData: PunchRecord[] = [];

  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Skip weekends (Saturday = 6, Sunday = 0)
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    // Generate 1-2 punch records per day
    const numRecords = Math.random() > 0.5 ? 1 : 2;
    
    for (let j = 0; j < numRecords; j++) {
      const punchInHour = 8 + Math.floor(Math.random() * 2); // 8-9 AM
      const punchInMinute = Math.floor(Math.random() * 60);
      const punchOutHour = 16 + Math.floor(Math.random() * 3); // 4-6 PM
      const punchOutMinute = Math.floor(Math.random() * 60);

      const punchInDate = new Date(dateStr);
      punchInDate.setHours(punchInHour, punchInMinute, 0, 0);

      const punchOutDate = new Date(dateStr);
      punchOutDate.setHours(punchOutHour, punchOutMinute, 0, 0);

      const totalHours = (punchOutDate.getTime() - punchInDate.getTime()) / (1000 * 60 * 60);

      const record: PunchRecord = {
        id: `${dateStr}-${j + 1}`,
        date: dateStr,
        punchIn: punchInDate.toISOString(),
        punchOut: punchOutDate.toISOString(),
        totalHours,
        notes: j === 0 ? 'Morning shift' : 'Afternoon shift',
      };

      sampleData.push(record);
    }
  }

  return sampleData;
};

export const addSampleDataToStorage = async () => {
  try {
    const { storage } = await import('./storage');
    const sampleData = generateSampleData();
    
    for (const record of sampleData) {
      await storage.addPunchRecord(record);
    }
    
    console.log('Sample data added successfully');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}; 