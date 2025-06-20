export interface PunchRecord {
  id: string;
  date: string; // YYYY-MM-DD format
  punchIn?: string; // ISO string
  punchOut?: string; // ISO string
  totalHours?: number;
  notes?: string;
}

export interface TodayPunchData {
  punchIn?: string;
  punchOut?: string;
  isCurrentlyWorking: boolean;
  totalHours: number;
} 