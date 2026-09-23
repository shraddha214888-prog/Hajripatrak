export type Gender = 'boy' | 'girl';

export type AttendanceStatus = 'P' | 'A' | 'L' | 'H'; // Present (હાજર), Absent (ગેરહાજર), Leave (રજા), Holiday (રવિવાર/જાહેર રજા)

export interface Student {
  id: string;
  rollNo: number;
  grNo: string;
  nameGu: string;
  nameEn: string;
  gender: Gender;
  avatar: string;
  fatherNameGu?: string;
  dob?: string;
  phone?: string;
}

export interface DayAttendanceItem {
  status: AttendanceStatus;
  note?: string;
  timestamp?: string;
}

export type DayAttendanceRecord = Record<string, DayAttendanceItem>; // studentId -> item

export interface AttendanceStore {
  // Keyed by date: YYYY-MM-DD
  [dateStr: string]: DayAttendanceRecord;
}

export interface SchoolInfo {
  schoolNameGu: string;
  schoolNameEn: string;
  standard: string;
  division: string;
  academicYear: string;
  clusterCRC: string;
  taluka: string;
  district: string;
  classTeacher: string;
  principal: string;
  udiseCode: string;
}
