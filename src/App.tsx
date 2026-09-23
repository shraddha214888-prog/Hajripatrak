/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Student,
  DayAttendanceRecord,
  AttendanceStatus,
  SchoolInfo,
  AttendanceStore,
} from './types/attendance';
import {
  loadStudents,
  saveStudents,
  loadAllAttendance,
  saveDayAttendance,
  saveAllAttendance,
  loadSchoolInfo,
  saveSchoolInfo,
  getTodayDateStr,
} from './utils/storage';
import { soundManager } from './utils/audio';
import { INITIAL_STUDENTS } from './data/students';

import { Header } from './components/Header';
import { DailyStats } from './components/DailyStats';
import { PhotoAttendanceGrid } from './components/PhotoAttendanceGrid';
import { MonthlyRegisterTable } from './components/MonthlyRegisterTable';
import { OfflineIndicator } from './components/OfflineIndicator';
import { StudentListManager } from './components/StudentListManager';
import { AnalyticsReport } from './components/AnalyticsReport';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { SingleStudentModal } from './components/SingleStudentModal';

import classroomImg from './assets/images/classroom_banner_students_1790144172960.jpg';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [attendanceStore, setAttendanceStore] = useState<AttendanceStore>(() => loadAllAttendance());
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayDateStr());
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => loadSchoolInfo());
  const [currentView, setCurrentView] = useState<'photo' | 'register' | 'students' | 'analytics'>('photo');

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Sync sound controller
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.setSoundEnabled(nextVal);
  };

  // Get current day's record
  const currentAttendance: DayAttendanceRecord = attendanceStore[selectedDate] || {};

  // Update attendance for a single student (called when clicking student photo!)
  const handleUpdateAttendance = (studentId: string, status: AttendanceStatus, note?: string) => {
    const updatedDay: DayAttendanceRecord = {
      ...currentAttendance,
      [studentId]: {
        status,
        note: note !== undefined ? note : currentAttendance[studentId]?.note,
        timestamp: new Date().toISOString(),
      },
    };

    const newStore: AttendanceStore = {
      ...attendanceStore,
      [selectedDate]: updatedDay,
    };

    setAttendanceStore(newStore);
    saveDayAttendance(selectedDate, updatedDay);
  };

  // Mark all 21 students Present in 1 click
  const handleQuickMarkAllPresent = () => {
    const updatedDay: DayAttendanceRecord = {};
    students.forEach((s) => {
      updatedDay[s.id] = {
        status: 'P',
        note: currentAttendance[s.id]?.note || '',
        timestamp: new Date().toISOString(),
      };
    });

    const newStore = { ...attendanceStore, [selectedDate]: updatedDay };
    setAttendanceStore(newStore);
    saveDayAttendance(selectedDate, updatedDay);
    soundManager.playAllPresentCelebration();
  };

  // Mark all students Absent
  const handleQuickMarkAllAbsent = () => {
    const updatedDay: DayAttendanceRecord = {};
    students.forEach((s) => {
      updatedDay[s.id] = {
        status: 'A',
        note: currentAttendance[s.id]?.note || '',
        timestamp: new Date().toISOString(),
      };
    });

    const newStore = { ...attendanceStore, [selectedDate]: updatedDay };
    setAttendanceStore(newStore);
    saveDayAttendance(selectedDate, updatedDay);
    soundManager.playAbsentTone();
  };

  // Reset today's attendance
  const handleResetToday = () => {
    if (window.confirm('શું તમે આજની હાજરી રીસેટ કરવા માંગો છો?')) {
      const newStore = { ...attendanceStore };
      delete newStore[selectedDate];
      setAttendanceStore(newStore);
      saveAllAttendance(newStore);
    }
  };

  // Update attendance from monthly register sheet cell
  const handleUpdateCell = (dateStr: string, studentId: string, status: AttendanceStatus) => {
    const dayRec = attendanceStore[dateStr] || {};
    const updatedDay: DayAttendanceRecord = {
      ...dayRec,
      [studentId]: {
        status,
        note: dayRec[studentId]?.note,
        timestamp: new Date().toISOString(),
      },
    };

    const newStore = {
      ...attendanceStore,
      [dateStr]: updatedDay,
    };

    setAttendanceStore(newStore);
    saveDayAttendance(dateStr, updatedDay);
  };

  // Update student profile / photo
  const handleUpdateStudent = (updatedStudent: Student) => {
    const updatedList = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    setStudents(updatedList);
    saveStudents(updatedList);
  };

  // Add new student
  const handleAddStudent = (newStudent: Student) => {
    const updatedList = [...students, newStudent].sort((a, b) => a.rollNo - b.rollNo);
    setStudents(updatedList);
    saveStudents(updatedList);
  };

  // Delete student
  const handleDeleteStudent = (studentId: string) => {
    const updatedList = students.filter((s) => s.id !== studentId);
    setStudents(updatedList);
    saveStudents(updatedList);

    // Also remove from attendance store
    setAttendanceStore((prev) => {
      const updatedStore = { ...prev };
      let changed = false;
      Object.keys(updatedStore).forEach((dateKey) => {
        if (updatedStore[dateKey][studentId]) {
          const dayCopy = { ...updatedStore[dateKey] };
          delete dayCopy[studentId];
          updatedStore[dateKey] = dayCopy;
          changed = true;
        }
      });
      if (changed) {
        saveAllAttendance(updatedStore);
      }
      return updatedStore;
    });
  };

  // Reset all students back to default
  const handleResetAllStudents = () => {
    setStudents(INITIAL_STUDENTS);
    saveStudents(INITIAL_STUDENTS);
  };

  // Update school settings
  const handleSaveSchoolInfo = (info: SchoolInfo) => {
    setSchoolInfo(info);
    saveSchoolInfo(info);
  };

  // Print
  const handlePrint = () => {
    if (currentView !== 'register') {
      setCurrentView('register');
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  const isToday = selectedDate === getTodayDateStr();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-200">
      
      {/* Top Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onPrint={handlePrint}
        schoolInfo={schoolInfo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        
        {/* Decorative Gujarati School Welcome Card (on Photo View) */}
        {currentView === 'photo' && (
          <div className="no-print relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white mb-6 shadow-sm">
            <div className="absolute inset-0 opacity-25">
              <img
                src={classroomImg}
                alt="વર્ગખંડ બેકગ્રાઉન્ડ"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-2xs text-sky-300 font-semibold uppercase tracking-wider flex-wrap">
                  <span>પ્રાથમિક શિક્ષણ વિભાગ · ગુજરાત રાજ્ય</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono bg-sky-950/80 px-2 py-0.5 rounded border border-sky-400/40 text-amber-300 font-bold tracking-normal normal-case">
                    UDISE: {schoolInfo.udiseCode}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tracking-normal normal-case font-bold text-white">તા. {schoolInfo.taluka}, જિ. {schoolInfo.district}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight text-white">
                  {schoolInfo.schoolNameGu} · ધોરણ ૭
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
                  કુલ {students.length} વિદ્યાર્થીઓ ({students.filter((s) => s.gender === 'boy').length} કુમાર અને {students.filter((s) => s.gender === 'girl').length} કન્યા). નીચે આપેલા કોઈપણ વિદ્યાર્થીના <span className="text-amber-300 font-bold">ફોટા પર ક્લિક કરતાં જ ઓટોમેટિક હાજરી</span> નોંધાઈ જશે.
                </p>
              </div>

              {/* Quick Today Shortcut Button */}
              <div className="flex items-center gap-2 shrink-0">
                {!isToday && (
                  <button
                    onClick={() => setSelectedDate(getTodayDateStr())}
                    className="px-3.5 py-2 text-xs font-bold text-sky-950 bg-sky-300 hover:bg-sky-200 rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    આજની તારીખ પર જાઓ ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Daily Statistics & Quick Actions Bar */}
        <div className="no-print">
          <DailyStats
            selectedDate={selectedDate}
            students={students}
            currentAttendance={currentAttendance}
            onQuickMarkAllPresent={handleQuickMarkAllPresent}
            onQuickMarkAllAbsent={handleQuickMarkAllAbsent}
            onResetToday={handleResetToday}
            isToday={isToday}
          />
        </div>

        {/* VIEW 1: Photo Grid Attendance (Main Requested Feature) */}
        {currentView === 'photo' && (
          <PhotoAttendanceGrid
            students={students}
            currentAttendance={currentAttendance}
            onUpdateAttendance={handleUpdateAttendance}
            onEditStudent={(st) => setEditingStudent(st)}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {/* VIEW 2: Monthly Register Table (Official Hajari Patrak) */}
        {currentView === 'register' && (
          <MonthlyRegisterTable
            students={students}
            attendanceStore={attendanceStore}
            schoolInfo={schoolInfo}
            onUpdateCell={handleUpdateCell}
            onPrint={handlePrint}
          />
        )}

        {/* VIEW 3: Student Directory & Custom Photos */}
        {currentView === 'students' && (
          <StudentListManager
            students={students}
            onUpdateStudent={handleUpdateStudent}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onResetAllStudents={handleResetAllStudents}
          />
        )}

        {/* VIEW 4: Analytics, Absentee list & MDM Meal Calculator */}
        {currentView === 'analytics' && (
          <AnalyticsReport
            students={students}
            attendanceStore={attendanceStore}
            selectedDate={selectedDate}
            schoolInfo={schoolInfo}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 mt-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>{schoolInfo.schoolNameGu}</strong> · ધોરણ ૭ હાજરી પત્રક ({students.length} વિદ્યાર્થીઓ: {students.filter((s) => s.gender === 'boy').length} કુમાર, {students.filter((s) => s.gender === 'girl').length} કન્યા)
          </div>
          <div className="flex items-center gap-2 text-2xs text-slate-400 flex-wrap justify-center">
            <span className="font-mono text-slate-600 font-semibold">UDISE: {schoolInfo.udiseCode}</span>
            <span>·</span>
            <span>તાલુકો: {schoolInfo.taluka}</span>
            <span>·</span>
            <span>જિલ્લો: {schoolInfo.district}</span>
            <span>·</span>
            <span>શિક્ષણ વિભાગ ગુજરાત</span>
          </div>
        </div>
      </footer>

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        students={students}
        currentAttendance={currentAttendance}
        selectedDate={selectedDate}
        schoolInfo={schoolInfo}
      />

      {/* School Settings Modal */}
      <SchoolSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        schoolInfo={schoolInfo}
        onSaveSchoolInfo={handleSaveSchoolInfo}
      />

      {/* Single Student Edit Modal */}
      <SingleStudentModal
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleUpdateStudent}
        onDelete={handleDeleteStudent}
      />

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />

    </div>
  );
}
