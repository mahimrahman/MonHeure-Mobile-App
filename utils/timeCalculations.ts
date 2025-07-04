import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'monheure_today_punch';

export interface TimeStats {
  totalHours: number;
  daysWorked: number;
  averageHoursPerDay: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

// Calculate hours between two timestamps
export const calculateHours = (punchIn: string, punchOut: string): number => {
  const start = new Date(punchIn);
  const end = new Date(punchOut);
  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
};

// Get all punch data for a date range
export const getPunchDataForRange = async (startDate: Date, endDate: Date) => {
  const punchData: { [key: string]: { punchIn?: string; punchOut?: string } } = {};
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().slice(0, 10);
    const data = await AsyncStorage.getItem(`${STORAGE_KEY}_${dateKey}`);
    if (data) {
      punchData[dateKey] = JSON.parse(data);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return punchData;
};

// Calculate total hours for a date range
export const calculateTotalHours = (punchData: { [key: string]: { punchIn?: string; punchOut?: string } }): TimeStats => {
  let totalHours = 0;
  let daysWorked = 0;
  
  Object.values(punchData).forEach(day => {
    if (day.punchIn && day.punchOut) {
      const hours = calculateHours(day.punchIn, day.punchOut);
      totalHours += hours;
      daysWorked++;
    }
  });
  
  return {
    totalHours: Math.round(totalHours * 100) / 100,
    daysWorked,
    averageHoursPerDay: daysWorked > 0 ? Math.round((totalHours / daysWorked) * 100) / 100 : 0
  };
};

// Generate chart data for the last 7 days
export const generateWeeklyChartData = async (): Promise<ChartData> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  
  const punchData = await getPunchDataForRange(startDate, endDate);
  const labels: string[] = [];
  const data: number[] = [];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().slice(0, 10);
    const dayData = punchData[dateKey];
    
    labels.push(currentDate.toLocaleDateString('en-US', { weekday: 'short' }));
    
    if (dayData?.punchIn && dayData?.punchOut) {
      data.push(calculateHours(dayData.punchIn, dayData.punchOut));
    } else {
      data.push(0);
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return {
    labels,
    datasets: [{
      data,
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      strokeWidth: 2
    }]
  };
};

// Generate chart data for the current month
export const generateMonthlyChartData = async (): Promise<ChartData> => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const punchData = await getPunchDataForRange(startDate, endDate);
  const labels: string[] = [];
  const data: number[] = [];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().slice(0, 10);
    const dayData = punchData[dateKey];
    
    labels.push(currentDate.getDate().toString());
    
    if (dayData?.punchIn && dayData?.punchOut) {
      data.push(calculateHours(dayData.punchIn, dayData.punchOut));
    } else {
      data.push(0);
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return {
    labels,
    datasets: [{
      data,
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      strokeWidth: 2
    }]
  };
};

// Generate chart data for the current year (monthly view)
export const generateYearlyChartData = async (): Promise<ChartData> => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), 0, 1);
  const endDate = new Date(now.getFullYear(), 11, 31);
  
  const punchData = await getPunchDataForRange(startDate, endDate);
  const labels: string[] = [];
  const data: number[] = [];
  
  // Group by month
  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(now.getFullYear(), month, 1);
    const monthEnd = new Date(now.getFullYear(), month + 1, 0);
    
    labels.push(monthStart.toLocaleDateString('en-US', { month: 'short' }));
    
    let monthTotal = 0;
    const currentDate = new Date(monthStart);
    while (currentDate <= monthEnd) {
      const dateKey = currentDate.toISOString().slice(0, 10);
      const dayData = punchData[dateKey];
      
      if (dayData?.punchIn && dayData?.punchOut) {
        monthTotal += calculateHours(dayData.punchIn, dayData.punchOut);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    data.push(Math.round(monthTotal * 100) / 100);
  }
  
  return {
    labels,
    datasets: [{
      data,
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      strokeWidth: 2
    }]
  };
};

// Generate chart data based on view type
export const generateChartData = async (viewType: 'week' | 'month' | 'year'): Promise<ChartData> => {
  switch (viewType) {
    case 'week':
      return generateWeeklyChartData();
    case 'month':
      return generateMonthlyChartData();
    case 'year':
      return generateYearlyChartData();
    default:
      return generateWeeklyChartData();
  }
};

// Get time stats for different periods
export const getTimeStats = async (): Promise<{
  thisWeek: TimeStats;
  lastTwoWeeks: TimeStats;
  thisMonth: TimeStats;
  thisYear: TimeStats;
}> => {
  const now = new Date();
  
  // This week (Monday to Sunday)
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay() + 1);
  thisWeekStart.setHours(0, 0, 0, 0);
  
  // Last 2 weeks
  const lastTwoWeeksStart = new Date(now);
  lastTwoWeeksStart.setDate(now.getDate() - 13);
  lastTwoWeeksStart.setHours(0, 0, 0, 0);
  
  // This month
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // This year
  const thisYearStart = new Date(now.getFullYear(), 0, 1);
  
  const [thisWeekData, lastTwoWeeksData, thisMonthData, thisYearData] = await Promise.all([
    getPunchDataForRange(thisWeekStart, now),
    getPunchDataForRange(lastTwoWeeksStart, now),
    getPunchDataForRange(thisMonthStart, now),
    getPunchDataForRange(thisYearStart, now)
  ]);
  
  return {
    thisWeek: calculateTotalHours(thisWeekData),
    lastTwoWeeks: calculateTotalHours(lastTwoWeeksData),
    thisMonth: calculateTotalHours(thisMonthData),
    thisYear: calculateTotalHours(thisYearData)
  };
}; 