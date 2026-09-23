import { Student, AttendanceStore, SchoolInfo, DayAttendanceRecord } from '../types/attendance';
import { INITIAL_STUDENTS, DEFAULT_SCHOOL_INFO } from '../data/students';

const STORAGE_KEYS = {
  ATTENDANCE: 'nani_umarvan_attendance_v1',
  STUDENTS: 'nani_umarvan_students_v1',
  SCHOOL: 'nani_umarvan_school_v1',
  SOUND_ENABLED: 'nani_umarvan_sound_v1',
  SPEECH_ENABLED: 'nani_umarvan_speech_v1',
  AUTO_TAP_MODE: 'nani_umarvan_tap_mode_v1', // 'present-toggle' | 'cycle'
};

export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateGujarati(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  const monthsGu = [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
    'જુલાઇ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
  ];
  const monthIdx = parseInt(m, 10) - 1;
  const monthName = monthsGu[monthIdx] || m;
  return `${parseInt(d, 10)} ${monthName} ${y}`;
}

export function getDayOfWeekGujarati(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const daysGu = ['રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'];
  return daysGu[d.getDay()];
}

export function loadSchoolInfo(): SchoolInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHOOL);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Auto-migrate if previously saved with placeholder data
      if (
        !parsed.udiseCode ||
        parsed.udiseCode === '24190403501' ||
        parsed.taluka === 'પાવી જેતપુર' ||
        parsed.district === 'છોટાઉદેપુર'
      ) {
        parsed.udiseCode = '24170307402';
        parsed.taluka = 'હાલોલ';
        parsed.district = 'પંચમહાલ';
        saveSchoolInfo({ ...DEFAULT_SCHOOL_INFO, ...parsed });
      }
      return { ...DEFAULT_SCHOOL_INFO, ...parsed };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SCHOOL_INFO;
}

export function saveSchoolInfo(info: SchoolInfo): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(info));
  } catch {
    // fallback
  }
}

export function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_STUDENTS;
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch {
    // fallback
  }
}

export function loadAllAttendance(): AttendanceStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  // Pre-seed current month with sensible attendance for a few weekdays if empty
  const initialStore = generateSampleAttendanceSeed();
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialStore));
  } catch {
    // ignored
  }
  return initialStore;
}

export function saveAllAttendance(store: AttendanceStore): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(store));
  } catch {
    // fallback
  }
}

export function saveDayAttendance(dateStr: string, records: DayAttendanceRecord): void {
  const store = loadAllAttendance();
  store[dateStr] = records;
  saveAllAttendance(store);
}

// Generate realistic past school days attendance for the current month
function generateSampleAttendanceSeed(): AttendanceStore {
  const store: AttendanceStore = {};
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // Seed previous days of current month up to yesterday
  const currentDay = today.getDate();
  for (let day = 1; day <= Math.min(currentDay, 28); day++) {
    const d = new Date(year, month, day);
    const dayOfWeek = d.getDay();
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (dayOfWeek === 0) {
      // Sunday - Holiday
      const rec: DayAttendanceRecord = {};
      INITIAL_STUDENTS.forEach((st) => {
        rec[st.id] = { status: 'H', note: 'રવિવાર' };
      });
      store[dayStr] = rec;
    } else {
      // Normal school day - mostly present with 1-2 absent or leave
      const rec: DayAttendanceRecord = {};
      INITIAL_STUDENTS.forEach((st) => {
        // High attendance typical in Gujarat primary schools (~90-95%)
        const randomVal = (st.rollNo * 7 + day * 13) % 100;
        let status: 'P' | 'A' | 'L' = 'P';
        let note = '';
        if (randomVal > 95) {
          status = 'A';
          note = 'ગેરહાજર';
        } else if (randomVal > 91) {
          status = 'L';
          note = 'માંદગી રજા';
        }
        rec[st.id] = { status, note };
      });
      store[dayStr] = rec;
    }
  }

  return store;
}
